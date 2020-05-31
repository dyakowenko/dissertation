export class Alternative {
    id: number;
    name: string;
    relations?: Relation[] = [];
}

export class Relation {
    criterionId: number;
    value?: any;
}
