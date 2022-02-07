import { Directive, ElementRef, Host, OnDestroy, OnInit } from '@angular/core';
import { Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';

import { filter, Subscription, tap } from 'rxjs';
import { XpService } from '../services/xp/xp.service';
import { XpViewerComponent } from './xp-viewer.component';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[app-xpGainer]'
})
export class GainerDirective implements OnInit, OnDestroy {

  private xpSubscription: Subscription;
  private xpCeremonyInProgress: boolean;
  constructor(
    private xp: XpService,
    @Host() private character: ElementRef<HTMLElement>,
    private overlay: Overlay) { }
  
  ngOnInit(): void {
    this.xpCeremonyInProgress = false;

    const positionStrategy = this.overlay.position()
      .flexibleConnectedTo(this.character)
      .withPositions([{
        originX: 'end', originY: 'top',
        overlayX: 'center', overlayY: 'bottom',
      }])
      .withLockedPosition()
      .withGrowAfterOpen();
    
    this.xpSubscription = this.xp.xpGain().pipe(
      filter(() => !this.xpCeremonyInProgress),
      tap(() => { this.xpCeremonyInProgress = true; })
    ).subscribe(() => {
      const pos = this.character.nativeElement.getBoundingClientRect();
      const overlayRef = this.overlay.create({
        disposeOnNavigation: false,
        hasBackdrop: false,
        positionStrategy,
        width: '60%',
        height: `${pos.y * 75 / 100}px`
      });
      const xpViewerPortal = new ComponentPortal(XpViewerComponent);
      overlayRef.attach(xpViewerPortal);
    });
  }

  ngOnDestroy(): void {
    this.xpSubscription?.unsubscribe();
  }

}
