export interface SeriesArgObject {
  to: string;
  from: string;
}

export type FirstArg = TemplateStringsArray | string | SeriesArgObject;

export interface AllTypes {
  string: string;
  number: number;
  symbol: Symbol;
  boolean: boolean;
  function: Function;
  object: object | null;
}
