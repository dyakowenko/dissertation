import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Alternative } from 'src/app/shared/models/alternative.model';
import { faTimesCircle, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
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
  faTimesCircle = faTimesCircle;
  faExclamationCircle = faExclamationCircle;

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
    this.dataStoreService.currentDataset.criterions = this.criterions.filter(x => x.active);
    this.router.navigate(['/spec-method']);
  }

  goToFill() {
    if (this.isWeightsValid()) {
      this.dataStoreService.currentDataset.criterions = this.criterions.filter(x => x.active);
      this.router.navigate(['/fill']);
    }
  }

}
