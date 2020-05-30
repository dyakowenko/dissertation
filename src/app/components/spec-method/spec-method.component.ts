import { Component, OnInit } from '@angular/core';
import { Criterion } from 'src/app/shared/models/criterion.model';
import { DataStoreService } from 'src/app/core/services/data-store.service';

@Component({
  selector: 'app-spec-method',
  templateUrl: './spec-method.component.html',
  styleUrls: ['./spec-method.component.scss']
})
export class SpecMethodComponent implements OnInit {

  isTableValid = true;

  constructor(
    private dataStoreService: DataStoreService
  ) { }

  ngOnInit() {
    this.initRelationsObjects();
  }

  get criterions(): Criterion[] {
    return this.dataStoreService.criterions;
  }

  initRelationsObjects() {
    this.dataStoreService.criterions.forEach(criterion1 => {
      criterion1.relations = [];
      this.dataStoreService.criterions.forEach(criterion2 => {
        criterion1.relations.push({
          id: criterion2.id
        });
      });
    });
  }

  setRelationsValue(value: number, criterionLine: Criterion, criterionColumn: Criterion) {
    this.setRelationValue(value, criterionLine, criterionColumn);
    this.setRelationValue(value, criterionColumn, criterionLine);
    console.log(this.criterions);
  }

  setRelationValue(value: number, criterion1: Criterion, criterion2: Criterion) {
    const relation = criterion1.relations.find(x => x.id === criterion2.id);
    if (relation) {
      relation.value = value;
    }
  }

  getRelationValue(criterionLine: Criterion, criterionColumn: Criterion) {
    return criterionLine.relations.find(criterion1 => criterion1.id === criterionColumn.id).value;
  }

  goNextStep() {
    this.isTableValid = !this.criterions.some(x => x.relations.some(y => y.value === undefined));
    if (this.isTableValid) {
      alert('valid');
    }
  }

}
