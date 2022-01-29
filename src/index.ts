import { FirstArg } from "./interface";
import {
  is,
  isValidSeriesArgObject,
  getStringFromTaggedTemplate,
  validateAndFormatRange,
} from "./util";

const SERIES_STRING_LENGTH = 4; // e.g., "0..9"
const LAST_INDEX_OF_SERIES_STRING = SERIES_STRING_LENGTH - 1;

export default function series(firstArg: FirstArg, ...values: any[]): string[] {
  let rangeStr: string;

  if (is("string")(firstArg)) rangeStr = firstArg;
  else if (firstArg && is("object")(firstArg)) {
    if (Array.isArray(firstArg))
      rangeStr = getStringFromTaggedTemplate(firstArg, values);
    else if (isValidSeriesArgObject(firstArg))
      rangeStr = `${firstArg.from}..${firstArg.to}`;
    else throw new Error(`Invalid argument object`);
  } else throw new Error(`Invalid argument: "${firstArg}"`);

  rangeStr = validateAndFormatRange(rangeStr);

  const seriesArray = getSeries(
    rangeStr.charAt(0),
    rangeStr.charAt(LAST_INDEX_OF_SERIES_STRING)
  );

  return seriesArray;
}

function getSeries(startChar: string, endChar: string) {
  let startCharCode = startChar.charCodeAt(0);
  let endCharCode = endChar.charCodeAt(0);

  if (startCharCode === endCharCode)
    throw new Error(`Invalid series "${startChar}..${endChar}"`);

  const seriesLength = Math.abs(startCharCode - endCharCode) + 1;

  const charArray = new Array(seriesLength);

  if (startCharCode > endCharCode)
    for (let i = 0; i < seriesLength; i++)
      charArray[i] = String.fromCharCode(startCharCode--);
  else
    for (let i = 0; i < seriesLength; i++)
      charArray[i] = String.fromCharCode(startCharCode++);

  return charArray;
}
