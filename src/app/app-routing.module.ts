import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [{
    path: '', loadChildren: () => import('./intro/intro.module').then(m => m.IntroModule)
  },
  {
    path: 'game-on',
    loadChildren: () => import('./game-on/game-on.module').then(m => m.GameOnModule)
  }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
