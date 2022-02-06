import {
  Component, ChangeDetectionStrategy,
  ElementRef, ViewChild, forwardRef
} from '@angular/core';
import { GameContainer } from './container.token';

@Component({
  selector: 'app-container',
  template: `
<div class="w-12/12 md:w-6/12 h-[480px] md:h-[250px] overflow-x-hidden flex flex-col justify-end">  
  <div class="w-12/12 flex justify-between 
    border-b-8 border-solid border-amber-900 relative" #container>
      <ng-content></ng-content>
  </div>
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
