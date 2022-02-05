import {
  Component, ChangeDetectionStrategy,
  ElementRef, ViewChild, forwardRef
} from '@angular/core';
import { GameContainer } from './container.token';

@Component({
  selector: 'app-container',
  template: `
    <div class="w-7/12 flex justify-between 
    border border-solid border-gray-700 relative" #container>
      <ng-content></ng-content>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: GameContainer,
      useExisting: forwardRef(() => ContainerComponent)
    }]
})
export class ContainerComponent implements GameContainer {

  @ViewChild('container', { static: true, read: ElementRef })
  private element: ElementRef<HTMLElement>;
  
  constructor() { }

  public get boundingRect(): DOMRect {
    return this.element.nativeElement.getBoundingClientRect();
  }
}
