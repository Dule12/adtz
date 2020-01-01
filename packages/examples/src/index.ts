import { match, ADT, None, Option, Some, CompletableFuture } from "adtts";

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

const matcher2 = match<Shapes>()<Shapes>({
    Rectangle: (v) => ({
        type: "Circle",
        radius: v.height * 5,
        cls: { type: "Elipse", dds: 1 },
    }),
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

// const matcher = match<Shape, Shape>({
//     Square: square => new Square(square.side * 2),
//     Circle: circle => new Rectangle(2 * Math.PI, circle.radius),
//     Rectangle: rect => new Circle(rect.height + 2 * rect.width),
//     Elipse: casez => ({ type: "Elipse", dds: casez.dds })
// })
// console.log(matcher(matcher(matcher(new Square(55)))))

// const matchs = (val: Shapes): Shapes => {
//     switch (val.type) {
//         case "Circle": return { type: "Elipse", dds: val.radius };
//         case "Rectangle": return { type: "Elipse", dds: val.height };
//         case "Elipse": return { type: "Elipse", dds: val.dds };
//         case "Square": return { type: "Elipse", dds: val.side };
//     }
// }
//console.log(matchs(matchs(matchs({ type: "Rectangle", width: 555, height: 4553 }))))

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

const h = new None();

function fn(opt: Option<number>): string {
    return opt.match({
        Some: (d) => d.val.toString(),
        None: (_) => "Err",
    });
}

console.log(`h${h}`);

console.log(fn(h));

console.log(h.unwrapOr(11));

const dh: Option<number> = new Some(1);
const d1: Option<number> = new None();
const zzf = dh.map((v) => v.toString());
const zz2 = d1.map((v) => v.toString());
console.log(`o: ${zzf.unwrapOr("/")} n: ${zz2.unwrapOr("/")}`);

class xx extends Promise<void> {
    constructor(fn) {
        super(fn);
    }
}

// (async function() {
//     const x = new xx((r) => setTimeout(() => r(), 10000));
//     await x;
//     console.log("rtr");
// })();

// (async function() {
//     const futurez = new CompletableFuture<number>((res, rej) => setTimeout(() => res(555)));
//     (await futurez).match({
//         Failure: (f) => console.log("FAilz"),
//         Success: (s) => console.log(`Success ${s.val}`),
//     });

//     const l = await futurez;
//     alert(l.unwrap());
// })();
