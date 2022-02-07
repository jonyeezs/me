import {
  AnimationEvent, transition,
  animate, trigger, keyframes, style
} from '@angular/animations';
import { Component, OnInit, ChangeDetectionStrategy, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-xp-viewer',
  template: `
    <div [@xpGainedAnimation]="showXpGained" (@xpGainedAnimation.done)="captureDoneEvent($event)"
      class="p-4 h-9/12 overflow-auto
      border-4 border-solid border-blue-900 rounded-lg
    bg-neutral-200 opacity-0">
      <h1 class="font-bold">Experience gained in passion</h1>
      <p class="p-1">
        I wonder if this make sense what it is about
        I wonder if this make sense what it is about
        I wonder if this make sense what it is about
        I wonder if this make sense what it is about
      </p>
    </div>
    <div @xpFloatAnimation (@xpFloatAnimation.done)="captureDoneEvent($event)" 
    class="mt-6 mx-auto font-extrabold floating-xp">
      ✨
    </div>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
    }
  `],
  animations: [
    trigger("xpFloatAnimation", [
      transition(":enter", animate('300ms linear', keyframes([
        style({ offset: 0, transform: 'translateY(-4px)'}),
        style({ offset: 0.2, transform: 'translateY(-6px)' }),
        style({ offset: 0.4, transform: 'translateY(-16px)' }),
        style({ offset: 0.7, transform: 'translateY(-20px)', opacity: 1 }),
        style({ offset: 1, transform: 'translateY(-28px)', opacity: 0 })
      ]))),
    ]),
    trigger("xpGainedAnimation", [
      transition(":enter", animate('500ms 500ms ease-out', keyframes([
        style({ offset: 0, opacity: 0 }),
        style({ offset: 1, opacity: 1 }),
      ]))),
    ]),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class XpViewerComponent implements OnInit {
  public showXpGained: boolean;

  constructor(private renderer: Renderer2) { }

  ngOnInit(): void {
    this.showXpGained = false;
  }

  captureDoneEvent(event: AnimationEvent) {
    if (event.triggerName === 'xpFloatAnimation') {
      this.renderer.setStyle(event.element, 'opacity', 0);
      this.showXpGained = true;
    }

    if (event.triggerName === 'xpGainedAnimation') {
      this.renderer.setStyle(event.element, 'opacity', 1);
    }
  }

}
