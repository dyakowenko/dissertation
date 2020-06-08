import { Component, OnInit } from '@angular/core';
import { Criterion } from 'src/app/shared/models/criterion.model';
import { DataStoreService } from 'src/app/core/services/data-store.service';
import { NotifierService } from 'angular-notifier';
import { Router } from '@angular/router';
import { CriterionState } from 'src/app/shared/enums/criterion-state.enum';

@Component({
  selector: 'app-spec-method',
  templateUrl: './spec-method.component.html',
  styleUrls: ['./spec-method.component.scss']
})
export class SpecMethodComponent implements OnInit {

  criterionState = CriterionState;
  criterionsCalculated = false;

  constructor(
    private dataStoreService: DataStoreService,
    private notifierService: NotifierService,
    private router: Router
  ) { }

  ngOnInit() {
    this.initRelationsObjects();
  }

  get criterions(): Criterion[] {
    return this.dataStoreService.criterions.filter(x => x.active);
  }

  initRelationsObjects() {
    this.dataStoreService.criterions.forEach(criterion1 => {
      if (!criterion1.relations) {
        criterion1.relations = [];
      }
      this.criterions.forEach(criterion2 => {
        if (!criterion1.relations.some(relation => relation.id === criterion2.id)) {
          criterion1.relations.push({
            id: criterion2.id,
            value: criterion1.id === criterion2.id ? 1 : undefined
          });
        }
      });
    });
  }

  setRelationsValue(event: any, criterionLine: Criterion, criterionColumn: Criterion) {
    const relationLine = criterionLine.relations.find(x => x.id === criterionColumn.id);
    if (criterionLine.id === criterionColumn.id) {
      event.preventDefault();
    } else {
      relationLine.value = +event.target.value;
    }

    const relationColumn = criterionColumn.relations.find(x => x.id === criterionLine.id);
    if (relationLine.value === 1) {
      relationColumn.value = 1;
    } else if (relationLine.value === 2) {
      relationColumn.value = 0;
    } else {
      relationColumn.value = 2;
    }
  }

  getRelationValue(criterionLine: Criterion, criterionColumn: Criterion) {
    return criterionLine.relations.find(relation => relation.id === criterionColumn.id).value;
  }

  calcWeights() {
    const isTableValid = !this.criterions.some(x => x.relations.some(y => y.value === undefined));
    if (!isTableValid) {
      this.notifierService.notify('warning', `
        Необходимо сделать выбор в каждом из полей
      `);
      return;
    }

    const allRelationsSum = this.criterions.reduce((total, criterion) =>
      total + criterion.relations.reduce((sum, relation) => sum + relation.value, 0), 0);

    this.criterions.forEach(x => {
      x.weight = x.relations.reduce((sum, relation) => sum + relation.value, 0) / allRelationsSum;
    });
    this.criterionsCalculated = true;
  }

  goNextStep() {
    this.calcWeights();
    this.router.navigate(['/fill']);
  }

}
