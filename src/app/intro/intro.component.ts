import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.css']
})
export class IntroComponent  {

  constructor(private router: Router) { }

  @HostListener('window:keyup.o', [])
  continue() {
    this.router.navigate(['game-on']);
  }
}
