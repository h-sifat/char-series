import { FirstArg, FromTo } from "./interface";
import {
  is,
  processRangeString,
  normalizeRangeObject,
  processTaggedTemplate,
} from "./util";

export default function series(firstArg: FirstArg, ...values: any[]): string[] {
  let rangeObject: FromTo<number>;

  if (is("string")(firstArg))
    rangeObject = normalizeRangeObject(processRangeString(firstArg));
  else if (is("non_null_object")(firstArg)) {
    if (!Array.isArray(firstArg)) rangeObject = normalizeRangeObject(firstArg);
    else {
      const rangeString = processTaggedTemplate(firstArg, values);
      rangeObject = normalizeRangeObject(processRangeString(rangeString));
    }
  } else throw new Error(`Invalid argument: "${firstArg}"`);

  return getSeries(rangeObject);
}

function getSeries({ from, to }: FromTo<number>) {
  const length = Math.abs(from - to) + 1;

  return from > to
    ? Array.from({ length }, () => String.fromCharCode(from--))
    : Array.from({ length }, () => String.fromCharCode(from++));
}
