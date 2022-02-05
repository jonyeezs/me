import { Injectable } from '@angular/core';

import { debounceTime, distinctUntilChanged, filter, fromEvent, map, Observable } from 'rxjs';

@Injectable()
export class ControllerService {

  constructor() { }

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
    return fromEvent<KeyboardEvent>(document, 'keyup')
      .pipe(
        map((k: KeyboardEvent) => k.key === "a"),
        distinctUntilChanged(),
        debounceTime(200),
      );
  }

  public stop(): Observable<boolean> {
     return fromEvent<KeyboardEvent>(document, 'keyup')
      .pipe(
        map(() => true)
      );
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
