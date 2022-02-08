import {
  Component, ChangeDetectionStrategy,
  ElementRef, OnDestroy, AfterViewInit, OnInit,
} from '@angular/core';
import { distinctUntilChanged, map, of, Subject, switchMap, takeUntil } from 'rxjs';
import { GameContainer } from '../container/container.token';
import { CollisionService } from '../services/collision/collision.service';
import { ControllerService } from '../services/controller/controller.service';
import { XpService } from '../services/xp/xp.service';
import { pauseResume } from '../utils/pause-resume.rxjs';
import { SpawnCommunicator } from './spawn.token';

@Component({
  selector: 'app-mob',
  template: `{{ callCard }}`,
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

  private HP: number;
  private walkingAnimation: Animation;
  private killCode = new Subject<void>();

  constructor(
    private mobEle: ElementRef<HTMLElement>,
    private container: GameContainer,
    private spawn: SpawnCommunicator,
    private collision: CollisionService,
    private controller: ControllerService,
    private xp: XpService) { }
  
  
  ngOnInit(): void {
    this.HP = 3;
    this.mobEle.nativeElement.dataset['callingcard'] = this.callCard;

    this.collision.register('mob', this.mobEle.nativeElement);

    this.collision.collisionDetect()
      .pipe(
        map(mbs => mbs.some(m => m === this.callCard)),
        distinctUntilChanged(),
        takeUntil(this.killCode))
      .subscribe((hasCollided) => {
        if (hasCollided) {
          this.walkingAnimation.pause();
        } else {
          this.walkingAnimation?.playState === 'paused' && this.walkingAnimation.play();
        }
      });
    
    this.controller.playStateChange().pipe(takeUntil(this.killCode))
      .subscribe(state => {
        if (state === 'pause' && this.walkingAnimation.playState !== 'paused') {
          this.walkingAnimation.pause();
        }
        if (state === 'resume' && this.walkingAnimation.playState === 'paused') {
          this.walkingAnimation.play();
        }
      });
    
    this.battlePrep();
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
    
    this.walkingAnimation.finished.catch().finally(() => {
      this.spawn.done(this.callCard);
    });
  }

  ngOnDestroy(): void {
    this.walkingAnimation.cancel();
    this.killCode.next();
    this.killCode.complete();
    this.collision.unregister('mob', this.mobEle.nativeElement);
  }

  private battlePrep() {
    this.collision.collisionDetect().pipe(
      map(mbs => mbs.some(m => m === this.callCard)),
      distinctUntilChanged(),
      switchMap((hasCollided) => hasCollided ? this.controller.attack() : of(false)),
      pauseResume(this.controller),
      takeUntil(this.killCode)).pipe(
    ).subscribe((isAttacked) => {
      if (!isAttacked) {
        return;
      }

      this.HP--;
      if (this.HP <= 0) {
        this.killCode.next();
        this.spawn.done(this.callCard);
        this.xp.provideXp(1);
      }
    });
  }
}
