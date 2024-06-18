import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { AddTaskModalComponent } from '../add-task-modal/add-task-modal.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CommonPointService } from '../_service/common-point.service';

// Define an interface for Timer objects
interface Timer {
  id: number;
  title: string;
  time: number;
  isRunning: boolean;
  history: string[];
}

@Component({
  selector: 'app-timer',
  standalone: true,
  imports: [CommonModule, MatDialogModule, AddTaskModalComponent],
  templateUrl: './timer.component.html',
  styleUrl: './timer.component.scss'
})
export class TimerComponent implements OnInit, OnDestroy {

  timers: Timer[] = []; // Array to hold timer objects
  private intervalIds: { [key: number]: any } = {}; // Object to keep track of interval IDs for each timer
  private timerIdCounter: number = 0; // Counter to assign unique IDs to timers
  totalTime: number = 0; // Variable to store the total time of all timers

  @Output() totalTimeChanged = new EventEmitter<number>();

  constructor(
    public dialog: MatDialog,
    public service: CommonPointService) {
  }

  // Lifecycle hook that runs when the component is initialized
  ngOnInit() {
    this.loadTimers(); // Load timers from local storage
    this.calculateTotalTime();
  }

  // Method to start a timer
  startTimer(timer: Timer): void {
    if (!timer.isRunning) {
      timer.isRunning = true; // Mark the timer as running
      this.deleteInitialHistory(timer);
      timer.history.push(`Started the timer at ${new Date().toLocaleString()} (Active)`); // Log start time

      // Set an interval to increment the timer's time every second
      this.intervalIds[timer.id] = setInterval(() => {
        timer.time++;
        this.saveTimers(); // Save timers to local storage
      }, 1000);
    }
  }

  // Method to stop a timer
  stopTimer(timer: Timer): void {
    if (timer.isRunning) {
      clearInterval(this.intervalIds[timer.id]); // Clear the interval
      delete this.intervalIds[timer.id]; // Remove the interval ID from tracking
      timer.isRunning = false; // Mark the timer as not running
      // Log stop time
      timer.history[timer.history.length + 1] = `Started the timer at ${timer.history[timer.history.length - 1].split(' (')[0]} & Stopped at ${new Date().toLocaleString()}`;
      this.saveTimers(); // Save timers to local storage
    }
    this.calculateTotalTime();
  }

  // Method to reset a timer
  resetTimer(timer: Timer): void {
    this.stopTimer(timer); // Stop the timer if it's running
    timer.time = 0; // Reset time to zero
    timer.history = ['No History Found, Click on the start button to track the timer']; // Reset history
    this.saveTimers(); // Save timers to local storage
  }

  // Method to delete a timer
  deleteTimer(timer: Timer): void {
    this.stopTimer(timer); // Stop the timer if it's running
    this.timers = this.timers.filter(t => t.id !== timer.id); // Remove the timer from the array
    this.saveTimers(); // Save timers to local storage
  }

  // Lifecycle hook that runs when the component is destroyed
  ngOnDestroy() {
    // Stop all timers when the component is destroyed
    this.timers.forEach(timer => {
      this.stopTimer(timer);
    });
  }

  // Method to format time into HH : MM : SS
  formatTime(seconds: number): string {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${this.pad(hrs)} : ${this.pad(mins)} : ${this.pad(secs)}`;
  }

  // Helper method to pad numbers with leading zeros if needed
  pad(num: number): string {
    return num < 10 ? `0${num}` : `${num}`;
  }


  // Method to save a new timer
  saveTimer(taskTitle: string): void {
    this.timers.push({
      id: this.timerIdCounter++, // Assign unique ID
      title: taskTitle,
      time: 0,
      isRunning: false,
      history: ['No History Found, Click on the start button to track the timer']
    });
    this.saveTimers(); // Save timers to local storage
  }

  // Method to save timers to local storage
  saveTimers(): void {
    localStorage.setItem('timers', JSON.stringify(this.timers));
  }

  loadTimers(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedTimers = localStorage.getItem('timers');
      if (storedTimers) {
        this.timers = JSON.parse(storedTimers);
        if (this.timers.length > 0) {
          this.timerIdCounter = this.timers[this.timers.length - 1].id + 1;
        }
      }
    }
  }


  // Open the dialog to add a new task
  openDialog(): void {
    const dialogRef = this.dialog.open(AddTaskModalComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.saveTimer(result); // Add the new task if dialog returns a result
        window.location.reload();
      }
    });
  }

  calculateTotalTime() {
    let totalSeconds = this.timers.reduce((total, timer) => total + timer.time, 0);

    if (totalSeconds <= 0) {
      this.service.totalTimeSpend = '0 hour';
      return
    }

    //formatting total time calculation
    const hours = Math.floor(totalSeconds / 3600);
    const remainingMinutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      this.service.totalTimeSpend = `${hours} hour${hours > 1 ? 's' : ''} ${remainingMinutes} minute${remainingMinutes > 1 ? 's' : ''}`;
    } else if (remainingMinutes > 0) {
      this.service.totalTimeSpend = `${remainingMinutes} minute${remainingMinutes > 1 ? 's' : ''} ${seconds} second${seconds > 1 ? 's' : ''}`;
    } else {
      this.service.totalTimeSpend = `${seconds} second${seconds > 1 ? 's' : ''}`;
    }
  }

  deleteInitialHistory(timer: Timer) {
    timer.history = timer.history.filter(entry => entry !== "No History Found, Click on the start button to track the timer");
  }

}

