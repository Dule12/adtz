import { ADT, Pattern, match, TaggedType, matching } from "../core";

/**
 * Base Container for future type
 */
export abstract class Future<T> extends ADT<Success<T> | Failure> {
    abstract unwrap(): T;

    abstract unwrapOr(def: T): T;
}

/**
 * Container for Successfully resolved future
 */
export class Success<T> extends Future<T> {
    type = "Success" as const;

    val: T;

    constructor(val: T) {
        super();
        this.val = val;
    }

    unwrap = () => this.val;

    unwrapOr = (def: T) => this.unwrap();

    // TODO fix
    map<U>(mapper: (v: any) => U): ADT<any> {
        return {} as any;
    }

    // TODO fix
    flatMap<U>(mapper: (v: any) => ADT<any>): ADT<any> {
        return {} as any;
    }
}

/**
 * Container for Successfully resolved future
 */
export class Failure<T = any> extends Future<T> {
    type = "Failure" as const;

    unwrap = () => {
        throw new Error(`Future failure!`);
    };

    unwrapOr = (def: T) => def;

    // TODO fix
    map<U>(mapper: (v: any) => U): ADT<any> {
        return {} as any;
    }

    // TODO fix
    flatMap<U>(mapper: (v: any) => ADT<any>): ADT<any> {
        return {} as any;
    }
}

/**
 * Container for Unsuccesfully resolved future
 */
export class CompletableFuture<T> {
    private prom: Promise<Future<T>>;

    constructor(
        callback: (
            resolver: (val: T) => void,
            rejecter: (val: any) => void,
        ) => void,
    ) {
        this.prom = new Promise(localResolver => {
            new Promise<T>(callback)
                .then((v): any => {
                    localResolver(new Success(v));
                })
                .catch(e => {
                    localResolver(new Failure());
                });
        });
    }

    then(onfulfilled: (value: Future<T>) => any) {
        return this.prom.then(onfulfilled);
    }

    matchAsync: <PT extends (Success<T> | Failure) & TaggedType, RT>(
        pattern: Pattern<PT, RT>,
    ) => Promise<RT> = async pattern => {
        const res = await this.prom;
        return matching(pattern, res);
    };
}
