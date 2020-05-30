import { CriterionState } from '../enums/criterion-state.enum';

export class Criterion {
    id: number;
    name: string;
    active?: boolean;
    state?: CriterionState;
    weight?: number;
    relations?: Relation[] = [];
}

export class Relation {
    id: number;
    value?: number;
}
