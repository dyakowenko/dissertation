import { Alternative } from './alternative.model';
import { Criterion, IdValue } from './criterion.model';

export class Dataset {
    id?: string;
    vicorV: number;
    alternatives: Alternative[] = [];
    criterions: Criterion[] = [];
    vicorResult: IdValue[] = [];
    topsisResult: IdValue[] = [];
}
