export type Char = { char: string };
export type FromTo<T> = { to: T; from: T };
export type Reverse = { reverse: boolean };

export type FromToCharRange = Reverse & FromTo<string>;
export type CharCodeRange = FromTo<number>;
export type BeforeCharRange = Char & Reverse & { before: number };
export type AfterCharRange = Char & Reverse & { after: number };
export type BeforeAndAfterCharRange = BeforeCharRange & AfterCharRange;

export type RangeObject =
  | FromToCharRange // "a..c"
  | BeforeCharRange // "5-e"
  | AfterCharRange // "e+5"
  | BeforeAndAfterCharRange; // "5-e+5"

type RangeObjectsWithOptionalReverseProp = FilterKeys<
  RangeObject,
  "reverse"
> & { reverse?: boolean };

export type FirstArg =
  | TemplateStringsArray
  | RangeObjectsWithOptionalReverseProp
  | RangeObjectsWithOptionalReverseProp[]
  | string;

type FilterKeys<T, KeyToRemove extends keyof T> = {
  [key in keyof T as Exclude<key, KeyToRemove>]: T[key];
};

export interface AllTypes {
  char: string;
  string: string;
  number: number;
  symbol: Symbol;
  boolean: boolean;
  function: Function;
  object: object | null;
  non_null_object: object;
  positive_integer: number;

  // array types
  "char[]": string[];
  "string[]": string[];
  "number[]": number[];
  "symbol[]": Symbol[];
  "boolean[]": boolean[];
  "function[]": Function[];
  "object[]": (object | null)[];
  "non_null_object[]": object[];
  "positive_integer[]": number[];
}
