import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonPointService {

  constructor() { }

  private totalTimeSource = new BehaviorSubject<string>('');
  totalTimeSpend$ = this.totalTimeSource.asObservable();

  set totalTimeSpend(value: string) {
    this.totalTimeSource.next(value);
  }

  get totalTimeSpend(): string {
    return this.totalTimeSource.getValue();
  }

}
