import { ComponentRef, Directive, Injector, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { uniqueNamesGenerator, adjectives, starWars } from 'unique-names-generator';
import { ControllerService } from '../services/controller/controller.service';
import { pauseResume } from '../utils/pause-resume.rxjs';
import { MobComponent } from './mob.component';
import { SpawnCommunicator } from './spawn.token';

@Directive({
  selector: '[appMobSpawn]'
})
export class SpawnDirective implements OnInit, OnDestroy, SpawnCommunicator {

  private mobs = new Map<string, ComponentRef<MobComponent>>();

  private mobGeneratorSubscription: Subscription;

  constructor(
    private controller: ControllerService,
    private viewContainerRef: ViewContainerRef,
    private injector: Injector) {}
  
  ngOnInit(): void {
    this.mobGeneratorSubscription = interval(3000).pipe(
      pauseResume(this.controller))
      .subscribe(() => this.spawnMob());
  }

  ngOnDestroy(): void {
    this.mobGeneratorSubscription?.unsubscribe();
  }

  done(callCard: string): void {
    this.mobs.get(callCard)?.destroy();
    this.mobs.delete(callCard);
  }

  spawnMob() {
    const mob = this.viewContainerRef.createComponent<MobComponent>(MobComponent, {
      index: this.viewContainerRef.length,
      injector: Injector.create({
        providers: [
          {
            provide: SpawnCommunicator,
            useValue: this,
          }
        ],
        parent: this.injector
      })
    });
    mob.instance.callCard = uniqueNamesGenerator({dictionaries: [adjectives, starWars]});
    this.mobs.set(mob.instance.callCard, mob);
  }

}
