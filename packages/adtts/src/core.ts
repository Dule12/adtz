import {} from "typelevel-ts";
import { DeepReadonly } from "utility-types";

/**
 * Object tagged by name for pattern matching
 */
export type StrType = { type: string };

/**
 * Provides key strings for variants
 * Provides type information for object that is passed as parameter to handler
 */
type Typed<T extends StrType> = {
    [CT in T["type"]]: T extends { type: CT } ? T : never;
};

/**
 * Type declares pattern object so that all possible variants are provided
 * Or "_" key handles unhandled variants
 * Makes sure that they all have same return type
 * Makes sure that all types have string flag for type
 */
type Pattern<PT extends StrType, RT> =
    | {
          [K in keyof Typed<PT>]: (shape: Typed<PT>[K]) => RT;
      }
    | { _: () => RT };

/**
 * Matching function that is used as basis for all pattern matching
 * @param pattern Object with variants of all allowed values declared for matching expression and their handlers
 * @param shape Value passed fro whom matching is performad
 */
const matching: <PT extends StrType, RT>(pattern: Pattern<PT, RT>, PT) => RT = (pattern, shape) =>
    pattern[shape.type] !== undefined ? pattern[shape.type](shape) : pattern["_"]();

/**
 * Matcher function used for functional/non inheritance based matching
 * Curried because generic parameters have to be passed all or none,
 * So first function recieves variant set for matching as type parameter
 * Second one for return type, parameters can be omitted and inferred
 */
export const match: <PT extends StrType>() => <RT>(
    pattern: Pattern<PT, RT>,
) => (shape: PT) => RT = () => (pattern) => (shape) => matching(pattern, shape);

/**
 * Base class that provides pattern ADT and pattern matching functionality through inheritance
 * Various container types can be derrived from this,
 * Or value classes could be created directly by inheriting this
 */
export abstract class ADT<PT extends StrType> {
    abstract type: string;

    match: <RT>(pattern: Pattern<PT, RT>) => RT = (pattern) => matching(pattern, this);
}


/**
 * Loose interface that describes collections that be in for expression
 * Should be more precisely defined in abstract collection classes
 * Should be implemented in each variant class
 */
export type Mapper<PT extends StrType> = {

    map :(mapper: (v: any) => any) => ADT<PT>;

    flatMap :(mapper: (v: any) => any) => ADT<PT>;
}