import {} from "typelevel-ts";
import { DeepReadonly } from "utility-types";

class Square {
    type = "Square" as const;

    constructor(public side: number) {}
}
class Circle {
    type = "Circle" as const;

    constructor(public radius: number) {}
}
class Rectangle {
    type = "Rectangle" as const;

    constructor(public width: number, public height: number) {}
}

type Elipse = {
    type: "Elipse";
    dds: number;
};
// }

type Shape = Square | Circle | Rectangle | Elipse;
//type Shape = typeof Cases

type Variants = {
    Square: {
        type: "Square";
        side: number;
    };
    Circle: {
        type: "Circle";
        radius: number;
    };
    Rectangle: {
        type: "Rectangle";
        width: number;
        height: number;
    };
    Elipse: {
        type: "Elipse";
        dds: number;
    };
};
//type Shapes = Variants[keyof Variants]

(String.constructor as any).type = "String";
declare interface StringConstructor {
    type: string;
}
type Eclipse = {
    type: "Elipse";
    dds: number;
};
type Shapes =
    | {
          type: "Square";
          side: number;
      }
    | {
          type: "Circle";
          cls: Eclipse;
          radius: number;
      }
    | {
          type: "Rectangle";
          width: number;
          height: number;
      }
    | Eclipse;

type Typed<T extends { type: string }> = {
    [CT in T["type"]]: T extends { type: CT } ? T : never;
};

type Pattern<PT extends { type: string }, RT> =
    | {
          [K in keyof Typed<PT>]: (shape: Typed<PT>[K]) => RT;
      }
    | { _: () => RT };

const match: <PT extends { type: string }>() => <RT>(pattern: Pattern<PT, RT>) => (shape: PT) => RT = () => (
    pattern,
) => (shape) => (pattern[shape.type] !== undefined ? pattern[shape.type](shape) : pattern["_"]());

// const matcher = match<Shape, Shape>({
//     Square: square => new Square(square.side * 2),
//     Circle: circle => new Rectangle(2 * Math.PI, circle.radius),
//     Rectangle: rect => new Circle(rect.height + 2 * rect.width),
//     Elipse: casez => ({ type: "Elipse", dds: casez.dds })
// })
// console.log(matcher(matcher(matcher(new Square(55)))))

const matcher2 = match<Shapes>()<Shapes>({
    Rectangle: (v) => ({ type: "Circle", radius: v.height * 5, cls: { type: "Elipse", dds: 1 } }),
    Square: (v) => ({ type: "Elipse", dds: v.side }),
    Circle: (v) => ({
        type: "Elipse",
        dds: match()({ _: () => 52 })(v.cls),
    }),
    Elipse: (v) => ({ type: "Elipse", dds: v.dds }),
    _: () => ({ type: "Elipse", dds: 1 }),
});
console.log(matcher2(matcher2(matcher2({ type: "Rectangle", width: 555, height: 33 }))));
console.log(matcher2({ type: "Circle", radius: 5345, cls: { type: "Elipse", dds: 3 } }));

const matcher4 = match<Shapes>()({
    Rectangle: (v) => ({ dsd: 55, sds: 52 }),
    Square: (v) => ({ dsd: 55, sds: 52 }),
    Circle: (v) => ({ dsd: 55 }),
    Elipse: (v) => ({ dsd: v.dds, sds: "" }),
    _: () => ({ dsd: 55, sds: 52 }),
});

// const matchs = (val: Shapes): Shapes => {
//     switch (val.type) {
//         case "Circle": return { type: "Elipse", dds: val.radius };
//         case "Rectangle": return { type: "Elipse", dds: val.height };
//         case "Elipse": return { type: "Elipse", dds: val.dds };
//         case "Square": return { type: "Elipse", dds: val.side };
//     }
// }
//console.log(matchs(matchs(matchs({ type: "Rectangle", width: 555, height: 4553 }))))

const matching: <PT extends { type: string }, RT>(pattern: Pattern<PT, RT>, PT) => RT = (pattern, shape) =>
    pattern[shape.type] !== undefined ? pattern[shape.type](shape) : pattern["_"]();

const matchFn: <PT extends { type: string }>() => <RT>(pattern: Pattern<PT, RT>) => (shape: PT) => RT = () => (
    pattern,
) => (shape) => matching(pattern, shape);

abstract class ADT<PT extends { type: string }> {
    abstract type: string;

    match: <RT>(pattern: Pattern<PT, RT>) => RT = (pattern) => matching(pattern, this);
}

type Sum = Sub1 | Sub2;
class Sumz extends ADT<Sum> {
    type = "Sumz";

    findSub1 = () => (this.type === "Sub2" ? this : new Sub2(""));
}

class Sub1 extends Sumz {
    type = "Sub1" as const;

    side = 5;
}
class Sub2 extends Sumz {
    type = "Sub2" as const;

    name: string;

    constructor(name: string) {
        super();
        this.name = name;
    }
}

const s2 = new Sub2("wat");
const f = s2.findSub1();

console.log(`yo ${f}`);

const res = s2.match<string>({
    Sub1: (t) => t.side.toString(),
    Sub2: (t) => t.name,
});
console.log(res);

abstract class Optionz<T> extends ADT<Some<T> | None<T>> {
    abstract unwrap(): T;

    abstract unwrapOr(def: T): T;

    abstract map<U>(mapper: (v: T) => U): Optionz<U>;

    abstract flatMap<U>(mapper: (v: T) => Optionz<U>): Optionz<U>;
}

class Some<T> extends Optionz<T> {
    type = "Some" as const;

    val: T;

    constructor(val: T) {
        super();
        this.val = val;
    }

    unwrap = () => this.val;

    unwrapOr = (def: T) => this.unwrap();

    map = <U>(mapper: (v: T) => U) => new Some<U>(mapper(this.val));

    flatMap = <U>(mapper: (v: T) => Optionz<U>) => mapper(this.val);
}
class None<T = any> extends Optionz<T> {
    type = "None" as const;

    unwrap = () => {
        throw new Error("Option value doesn't exist!");
    };

    unwrapOr = (def: T) => def;

    map = <U>(mapper: (v: T) => U) => new None<U>();

    flatMap = <U>(mapper: (v: T) => Optionz<U>) => new None<U>();
}

const h = new None();

function fn(opt: Optionz<number>): string {
    return opt.match({
        Some: (d) => d.val.toString(),
        None: (_) => "Err",
    });
}

console.log(`h${h}`);

console.log(fn(h));

console.log(h.unwrapOr(11));

const dh: Optionz<number> = new Some(1);
const d1: Optionz<number> = new None();
const zzf = dh.map((v) => v.toString());
const zz2 = d1.map((v) => v.toString());
console.log(`o: ${zzf.unwrapOr("/")} n: ${zz2.unwrapOr("/")}`);

class xx extends Promise<void> {
    constructor(fn) {
        super(fn);
    }
}

(async function() {
    const x = new xx((r) => setTimeout(() => r(), 10000));
    await x;
    console.log("rtr");
})();

abstract class Result<T, E> extends ADT<Ok<T> | Err<E>> {
    abstract unwrap(): T;

    abstract unwrapOr(def: T): T;

    abstract map<U>(mapper: (v: T) => U): Result<U, any>;

    abstract flatMap<U, UE>(mapper: (v: T) => Result<U, UE>): Result<U, UE>;
}

class Ok<T> extends Result<T, any> {
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
class Err<E = any> extends Result<any, E> {
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

abstract class Future<T> extends ADT<Success<T> | Failure> {
    abstract unwrap(): T;

    abstract unwrapOr(def: T): T;
}

class Success<T> extends Future<T> {
    type = "Success" as const;

    val: T;

    constructor(val: T) {
        super();
        this.val = val;
    }

    unwrap = () => this.val;

    unwrapOr = (def: T) => this.unwrap();
}
class Failure<T = any> extends Future<T> {
    type = "Failure" as const;

    unwrap = () => {
        throw new Error(`Future failure!`);
    };

    unwrapOr = (def: T) => def;
}

class CompletableFuture<T> extends Promise<Future<T>> {
    //future: Future<T> = new Pending<T>();
    constructor(callback: (resolver: (val: T) => void, rejecter: (val: any) => void) => void) {
        super((localResolver) => {
            const localProm = new Promise<T>(callback);
            localProm
                .then((v) => {
                    //this.future = new Success(v);
                    localResolver(new Success(v));
                })
                .catch((e) => {
                    //this.future = new Failure();
                    localResolver(new Failure());
                });
        });
    }
}

(async function() {
    const futurez = new CompletableFuture<number>((res, rej) => setTimeout(() => res(555)));
    (await futurez).match({
        Failure: (f) => console.log("FAilz"),
        Success: (s) => console.log(`Success ${s.val}`),
    });

    const l = await futurez;
    alert(l.unwrap());
})();
