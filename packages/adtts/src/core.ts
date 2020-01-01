import { AnyTuple } from "typelevel-ts";
import { DeepReadonly } from "utility-types";

/**
 * Object tagged by name for pattern matching
 */
export type TaggedType = { type: string };

/**
 * Tag strings
 */
(String.prototype as any).type = "String";

/**
 * Tag numbers
 */
(Number.prototype as any).type = "Number";

/**
 * Tag bools
 */
(Boolean.prototype as any).type = "Boolean";

/**
 * String matchable
 */
export type String = string & { type: "String" };

/**
 * Boolean matchable
 */
export type Boolean = boolean & { type: "Boolean" };

/**
 * Number matchable
 */
export type Number = number & { type: "Number" };

/**
 * Provides key strings for variants
 * Provides type information for object that is passed as parameter to handler
 */
type Typed<T extends TaggedType> = {
    [CT in T["type"]]: T extends { type: CT } ? T : never;
};

/**
 * Type declares pattern object so that all possible variants are provided(exaustiveness)
 * Or "_" key handles unlisted variants
 * Makes sure that they all have same return type
 * Makes sure that all types have string tag for type
 */
type Pattern<PT extends TaggedType, RT> =
    | {
          [K in keyof Typed<PT>]: (shape: Typed<PT>[K]) => RT;
      }
    | { _: () => RT };

/**
 * Matching function that is used as basis for all pattern matching
 * @param pattern Object with variants of all allowed values declared for matching expression and their handlers
 * @param shape Value passed fro whom matching is performad
 */
const matching: <PT extends TaggedType, RT>(pattern: Pattern<PT, RT>, PT) => RT = (
    pattern,
    shape,
) => (pattern[shape.type] !== undefined ? pattern[shape.type](shape) : pattern["_"]());

/**
 * Matcher function used for functional/non inheritance based matching
 * Curried because generic parameters have to be passed all or none,
 * So first function recieves variant set for matching as type parameter
 * Second one for return type, parameters can be omitted and inferred
 */
export const match: <PT extends TaggedType>() => <RT>(
    pattern: Pattern<PT, RT>,
) => (shape: PT) => RT = () => pattern => shape => matching(pattern, shape);

/**
 * Base class that provides pattern ADT and pattern matching functionality through inheritance
 * Various container types can be derrived from this,
 * Or value classes could be created directly by inheriting this
 */
export abstract class ADT<PT extends TaggedType> {
    abstract type: string;

    match: <RT>(pattern: Pattern<PT, RT>) => RT = pattern => matching(pattern, this);
}

/**
 * Loose interface that describes collections that be in for expression
 * Should be more precisely defined in abstract collection classes
 * Should be implemented in each variant class
 */
export type Mapper<PT extends TaggedType> = {
    map: (mapper: (v: any) => any) => Mapper<PT>;

    flatMap: (mapper: (v: any) => Mapper<PT>) => Mapper<PT>;
};


// export const doEx: <T>(params: (() => any)[]) => any = (params) => {
//     let it = 0;
//     let ret;
//     const mapping = (par : any ) => {
//         it ++;
//         it === params.length - 2 ? mapping(par.map(params[it])) : undefined;
//         it < params.length - 2 ? mapping(par.flatMap(params[it])) : undefined;
//         ret = it === params.length - 1 ? params[it]() : undefined;
//     };
//     mapping(params[it]());
    
// }

// type DoValues<T> = T

// type DoSteps<PM extends AnyTuple> = {
//     [K in keyof PM]: DoValues<PM[K]>;
// }

// export const doEx: <PM extends AnyTuple>(params: PM) => any = (params) => 1