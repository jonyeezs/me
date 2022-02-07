import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {OverlayModule} from '@angular/cdk/overlay';
import { GainerDirective } from './gainer.directive';
import { XpViewerComponent } from './xp-viewer.component';



@NgModule({
  imports: [
    CommonModule,
    OverlayModule
  ],
  declarations: [
    GainerDirective,
    XpViewerComponent
  ],
  exports: [
    GainerDirective
  ]
})
export class XpModule { }
