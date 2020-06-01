import { Injectable } from '@angular/core';
import { Criterion } from 'src/app/shared/models/criterion.model';
import { Alternative } from 'src/app/shared/models/alternative.model';

@Injectable({
  providedIn: 'root'
})
export class DataStoreService {

  alternativesMinCount = 2;
  criterionsMinCount = 2;
  vicorV: number;

  alternatives: Alternative[] = [];
  criterions: Criterion[] = [
    {
      id: 1,
      name: 'Первый'
    },
    {
      id: 2,
      name: 'Второй'
    },
    {
      id: 3,
      name: 'Третий'
    },
    {
      id: 4,
      name: 'Четвёртый'
    },
    {
      id: 5,
      name: '5555555'
    },
    {
      id: 6,
      name: '6666666'
    },
    {
      id: 7,
      name: '7777777'
    },
    {
      id: 8,
      name: '88888888'
    },
  ];

}
