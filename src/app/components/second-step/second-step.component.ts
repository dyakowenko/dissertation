import { Component, OnInit } from '@angular/core';
import { DataStoreService } from 'src/app/core/services/data-store.service';
import { Criterion } from 'src/app/shared/models/criterion.model';
import { Alternative, Relation } from 'src/app/shared/models/alternative.model';
import { NotifierService } from 'angular-notifier';
import { CriterionState } from 'src/app/shared/enums/criterion-state.enum';

export class IdValue {
  criterionId?: number;
  alternativeId?: number;
  value: number;
}

@Component({
  selector: 'app-second-step',
  templateUrl: './second-step.component.html',
  styleUrls: ['./second-step.component.scss']
})
export class SecondStepComponent implements OnInit {

  constructor(
    private dataStoreService: DataStoreService,
    private notifierService: NotifierService
  ) { }

  ngOnInit() {
    this.initRelationsObjects();
  }

  get alternatives(): Alternative[] {
    return this.dataStoreService.alternatives;
  }

  get criterions(): Criterion[] {
    return this.dataStoreService.criterions.filter(x => x.active);
  }

  initRelationsObjects() {
    this.dataStoreService.alternatives.forEach(alternative => {
      if (!alternative.relations) {
        alternative.relations = [];
      }
      this.criterions.forEach(criterion => {
        if (!alternative.relations.some(relation => relation.criterionId === criterion.id)) {
          alternative.relations.push({
            criterionId: criterion.id
          });
        }
      });
    });
  }

  setRelationValue(value: number, alternative: Alternative, criterion: Criterion) {
    alternative.relations.find(relation => relation.criterionId === criterion.id).value = value;
  }

  goNextStep() {
    const isValid = !this.alternatives.some(x => x.relations.some(y => y.value === undefined || y.value === ''));
    if (!isValid) {
      this.notifierService.notify('warning', `
        Для продолжения необходимо заполнить все поля
      `);
      return;
    }

    // this.topsis();
    this.vicor();
  }

  /**
   * TOPSIS
   */
  topsis() {
    // Возведение всех значений в квадрат
    const alternativesSquare: IdValue[] = [];
    this.alternatives.forEach(alternative => {
      alternative.relations.forEach(relation => {
        alternativesSquare.push({
          alternativeId: alternative.id,
          criterionId: relation.criterionId,
          value: +relation.value * +relation.value
        });
      });
    });

    // Суммирование столбцов из квадратов
    const criterionsMath: IdValue[] = [];
    this.criterions.forEach(criterion => {
      const sum = alternativesSquare.filter(x => x.criterionId === criterion.id).reduce((total, alt) => total + +alt.value, 0);
      criterionsMath.push({
        criterionId: criterion.id,
        value: sum
      });
    });

    // Вычисление корня
    criterionsMath.forEach(criterion => {
      criterion.value = Math.sqrt(+criterion.value);
    });

    // Делим изначальные значения на корень по столбцам и умножаем на веса
    const miltipOnSqare: IdValue[] = [];
    this.criterions.forEach(criterion => {
      // Получаем relations относящиеся к данному критерию
      let relationsByCriterion: Relation[] = [];
      const allRelations = this.alternatives.map(x => x.relations);
      allRelations.forEach(relations => {
        relationsByCriterion = relationsByCriterion.concat(relations.filter(x => x.criterionId === criterion.id));
      });

      relationsByCriterion.forEach(relation => {
        miltipOnSqare.push({
          criterionId: criterion.id,
          value: (+relation.value / +criterionsMath.find(x => x.criterionId === criterion.id).value) * +criterion.weight
        });
      });
    });

    // Получаем макс/мин (идеальное)
    const extremumsNormal: IdValue[] = [];
    this.criterions.forEach(criterion => {
      const miltipOnSqareByCriterion = miltipOnSqare.filter(x => x.criterionId === criterion.id).map(y => y.value);
      extremumsNormal.push({
        criterionId: criterion.id,
        value: criterion.state === CriterionState.Max ? Math.max(...miltipOnSqareByCriterion) : Math.min(...miltipOnSqareByCriterion)
      });
    });

    // Получаем макс/мин (неидеальное)
    const extremumsNoNormal: IdValue[] = [];
    this.criterions.forEach(criterion => {
      const miltipsOnSqareByCriterion = miltipOnSqare.filter(x => x.criterionId === criterion.id).map(y => y.value);
      extremumsNoNormal.push({
        criterionId: criterion.id,
        value: criterion.state === CriterionState.Max ? Math.min(...miltipsOnSqareByCriterion) : Math.max(...miltipsOnSqareByCriterion)
      });
    });

    // Отнимаем от идеальных значений то, что умножали на веса и возводим в квадрат
    const extremumsNormalMinusOnSqareAndSqrt: IdValue[] = [];
    this.criterions.forEach(criterion => {
      const miltipsOnSqareByCriterion = miltipOnSqare.filter(x => x.criterionId === criterion.id);
      const extremumByCriterion = extremumsNormal.find(x => x.criterionId === criterion.id);
      miltipsOnSqareByCriterion.forEach(x => {
        extremumsNormalMinusOnSqareAndSqrt.push({
          criterionId: criterion.id,
          value: (+extremumByCriterion.value - +x.value) * (+extremumByCriterion.value - +x.value)
        });
      });
    });

    const criterionsCount = this.criterions.length;

    // Сложить по строкам предыдущий результат и получаем корень
    const sumByLineIdeal: IdValue[] = [];
    this.alternatives.forEach((alternative, index) => {
      let sum = 0;
      for (let i = 0; i < criterionsCount; i++) {
        const idxOfElement = i * criterionsCount + index;
        sum += extremumsNormalMinusOnSqareAndSqrt[idxOfElement].value;
      }
      sumByLineIdeal.push({
        alternativeId: alternative.id,
        value: Math.sqrt(sum)
      });
    });

    // Отнимаем от не идеальных значений то, что умножали на веса и возводим в квадрат
    const extremumsNoNormalMinusOnSqareAndSqrt: IdValue[] = [];
    this.criterions.forEach(criterion => {
      const miltipsOnSqareByCriterion = miltipOnSqare.filter(x => x.criterionId === criterion.id);
      const extremumByCriterion = extremumsNoNormal.find(x => x.criterionId === criterion.id);
      miltipsOnSqareByCriterion.forEach(x => {
        extremumsNoNormalMinusOnSqareAndSqrt.push({
          criterionId: criterion.id,
          value: (+extremumByCriterion.value - +x.value) * (+extremumByCriterion.value - +x.value)
        });
      });
    });

    // Сложить по строкам предыдущий результат и получаем корень
    const sumByLineNoIdeal: IdValue[] = [];
    this.alternatives.forEach((alternative, index) => {
      let sum = 0;
      for (let i = 0; i < criterionsCount; i++) {
        const idxOfElement = i * criterionsCount + index;
        sum += extremumsNoNormalMinusOnSqareAndSqrt[idxOfElement].value;
      }
      sumByLineNoIdeal.push({
        alternativeId: alternative.id,
        value: Math.sqrt(sum)
      });
    });

    // Неидеальную сумму делим на идеальную сложенную с неидеальной
    let relativeCloseness: IdValue[] = [];
    for (let i = 0; i < criterionsCount; i++) {
      relativeCloseness.push({
        value: sumByLineNoIdeal[i].value / (sumByLineNoIdeal[i].value + sumByLineIdeal[i].value)
      });
    }
    relativeCloseness = relativeCloseness.sort((a, b) => a.value - b.value);
    console.log(relativeCloseness);
  }

  /**
   * Vicor
   */
  vicor() {
    const criterionsCount = this.criterions.length;
    const alternativesCount = this.alternatives.length;

    // Получаем макс/мин (идеальное)
    const extremumsNormal: IdValue[] = [];
    this.criterions.forEach(criterion => {
      // Получаем relations относящиеся к данному критерию
      let relationsByCriterion: Relation[] = [];
      const allRelations = this.alternatives.map(x => x.relations);
      allRelations.forEach(relations => {
        relationsByCriterion = relationsByCriterion.concat(relations.filter(x => x.criterionId === criterion.id));
      });
      const relationsByCriterionValues = relationsByCriterion.map(x => x.value) as number[];

      extremumsNormal.push({
        criterionId: criterion.id,
        value: criterion.state === CriterionState.Max ? Math.max(...relationsByCriterionValues) : Math.min(...relationsByCriterionValues)
      });
    });

    // Получаем макс/мин (не идеальное)
    const extremumsNoNormal: IdValue[] = [];
    this.criterions.forEach(criterion => {
      // Получаем relations относящиеся к данному критерию
      let relationsByCriterion: Relation[] = [];
      const allRelations = this.alternatives.map(x => x.relations);
      allRelations.forEach(relations => {
        relationsByCriterion = relationsByCriterion.concat(relations.filter(x => x.criterionId === criterion.id));
      });
      const relationsByCriterionValues = relationsByCriterion.map(x => x.value) as number[];

      extremumsNoNormal.push({
        criterionId: criterion.id,
        value: criterion.state === CriterionState.Max ? Math.min(...relationsByCriterionValues) : Math.max(...relationsByCriterionValues)
      });
    });

    // вычисления по формуле S
    // sRightSideValues - значения по S до суммирования
    const sRightSideValues: IdValue[] = [];
    this.criterions.forEach(criterion => {
      let relationsByCriterion: Relation[] = [];
      const allRelations = this.alternatives.map(x => x.relations);
      allRelations.forEach(relations => {
        relationsByCriterion = relationsByCriterion.concat(relations.filter(x => x.criterionId === criterion.id));
      });

      relationsByCriterion.forEach(relation => {
        const extremumsNormalValue = +extremumsNormal.find(x => x.criterionId === relation.criterionId).value;
        const extremumsNoNormalValue = +extremumsNoNormal.find(x => x.criterionId === relation.criterionId).value;
        const relationValue = +relation.value;
        const criterionWeight = +criterion.weight;

        const value1 = extremumsNormalValue - relationValue;
        const value2 = extremumsNormalValue - extremumsNoNormalValue;
        const value3 = value1 / value2;
        const resultValue = value3 * criterionWeight;

        sRightSideValues.push({
          criterionId: criterion.id,
          value: resultValue
        });
      });
    });

    // sSumByLine - значения по S после суммирования
    const sSumByLine: IdValue[] = [];
    this.alternatives.forEach((alternative, index) => {
      let sum = 0;
      for (let i = 0; i < criterionsCount; i++) {
        const idxOfElement = i * alternativesCount + index;
        sum += +sRightSideValues[idxOfElement].value;
      }
      sSumByLine.push({
        alternativeId: alternative.id,
        value: sum
      });
    });

    // находим максимальное из sRightSideValues
    const sRightSideValuesMaxs: IdValue[] = [];
    this.alternatives.forEach((alternative, index) => {
      let max = 0;
      for (let i = 0; i < criterionsCount; i++) {
        const idxOfElement = i * alternativesCount + index;
        if (+sRightSideValues[idxOfElement].value > max) {
          max = +sRightSideValues[idxOfElement].value;
        }
      }
      sRightSideValuesMaxs.push({
        alternativeId: alternative.id,
        value: max
      });
    });

    // Определение агрегированного значения для каждой альтернативы
    const v = 0.5;

    const sSumByLineMin = Math.min(...sSumByLine.map(x => x.value));
    const sSumByLineMax = Math.max(...sSumByLine.map(x => x.value));

    const sRightSideValuesMaxsMin = Math.min(...sRightSideValuesMaxs.map(x => x.value));
    const sRightSideValuesMaxsMax = Math.max(...sRightSideValuesMaxs.map(x => x.value));

    const qValues: IdValue[] = [];
    sSumByLine.forEach((x, index) => {
      const valueS = v * ((x.value - sSumByLineMin) / (sSumByLineMax - sSumByLineMin));
      // tslint:disable-next-line:max-line-length
      const valueR = (1 - v) * ((sRightSideValuesMaxs[index].value - sRightSideValuesMaxsMin) / (sRightSideValuesMaxsMax - sRightSideValuesMaxsMin));
      const qValue = valueS + valueR;
      qValues.push({
        alternativeId: x.alternativeId,
        value: qValue
      });
    });

    // Ранжирование альтернатив
    const sSumByLineSorted = sSumByLine.sort((a, b) => a.value - b.value);
    const sRightSideValuesMaxsSorted = sRightSideValuesMaxs.sort((a, b) => a.value - b.value);
    const qValuesSorted = qValues.sort((a, b) => a.value - b.value);

    // Определение компромиссного решения
    const dQ = 1 / (alternativesCount - 1);
    const qxDivided = qValuesSorted[1].value - qValuesSorted[0].value;
    const isDecisionStable1 = qxDivided >= dQ;

    // Условие приемлемой стабильности
    const isDecisionStable2 =
      sSumByLineSorted[0].alternativeId === sRightSideValuesMaxsSorted[0].alternativeId &&
      sSumByLineSorted[0].alternativeId === qValuesSorted[0].alternativeId;

    console.log(sSumByLineSorted);
    console.log(sRightSideValuesMaxsSorted);
    console.log(qValuesSorted);
    console.log(isDecisionStable1);
    console.log(isDecisionStable2);
  }

}
