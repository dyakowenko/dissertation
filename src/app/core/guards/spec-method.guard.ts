import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, Router } from '@angular/router';
import { DataStoreService } from '../services/data-store.service';

@Injectable({
  providedIn: 'root'
})
export class SpecMethodGuard implements CanActivate {

  constructor(
    private router: Router,
    private dataStoreService: DataStoreService
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
    this.router.navigateByUrl('/calc').then(_ => {
      return false;
    });
  }

}
