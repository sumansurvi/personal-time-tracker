import { Component } from '@angular/core';
import { CommonPointService } from '../_service/common-point.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  totalTime: string;

  constructor(public service: CommonPointService) { }
  ngOnInit() {
    this.service.totalTimeSpend$.subscribe(totalTime => {
      this.totalTime = totalTime;
    });
  }

}
