import { ComponentRef, Directive, Injector, ViewContainerRef } from '@angular/core';
import { uniqueNamesGenerator, adjectives, starWars } from 'unique-names-generator';
import { MobComponent } from './mob.component';
import { SpawnCommunicator } from './spawn.token';

@Directive({
  selector: '[appMobSpawn]'
})
export class SpawnDirective implements SpawnCommunicator {

  private mobs = new Map<string, ComponentRef<MobComponent>>();

  constructor(
    private viewContainerRef: ViewContainerRef,
    private injector: Injector) { 
    setInterval(() => this.spawnMob(), 4000);
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
