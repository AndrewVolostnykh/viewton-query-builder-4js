import {Operators} from "./Operators";

const pageSizeParamName: string = "page_size";
const sortingParamName: string = "sorting";

export class ViewtonQueryBuilder {
    params: Map<string, string>

    constructor() {
        this.params = new Map<string, string>();
    }

    build() {
        return this.params;
    }

    param(fieldName: string): FilterBuilder<this> {
        return new FilterBuilder(fieldName, this)
    }

    registerParam<B extends ViewtonQueryBuilder>(filterBuilder: FilterBuilder<B>) {
        if (sortingParamName === filterBuilder.value) {
            if (this.params.get(sortingParamName) === null) {
                this.params.set(sortingParamName, filterBuilder.value);
            } else {
                this.params.set(sortingParamName, this.params.get(sortingParamName) + ',' + filterBuilder.value);
            }
        }

        this.params.set(filterBuilder.fieldName, filterBuilder.value);
    }

    page<B extends ViewtonQueryBuilder>(page: number):B {
        this.params.set('page', page + '');
        return this as unknown as B;
    }

    noPagination<B extends ViewtonQueryBuilder>():B {
        this.params.set(pageSizeParamName, '-1');
        return this as unknown as B;
    }

    pageSize<B extends ViewtonQueryBuilder>(pageSize: number) {
        this.params.set(pageSizeParamName, pageSize + '');
        return this as unknown as B;
    }

    count<B extends ViewtonQueryBuilder>():B {
        this.params.set('count', 'true');
        return this as unknown as B;
    }

    distinct<B extends ViewtonQueryBuilder>():B {
        this.params.set('distinct', 'true');
        return this as unknown as B;
    }

    total<B extends ViewtonQueryBuilder>():B {
        this.params.set('total', 'true');
        return this as unknown as B;
    }

    totalAttributes<B extends ViewtonQueryBuilder>():B {
        this.params.set('total', 'true');
        return this as unknown as B;
    }
}

export class FilterBuilder<CALLER extends ViewtonQueryBuilder> {
    fieldName: string;
    value: string;
    caller: CALLER;
    // ignore case
    ic: boolean;

    constructor(fieldName: string, caller: CALLER) {
        this.fieldName = fieldName;
        this.caller = caller;
        this.value = '';
        this.ic = false;
    }

    ignoreCase(): FilterBuilder<CALLER> {
        this.ic = true;
        return this;
    }

    lessThenOrEqual(than: any): CALLER {
        this.value = Operators.LESS_THAN_OR_EQUALS + than;
        this.caller.registerParam(this);
        return this.caller;
    }

    greaterThenOrEqual(than: any): CALLER {
        this.value = Operators.GREATER_THAN_OR_EQUALS + than;
        this.caller.registerParam(this);
        return this.caller;
    }

    equalsTo(to: any): CALLER {
        this.value = to.toString();
        if (this.ic) {
            this.value = '^' + this.value;
            this.ic = false;
        }
        this.caller.registerParam(this);
        return this.caller;
    }

    notEqualsTo(to: any): CALLER {
        this.value = Operators.NOT_EQUALS + to.toString();
        if (this.ic) {
            this.value = '^' + this.value;
            this.ic = false;
        }
        this.caller.registerParam(this);
        return this.caller;
    }

    between(than: any): CALLER {
        this.value = Operators.GREATER + than;
        this.caller.registerParam(this);
        return this.caller;
    }

    less(than: any): CALLER {
        this.value = Operators.LESS + than;
        this.caller.registerParam(this);
        return this.caller;
    }

    ascSort(): CALLER {
        this.value = sortingParamName;
        this.caller.registerParam(this);
        return this.caller;
    }

    descSort(): CALLER {
        this.value = sortingParamName;
        this.fieldName = '-' + this.fieldName;
        this.caller.registerParam(this);
        return this.caller;
    }
}

export class OrAndBuilder<CALLER extends ViewtonQueryBuilder> {
    caller: CALLER;
    param: FilterBuilder<CALLER>;
    ic: boolean;

    constructor(caller: CALLER, param:FilterBuilder<CALLER> ) {
        this.caller = caller;
        this.param = param;
        this.ic = false;
    }

    next():CALLER {
        this.caller.registerParam(this.param);
        return this.caller;
    }

    ignoreCase():OrAndBuilder<CALLER> {
        this.ic = true;
        return this;
    }

    or(value:string):OrAndBuilder<CALLER> {
        if (this.ic) {
            value = '^' + value;
            this.ic = false
        }
        this.param.value = this.param.value + Operators.OR + value;
        return this;
    }
}