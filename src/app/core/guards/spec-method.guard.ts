import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, Router } from '@angular/router';
import { DataStoreService } from '../services/data-store.service';
import { NotifierService } from 'angular-notifier';

@Injectable({
  providedIn: 'root'
})
export class SpecMethodGuard implements CanActivate {

  constructor(
    private router: Router,
    private dataStoreService: DataStoreService,
    private notifierService: NotifierService
  ) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const alternativesValid = this.dataStoreService.alternatives.length >= this.dataStoreService.alternativesMinCount;
    const criterionsValid = this.dataStoreService.criterions.filter(x =>
      x.active &&
      x.state !== undefined
    ).length >= this.dataStoreService.criterionsMinCount;

    if (alternativesValid && criterionsValid) {
      return true;
    }

    this.notifierService.notify('info', `
      Для использования специального метода значения весов критериев заполнять не нужно
    `);
    this.notifierService.notify('warning', `
      Минимальное количество альтернатив: ${this.dataStoreService.alternativesMinCount}.
      Минимальное количество выбранных критериев: ${this.dataStoreService.criterionsMinCount}
    `);
    this.router.navigateByUrl('/calc').then(_ => {
      return false;
    });
  }

}
