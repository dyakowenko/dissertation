import { CriterionState } from '../enums/criterion-state.enum';

export class Criterion {
    id: number;
    name: string;
    active?: boolean;
    state?: CriterionState;
    countable?: boolean;
    qualityList?: IdValue[] = [];
    weight?: number;
    relations?: IdValue[] = [];
    hint?: string;
}

export class IdValue {
    id: number;
    value?: any;
}
