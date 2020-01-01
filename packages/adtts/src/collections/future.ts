import { ADT } from "../core";

export abstract class Future<T> extends ADT<Success<T> | Failure> {
    abstract unwrap(): T;

    abstract unwrapOr(def: T): T;
}

export class Success<T> extends Future<T> {
    type = "Success" as const;

    val: T;

    constructor(val: T) {
        super();
        this.val = val;
    }

    unwrap = () => this.val;

    unwrapOr = (def: T) => this.unwrap();
}
export class Failure<T = any> extends Future<T> {
    type = "Failure" as const;

    unwrap = () => {
        throw new Error(`Future failure!`);
    };

    unwrapOr = (def: T) => def;
}

export class CompletableFuture<T> extends Promise<Future<T>> {
    constructor(callback: (resolver: (val: T) => void, rejecter: (val: any) => void) => void) {
        super((localResolver) => {
            const localProm = new Promise<T>(callback);
            localProm
                .then((v) => {
                    localResolver(new Success(v));
                })
                .catch((e) => {
                    localResolver(new Failure());
                });
        });
    }
}
