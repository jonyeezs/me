import {
  Component, ChangeDetectionStrategy,
  ElementRef, OnDestroy, AfterViewInit, OnInit,
} from '@angular/core';
import { distinctUntilChanged, map, Subscription } from 'rxjs';
import { GameContainer } from '../container/container.token';
import { CollisionService } from '../services/collision.service';
import { SpawnCommunicator } from './spawn.token';

@Component({
  selector: 'app-mob',
  template: ``,
  styles: [
    `
      :host {
        display: block;
        position: absolute;
        left: 100%;
        width: 2rem;
        height: 2.25rem;
        background-color: red; 
        transform: translateX(0px);
        will-change: transform;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MobComponent implements OnInit, AfterViewInit, OnDestroy {
  /**
   * your call card
   */
  public callCard: string

  private walkingAnimation: Animation;
  private collisionSubscription: Subscription;

  constructor(
    private mobEle: ElementRef<HTMLElement>,
    private container: GameContainer,
    private spawn: SpawnCommunicator,
    private collision: CollisionService) { }
  
  
  ngOnInit(): void {
    this.mobEle.nativeElement.dataset['callingcard'] = this.callCard;

    this.collision.register('mob', this.mobEle.nativeElement);

    this.collisionSubscription = this.collision.collisionDetect()
      .pipe(
        map(mbs => mbs.some(m => m === this.callCard)),
        distinctUntilChanged())
      .subscribe((hasCollided) => {
        if (hasCollided) {
          this.walkingAnimation.pause();
        } else {
          this.walkingAnimation?.playState === 'paused' && this.walkingAnimation.play();
        }
      });
  }
  
  ngAfterViewInit(): void {
    const mobWalking: Keyframe[] = [
      { transform: 'translateX(0px)' },
      { transform: `translateX(-${this.container.boundingRect.width + 100}px)` }
    ];
    const walkTiming: EffectTiming = {
      duration: (Math.floor(Math.random() * 3) + 5) * 1000,
      iterations: 1,
      easing: 'linear',
    };

    this.walkingAnimation = this.mobEle.nativeElement.animate(mobWalking, walkTiming);
    
    this.walkingAnimation.finished.then(() => {
      this.spawn.done(this.callCard);
    })
  }

  ngOnDestroy(): void {
    this.walkingAnimation.cancel();
    this.collision.unregister('mob', this.mobEle.nativeElement);
    this.collisionSubscription.unsubscribe();
  }
}
