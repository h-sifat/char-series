import { AllTypes, SeriesArgObject } from "./interface";

export function getStringFromTaggedTemplate(strings: string[], values: any[]) {
  let result = "";

  let index = 0;
  for (; index < strings.length - 1; index++)
    result += strings[index] + values[index];

  // now index is the last index
  result += strings[index];

  return result;
}

// @TODO support "a~5", "5~e", "3~f~23" syntax
export function validateAndFormatRange(range: string): string {
  const SERIES_PATTERN = /^.\.\..$/;

  if (!SERIES_PATTERN.test(range)) throw new Error(`Invalid series "${range}"`);

  return range;
}

// @TODO support {char: "e", before: 5, after: 3} argument
export function isValidSeriesArgObject(arg: any): arg is SeriesArgObject {
  return (
    is("string")(arg.from) &&
    is("string")(arg.to) &&
    arg.from.length === 1 &&
    arg.to.length === 1
  );
}

export function is<T extends keyof AllTypes>(type: T) {
  return (arg: any): arg is AllTypes[T] => typeof arg === type;
}
