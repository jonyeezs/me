import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { ReplaySubject } from 'rxjs';

@Injectable()
export class CollisionService implements OnDestroy {

  private readonly DISTANCE_TO_INITIATE = 18;
  private collisionDetection: number;
  private heroObserver: HTMLElement;
  private mobObservers = new Set<HTMLElement>();
  private collisionStream: ReplaySubject<string[]>;
  
  constructor(private ngZone: NgZone) { 
    this.collisionStream = new ReplaySubject(1);
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.collisionDetection);
  }

  public collisionDetect() {
    return this.collisionStream.asObservable();
  }

  public register(node: 'hero' | 'mob', element: HTMLElement) {
    if (this.collisionDetection === undefined) {
      this.ngZone.runOutsideAngular(() => {
        this.collisionDetection = requestAnimationFrame((t) => this.detect(t));
      });
    }

    switch (node) {
      case 'hero':
        this.heroObserver = element;
        break;
      case 'mob':
        this.mobObservers.add(element);
        break;
      default:
        throw new Error('node not supported');
    }
  }

  public unregister(node: 'hero' | 'mob', element: HTMLElement) {
     switch (node) {
       case 'hero':
         // @ts-ignore
         this.heroObserver = undefined;
         cancelAnimationFrame(this.collisionDetection);
        break;
      case 'mob':
        this.mobObservers.delete(element);
        break;
      default:
        throw new Error('node not supported');
    }
  }

  private previousTimeStamp: DOMHighResTimeStamp; 
  private detect(time: DOMHighResTimeStamp): void {
    // initializing the detection cycle
    if (this.previousTimeStamp === undefined) {
      this.previousTimeStamp = time; 
    }

    const timeLapse = time - this.previousTimeStamp;
    
    if (timeLapse > 100) {
      this.previousTimeStamp = time;

      const collided = Array.from(this.mobObservers)
      .filter((mob) => {
        const heroLoc = this.heroObserver.getBoundingClientRect();
        const mobLoc = mob.getBoundingClientRect();
          // minus 2 to give some mercy of the attack space so the mob won't
          // run away if they just touched each other.
          // Also increase the collision earlier with DISTANCE_TO_INITIATE;
          // I suppose you could say the hero has a weapon of that length?
          if (heroLoc.x + heroLoc.width - 2 <= mobLoc.x &&
              mobLoc.x - (heroLoc.x + heroLoc.width) < this.DISTANCE_TO_INITIATE ) {
              return true;
          } else {
            return false;
          }
        })
        .map(m => {
          const mobName = m.dataset['callingcard'];
          if (mobName === undefined) {
            throw new Error('mob has not been given a calling card')
          }
          return mobName;
        });
      
      this.collisionStream.next(collided);
    }
    
    this.collisionDetection = requestAnimationFrame((t) => this.detect(t));
  }
}
