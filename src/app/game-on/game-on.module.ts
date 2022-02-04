import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GameOnRoutingModule } from './game-on-routing.module';
import { GameOnComponent } from './game-on.component';
import { HeroModule } from './hero/hero.module';
import { ControllerService } from './services/controller/controller.service';


@NgModule({
  declarations: [
    GameOnComponent,
  ],
  imports: [
    CommonModule,
    GameOnRoutingModule,
    HeroModule
  ],
  providers: [ControllerService]
})
export class GameOnModule { }
