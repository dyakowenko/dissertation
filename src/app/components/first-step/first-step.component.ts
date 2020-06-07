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
  }

  get alternatives(): Alternative[] {
    return this.dataStoreService.alternatives;
  }

  get criterions(): Criterion[] {
    return this.dataStoreService.criterions;
  }

  get alternativesMinCount(): number {
    return this.dataStoreService.alternativesMinCount;
  }

  get criterionsMinCount(): number {
    return this.dataStoreService.criterionsMinCount;
  }

  setVicorV(value: number) {
    this.dataStoreService.vicorV = value;
  }

  get vicorV(): number {
    if (isNaN(this.dataStoreService.vicorV)) {
      return null;
    }
    return this.dataStoreService.vicorV;
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
    this.dataStoreService.alternatives = this.alternatives.filter(x => x.id !== alternativeId);
  }

}
