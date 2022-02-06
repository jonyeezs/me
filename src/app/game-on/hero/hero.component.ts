import {
  Component, OnInit, ChangeDetectionStrategy, ViewChild, ElementRef, OnDestroy
} from '@angular/core';
import { combineLatest, distinctUntilChanged, map, Observable, Subscription, tap } from 'rxjs';
import { CollisionService } from '../services/collision/collision.service';
import { ControllerService } from '../services/controller/controller.service';

@Component({
  selector: 'app-hero',
  template: `
    <div #body class="w-8 h-10 bg-slate-700 translate-x-0 will-change-transform">
      <ng-container *ngIf="attack$ | async as attack">
        <div>
          {{ attack }}
        </div>
      </ng-container>  
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeroComponent implements OnInit, OnDestroy {

  @ViewChild('body', { static: true, read: ElementRef })
  public body: ElementRef<HTMLElement>;

  /**
   * pow - when there's a mob to hit
   * empty string - idle
   */
  public attack$: Observable<'pow'|''>;

  private subscriptions = new Subscription();

  private readonly MOVEMENT = '--tw-translate-x';
  private readonly STEPSIZE = 3;

  constructor(private controller: ControllerService, private collision: CollisionService) { }
  
  ngOnInit(): void {
    this.subscriptions.add(
      this.controller.right().subscribe(() => {
        const currentPosition = this.retrievePosition();
        const newPos = currentPosition + this.STEPSIZE;
        this.body.nativeElement.style.setProperty(this.MOVEMENT, `${newPos}px`);
      })
    );

    this.subscriptions.add(
      this.controller.left().subscribe(() => {
        const currentPosition = this.retrievePosition();
        const newPos = currentPosition - this.STEPSIZE;
        this.body.nativeElement.style.setProperty(this.MOVEMENT, `${newPos}px`);
      })
    );

    this.collision.register('hero', this.body.nativeElement);

    this.attack$ = combineLatest([
      this.collision.collisionDetect().pipe(map(mbs => mbs.length > 0), distinctUntilChanged()),
      this.controller.attack()])
      .pipe(
        map(([hasMob, attacking]) => attacking && hasMob ? 'pow' : ''));
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.collision.unregister('mob', this.body.nativeElement);
  }

  private retrievePosition() {
    const raw = getComputedStyle(this.body.nativeElement).getPropertyValue(this.MOVEMENT);
    const value = (/(?: |)(\d+)px/.exec(raw) ?? [null ,0])[1] ?? 0;
    return +value;
  }
}
