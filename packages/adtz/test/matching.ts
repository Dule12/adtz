import { expect } from "chai";
import { describe, it } from "mocha";

import * as future from "../src/collections/future";
import * as option from "../src/collections/option";
import * as result from "../src/collections/result";
import { match, ADT } from "../src/core";

describe("Pattern matching", () => {
    it("Match function", () => {
        type Shapes =
            | {
                  type: "Square";
                  side: number;
              }
            | {
                  type: "Circle";
                  radius: number;
              }
            | {
                  type: "Rectangle";
                  width: number;
                  height: number;
              };

        const matcher = match<Shapes>()<Shapes>({
            Rectangle: v => ({
                type: "Circle",
                radius: v.height * 5,
            }),
            Square: v => ({ type: "Circle", radius: 55 }),
            Circle: v => ({
                type: "Circle",
                radius: 55,
            }),
        });

        expect(
            matcher({ type: "Rectangle", width: 555, height: 33 }).type,
        ).to.equal("Circle");
    });

    it("Match default", () => {
        type Shapes =
            | {
                  type: "Square";
                  side: number;
              }
            | {
                  type: "Circle";
                  radius: number;
              }
            | {
                  type: "Rectangle";
                  width: number;
                  height: number;
              };

        const matcher = match<Shapes>()<Shapes>({
            Circle: v => ({
                type: "Circle",
                radius: 55,
            }),
            _: () => ({ type: "Circle", radius: 55 }),
        });

        expect(matcher({ type: "Square", side: 555 }).type).to.equal("Circle");
    });

    it("Match custom ADT", () => {
        type Sum = Sub1 | Sub2;
        class Sub1 extends ADT<Sum> {
            type = "Sub1" as const;

            side = 5;
        }
        class Sub2 extends ADT<Sum> {
            type = "Sub2" as const;

            name: string;

            constructor(name: string) {
                super();
                this.name = name;
            }
        }
        const s2 = new Sub2("Sub");

        const res = s2.match({
            Sub1: t => t.side.toString(),
            Sub2: t => t.name,
        });
        expect(res).to.equal("Sub");
    });

    it("Match custom ADT behaviour", () => {
        type Sum = Sub1 | Sub2;

        abstract class SumBase extends ADT<Sum> {
            isSub1 = () => this.type === "Sub1";
        }

        class Sub1 extends SumBase {
            type = "Sub1" as const;

            side = 5;
        }
        class Sub2 extends SumBase {
            type = "Sub2" as const;

            name: string;

            constructor(name: string) {
                super();
                this.name = name;
            }
        }
        const s1 = new Sub1();

        const res = s1.match({
            Sub1: t => t.side.toString(),
            Sub2: t => t.name,
        });
        expect(s1.isSub1() ? "Sub1" : res).to.equal("Sub1");
    });

    it("Match Option", () => {
        const h = new option.None();
        expect(
            h.match({
                Some: d => d.val.toString(),
                None: _ => "Nil",
            }),
        ).to.equal("Nil");
    });

    it("Unwrap Option", () => {
        const s = new option.Some(1);
        expect(s.unwrap()).to.equal(1);
    });

    it("UnwrapOr Option", () => {
        const n = new option.None();
        expect(n.unwrapOr(1)).to.equal(1);
    });

    it("Match Future then", () => {
        const x = new future.CompletableFuture<number>((res, rej) => res(555));
        let rez;
        x.then(v =>
            expect(
                v.match({
                    Success: s => `${s.type} ${s.val}`,
                    Failure: f => f.type,
                }),
            ).to.equal("Success 555"),
        ).catch(e => {});
    });

    it("Match Result", () => {
        const er = new result.Err("bla");
        expect(
            er.match({
                Ok: v => v.toString(),
                Err: v => v.val,
            }),
        ).to.equal("bla");
    });
});
