import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, Router } from '@angular/router';
import { DataStoreService } from '../services/data-store.service';
import { NotifierService } from 'angular-notifier';

@Injectable({
  providedIn: 'root'
})
export class FillGuard implements CanActivate {

  constructor(
    private router: Router,
    private dataStoreService: DataStoreService,
    private notifierService: NotifierService
  ) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const alternativesValid = this.dataStoreService.currentDataset.alternatives.length >= this.dataStoreService.alternativesMinCount;
    const criterionsValid = this.dataStoreService.criterionsList.filter(x =>
      x.active &&
      x.state !== undefined &&
      x.weight !== undefined
    ).length >= this.dataStoreService.criterionsMinCount;

    if (alternativesValid && criterionsValid) {
      return true;
    }

    if (!criterionsValid) {
      this.notifierService.notify('info', `
        Для использования специального метода значения весов критериев заполнять не нужно
      `);
      this.notifierService.notify('warning', `
        Минимальное количество выбранных критериев: ${this.dataStoreService.criterionsMinCount}.
        Для продолжения необходимо заполнить поля выбранных критериев (макс/мин, вес)
      `);
    }
    if (!alternativesValid) {
      this.notifierService.notify('warning', `
        Минимальное количество альтернатив: ${this.dataStoreService.alternativesMinCount}
      `);
    }

    this.router.navigateByUrl('/calc').then(_ => {
      return false;
    });
  }

}
