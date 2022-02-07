import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';

@Injectable()
export class XpService {

  private xpCollector = new ReplaySubject<number>(1);
  constructor() { }

  provideXp(xpGiven: number) {
    this.xpCollector.next(xpGiven);
  }

  xpGain(): Observable<number> {
    return this.xpCollector.asObservable();
  }
}
