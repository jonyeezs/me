import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GameOnRoutingModule } from './game-on-routing.module';
import { GameOnComponent } from './game-on.component';


@NgModule({
  declarations: [
    GameOnComponent
  ],
  imports: [
    CommonModule,
    GameOnRoutingModule
  ]
})
export class GameOnModule { }
