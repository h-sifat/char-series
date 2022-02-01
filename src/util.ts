import {
  FromTo,
  Reverse,
  AllTypes,
  RangeObject,
  CharCodeRange,
  FromToCharRange,
} from "./interface";

export const MAX_CHAR_CODE = 1114112;

export function processTaggedTemplate(strings: string[], values: any[]) {
  values.push("");
  return strings.reduce((res, str, idx) => res + str + values[idx], "");
}

export function is<T extends keyof AllTypes>(type: T) {
  switch (type) {
    case "char":
      return (arg: any): arg is AllTypes[T] =>
        typeof arg === "string" && arg.length === 1;

    case "positive_integer":
      return (arg: any): arg is AllTypes[T] =>
        Number.isInteger(arg) && arg >= 0;

    case "non_null_object":
      return (arg: any): arg is AllTypes[T] => arg && is("object")(arg);

    default:
      return (arg: any): arg is AllTypes[T] => typeof arg === type;
  }
}

const RANGE_STRING_PROCESSORS = [
  {
    pattern: /^(.)\.\.(.)(?:!(r))?$/,
    getRangeObject: ([from, to, flag]: string[]) => ({
      from,
      to,
      reverse: !!flag,
    }),
  },

  // @WARNING do not change the order of processors below. It's like fizzbuzz
  {
    pattern: /^(\d+)-(.)\+(\d+)(?:!(r))?$/,
    getRangeObject: ([before, char, after, flag]: string[]) => ({
      char,
      before: +before,
      after: +after,
      reverse: !!flag,
    }),
  },
  {
    pattern: /^(\d+)-(.)(?:!(r))?$/,
    getRangeObject: ([before, char, flag]: string[]) => ({
      char,
      before: +before,
      reverse: !!flag,
    }),
  },
  {
    pattern: /^(.)\+(\d+)(?:!(r))?$/,
    getRangeObject: ([char, after, flag]: string[]) => ({
      char,
      after: +after,
      reverse: !!flag,
    }),
  },
];
export function processRangeString(rangeString: string): RangeObject {
  let result: RegExpExecArray | null;
  for (const processor of RANGE_STRING_PROCESSORS)
    if ((result = processor.pattern.exec(rangeString)))
      return processor.getRangeObject(result.slice(1));

  throw new Error(`Invalid range string: "${rangeString}"`);
}

export function normalizeRangeObject(rangeObject: any): CharCodeRange {
  rangeObject.reverse = !!rangeObject.reverse;
  const { reverse } = rangeObject;

  if (!("char" in rangeObject)) {
    assertValidFromToCharRange(rangeObject);

    const { from, to } = rangeObject;
    return reverseRangeIfNeeded({
      from: from.charCodeAt(0),
      to: to.charCodeAt(0),
      reverse,
    });
  }

  if ("before" in rangeObject && "after" in rangeObject)
    return reverseRangeIfNeeded({
      from: normalizeBeforeRange({ ...rangeObject, reverse: false }).from,
      to: normalizeAfterRange({ ...rangeObject, reverse: false }).to,
      reverse,
    });
  else if ("before" in rangeObject) return normalizeBeforeRange(rangeObject);
  else if ("after" in rangeObject) return normalizeAfterRange(rangeObject);
  else throw new Error(`Invalid range string/object`);
}

function normalizeBeforeRange(beforeRange: any): CharCodeRange {
  const { char, before, reverse } = beforeRange;

  assertIsChar(char);
  assertIsPositiveInteger(before, "before");

  const charCode = char.charCodeAt(0);

  let from = charCode - before;
  if (from < 0) from = 0;
  else if (from >= charCode) throw new Error(`Invalid before value ${before}.`);

  return reverseRangeIfNeeded({ from, to: charCode, reverse });
}

function normalizeAfterRange(afterRange: any): CharCodeRange {
  const { char, after, reverse } = afterRange;

  assertIsChar(char);
  assertIsPositiveInteger(after, "after");

  const charCode = char.charCodeAt(0);

  let to = charCode + after;
  if (to > MAX_CHAR_CODE) to = MAX_CHAR_CODE;
  else if (to <= charCode) throw new Error(`Invalid after value: ${after}.`);

  return reverseRangeIfNeeded({ from: charCode, to, reverse });
}

function reverseRangeIfNeeded<T>(arg: FromTo<T> & Reverse): FromTo<T> {
  const { from, to, reverse } = arg;
  return reverse ? { from: to, to: from } : { from, to };
}

function assertIsChar(char: any) {
  if (!is("char")(char)) throw new Error(`Invalid char: "${char}".`);
}

function assertIsPositiveInteger(
  value: any,
  label: string
): asserts value is number {
  if (!is("positive_integer")(value))
    throw new Error(`Invalid ${label} value: "${value}"`);
}

function assertValidFromToCharRange(arg: any): asserts arg is FromToCharRange {
  if (!is("char")(arg.from) || !is("char")(arg.to) || arg.to === arg.from)
    throw new Error(`Invalid range object.`);
}
