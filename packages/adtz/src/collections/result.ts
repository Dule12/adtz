import { ADT, Mapper } from "../core";

/**
 * Base Container for result type
 */
export abstract class Result<T, E> extends ADT<Ok<T> | Err<E>> {
    abstract unwrap(): T;

    abstract unwrapOr(def: T): T;

    abstract map<U>(mapper: (v: T) => U): Result<U, any>;

    abstract flatMap<U, UE>(mapper: (v: T) => Result<U, UE>): Result<U, UE>;
}

/**
 * Container for existing result
 */
export class Ok<T> extends Result<T, any> {
    type = "Ok" as const;

    val: T;

    constructor(val: T) {
        super();
        this.val = val;
    }

    unwrap = () => this.val;

    unwrapOr = (def: T) => this.unwrap();

    map = <U>(mapper: (v: T) => U) => new Ok<U>(mapper(this.val));

    flatMap = <U, UE>(mapper: (v: T) => Result<U, UE>) => mapper(this.val);
}

/**
 * Container for error result
 */
export class Err<E = any> extends Result<any, E> {
    type = "Err" as const;

    val: E;

    constructor(val: E) {
        super();
        this.val = val;
    }

    unwrap = () => {
        throw new Error(`Error result: ${this.val}`);
    };

    unwrapOr = (def: E) => def;

    map = <U>(mapper: (v: E) => U) => new Err<U>(mapper(this.val));

    flatMap = <U, UE>(mapper: (v: any) => Result<U, UE>) => mapper(this.val);
}
