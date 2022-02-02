import { FirstArg, FromTo } from "./interface";
import {
  is,
  parseSeries,
  normalizeRangeObject,
  processTaggedTemplate,
  splitConcatenatedSeries,
} from "./util";

export default function series(firstArg: FirstArg, ...values: any[]): string[] {
  if (!firstArg) throw new Error(`Invalid argument`);

  let rangeObjects: FromTo<number>[] = [];

  if (is("string")(firstArg) || is("string[]")(firstArg)) {
    const seriesString = Array.isArray(firstArg)
      ? processTaggedTemplate(firstArg, values)
      : firstArg;

    rangeObjects = splitConcatenatedSeries(seriesString)
      .map(parseSeries)
      .map(normalizeRangeObject);
  } else if (is("non_null_object")(firstArg))
    rangeObjects = is("non_null_object[]")(firstArg)
      ? firstArg.map(normalizeRangeObject)
      : [normalizeRangeObject(firstArg)];
  else throw new Error(`Invalid argument: "${firstArg}"`);

  let seriesArray: string[] = [];
  for (const rangeObject of rangeObjects)
    seriesArray = seriesArray.concat(getSeries(rangeObject));

  return seriesArray;
}

function getSeries({ from, to }: FromTo<number>) {
  const length = Math.abs(from - to) + 1;

  return from > to
    ? Array.from({ length }, () => String.fromCharCode(from--))
    : Array.from({ length }, () => String.fromCharCode(from++));
}
