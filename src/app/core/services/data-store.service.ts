import { Injectable } from '@angular/core';
import { Criterion } from 'src/app/shared/models/criterion.model';
import { Alternative } from 'src/app/shared/models/alternative.model';

@Injectable({
  providedIn: 'root'
})
export class DataStoreService {

  alternativesMinCount = 2;
  criterionsMinCount = 2;

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
  ];

}
