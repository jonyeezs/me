import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MobComponent } from './mob.component';
import { SpawnDirective } from './spawn.directive';



@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    MobComponent,
    SpawnDirective,
  ],
  exports: [
    SpawnDirective
  ]
})
export class MobModule { }
