import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Alternative } from 'src/app/shared/models/alternative.model';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { Criterion } from 'src/app/shared/models/criterion.model';
import { CriterionState } from 'src/app/shared/enums/criterion-state.enum';
import { DataStoreService } from 'src/app/core/services/data-store.service';
import { NotifierService } from 'angular-notifier';
import { Router } from '@angular/router';

@Component({
  selector: 'app-first-step',
  templateUrl: './first-step.component.html',
  styleUrls: ['./first-step.component.scss']
})
export class FirstStepComponent implements OnInit {

  criterionState = CriterionState;
  addAlternativesForm: FormGroup;
  vForm: FormGroup;

  faTimesCircle = faTimesCircle;

  constructor(
    private dataStoreService: DataStoreService,
    private notifierService: NotifierService,
    private router: Router
  ) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.addAlternativesForm = new FormGroup({
      name: new FormControl('', [
        Validators.required
      ]),
    });
    this.vForm = new FormGroup({
      v: new FormControl(this.dataStoreService.currentDataset.vicorV, [
        Validators.required,
        Validators.min(0),
        Validators.max(1),
      ]),
    });
  }

  get alternatives(): Alternative[] {
    return this.dataStoreService.currentDataset.alternatives;
  }

  get criterions(): Criterion[] {
    return this.dataStoreService.criterionsList;
  }

  get alternativesMinCount(): number {
    return this.dataStoreService.alternativesMinCount;
  }

  get criterionsMinCount(): number {
    return this.dataStoreService.criterionsMinCount;
  }

  get vicorV(): number {
    if (isNaN(this.dataStoreService.currentDataset.vicorV)) {
      return null;
    }
    return this.dataStoreService.currentDataset.vicorV;
  }

  addAlternative() {
    const alternativeName = this.addAlternativesForm.get('name').value as string;
    if (this.addAlternativesForm.valid && alternativeName.trim()) {
      let alternativeId = 1;
      if (this.alternatives.length) {
        alternativeId = this.alternatives[this.alternatives.length - 1].id + 1;
      }

      const alternative: Alternative = {
        id: alternativeId,
        name: alternativeName
      };
      this.alternatives.push(alternative);

      this.addAlternativesForm.reset();
    }
  }

  deleteAlternative(alternativeId: number) {
    this.dataStoreService.currentDataset.alternatives = this.alternatives.filter(x => x.id !== alternativeId);
  }

  isVValid() {
    if (this.vForm.invalid) {
      this.notifierService.notify('warning', `
        Необходимо ввести значение v для метода VICOR от 0 до 1
      `);
      return false;
    }

    this.dataStoreService.currentDataset.vicorV = +this.vForm.get('v').value;
    return true;
  }

  isWeightsValid() {
    const criterions = this.criterions.filter(x => x.active);
    const invalidWeigths = criterions.some(x => x.weight > 1);
    const invalidSumWeigths = criterions.reduce((total, item) => total + item.weight, 0) !== 1;
    if (invalidWeigths || invalidSumWeigths) {
      this.notifierService.notify('warning', `
        Значения весов должны быть от 0 до 1. Сумма введённых весов выбранных критериев должна быть равна 1.
      `);
      return false;
    }
    return true;
  }

  goToSpecMethod() {
    if (this.isVValid()) {
      this.dataStoreService.currentDataset.criterions = this.criterions.filter(x => x.active);
      this.router.navigate(['/spec-method']);
    }
  }

  goToFill() {
    if (this.isVValid() && this.isWeightsValid()) {
      this.dataStoreService.currentDataset.criterions = this.criterions.filter(x => x.active);
      this.router.navigate(['/fill']);
    }
  }

}
