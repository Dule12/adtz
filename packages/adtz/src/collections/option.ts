import { ADT } from "../core";

/**
 * Base Container for option type
 */
export abstract class Option<T> extends ADT<Some<T> | None<T>> {
    abstract unwrap(): T;

    abstract unwrapOr(def: T): T;

    abstract map<U>(mapper: (v: T) => U): Option<U>;

    abstract flatMap<U>(mapper: (v: T) => Option<U>): Option<U>;
}

/**
 * Container for existing data
 */
export class Some<T> extends Option<T> {
    type = "Some" as const;

    val: T;

    constructor(val: T) {
        super();
        this.val = val;
    }

    unwrap = () => this.val;

    unwrapOr = (def: T) => this.unwrap();

    map = <U>(mapper: (v: T) => U) => new Some<U>(mapper(this.val));

    flatMap = <U>(mapper: (v: T) => Option<U>) => mapper(this.val);
}

/**
 * Container for unpresent data
 */
export class None<T = any> extends Option<T> {
    type = "None" as const;

    unwrap = () => {
        throw new Error("Option value doesn't exist!");
    };

    unwrapOr = (def: T) => def;

    map = <U>(mapper: (v: T) => U) => new None<U>();

    flatMap = <U>(mapper: (v: T) => Option<U>) => new None<U>();
}
