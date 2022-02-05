import {
  Component, ChangeDetectionStrategy,
  ElementRef, OnDestroy, AfterViewInit,
} from '@angular/core';
import { GameContainer } from '../container/container.token';
import { SpawnCommunicator } from './spawn.token';

@Component({
  selector: 'app-mob',
  template: `
    {{ callCard }}
  `,
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
export class MobComponent implements AfterViewInit, OnDestroy {
  /**
   * your call card
   */
  public callCard: string

  private walkingAnimation: Animation;

  constructor(
    private mobEle: ElementRef<HTMLElement>,
    private container: GameContainer,
    private spawn: SpawnCommunicator) { }
  
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
  }
}
