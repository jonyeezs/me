import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GameOnRoutingModule } from './game-on-routing.module';
import { GameOnComponent } from './game-on.component';
import { HeroModule } from './hero/hero.module';
import { ControllerService } from './services/controller/controller.service';
import { MobModule } from './mob/mob.module';
import { ContainerModule } from './container/container.module';
import { CollisionService } from './services/collision/collision.service';
import { XpModule } from './xp/xp.module';
import { XpService } from './services/xp/xp.service';


@NgModule({
  declarations: [
    GameOnComponent,
  ],
  imports: [
    CommonModule,
    GameOnRoutingModule,
    ContainerModule,
    HeroModule,
    MobModule,
    XpModule
  ],
  providers: [ControllerService, CollisionService, XpService]
})
export class GameOnModule { }
