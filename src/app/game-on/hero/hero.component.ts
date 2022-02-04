import {
  Component, OnInit, ChangeDetectionStrategy, ViewChild, ElementRef, OnDestroy
} from '@angular/core';
import { Subscription } from 'rxjs';
import { ControllerService } from '../services/controller/controller.service';

@Component({
  selector: 'app-hero',
  template: `
    <div #body class="w-8 h-10 bg-slate-700 translate-x-0 will-change-transform">
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeroComponent implements OnInit, OnDestroy {

  @ViewChild('body', { static: true, read: ElementRef })
  public body: ElementRef<HTMLElement>;

  private subscriptions = new Subscription();

  private readonly MOVEMENT = '--tw-translate-x';
  private readonly STEPSIZE = 3;

  constructor(private controller: ControllerService) { }
  
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
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private retrievePosition() {
    const raw = getComputedStyle(this.body.nativeElement).getPropertyValue(this.MOVEMENT);
    const value = (/(?: |)(\d+)px/.exec(raw) ?? [null ,0])[1] ?? 0;
    return +value;
  }

}
