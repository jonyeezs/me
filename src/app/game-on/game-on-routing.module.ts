import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GameOnComponent } from './game-on.component';

const routes: Routes = [{ path: '', component: GameOnComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GameOnRoutingModule { }
