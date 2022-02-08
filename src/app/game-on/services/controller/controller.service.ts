import { Injectable } from '@angular/core';

import { filter, fromEvent, map, mergeWith, Observable, Subject } from 'rxjs';

@Injectable()
export class ControllerService {

  private playStateStream: Subject<'pause' | 'resume'>;

  constructor() { 
    this.playStateStream = new Subject();
  }

  public left(): Observable<boolean> {
    return fromEvent<KeyboardEvent>(document, 'keydown')
      .pipe(
        filter((k: KeyboardEvent) => k.key === "ArrowLeft" || k.key === "Left"),
        map(() => true)
      );
  }

    public right(): Observable<boolean> {
    return fromEvent<KeyboardEvent>(document, 'keydown')
      .pipe(
        filter((k: KeyboardEvent) => k.key === "ArrowRight" || k.key === "Right"),
        map(() => true)
      );
    }
  
  public attack(): Observable<boolean> {
    return fromEvent<KeyboardEvent>(document, 'keydown').pipe(
      mergeWith(fromEvent<KeyboardEvent>(document, 'keyup')),
      filter((k: KeyboardEvent) => k.key === "a"),
      map(k => k.type === 'keydown')
    )
  }

  public pause() {
    this.playStateStream.next('pause');
  }

  public resume() {
    this.playStateStream.next('resume');
  }

  public playStateChange(): Observable<'pause' | 'resume'> {
    return this.playStateStream.asObservable();
  }

  public continue(): Observable<boolean> {
    return fromEvent<KeyboardEvent>(document, 'keydown')
    .pipe(
        filter((k: KeyboardEvent) => k.key === "o"),
        filter(k => !k.repeat),
        map(() => true)
      );
  }
}
