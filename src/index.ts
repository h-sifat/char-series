const SERIES_STRING_LENGTH = 4; // e.g., "0..9"
const LAST_INDEX_OF_SERIES_STRING = SERIES_STRING_LENGTH - 1;
const SERIES_PATTERN = /^.\.\..$/;

type SeriesArgObject = { from: string; to: string };
type FirstArg = TemplateStringsArray | string | SeriesArgObject;

export default function series(firstArg: FirstArg, ...values: any[]): string[] {
  let seriesString: string;

  if (is("string")(firstArg)) seriesString = firstArg;
  else if (firstArg && is("object")(firstArg)) {
    if (Array.isArray(firstArg))
      seriesString = getStringFromTaggedTemplate(firstArg, values);
    else if (isValidSeriesArgObject(firstArg))
      seriesString = `${firstArg.from}..${firstArg.to}`;
    else throw new Error(`Invalid argument object`);
  } else throw new Error(`Invalid argument: "${firstArg}"`);

  if (!SERIES_PATTERN.test(seriesString))
    throw new Error(`Invalid series "${seriesString}"`);

  const seriesArray = getSeries(
    seriesString.charAt(0),
    seriesString.charAt(LAST_INDEX_OF_SERIES_STRING)
  );

  return seriesArray;
}

function isValidSeriesArgObject(arg: any): arg is SeriesArgObject {
  return (
    is("string")(arg.from) &&
    is("string")(arg.to) &&
    arg.from.length === 1 &&
    arg.to.length === 1
  );
}

interface AllTypes {
  string: string;
  number: number;
  symbol: Symbol;
  boolean: boolean;
  function: Function;
  object: object | null;
}
function is<T extends keyof AllTypes>(type: T) {
  return (arg: any): arg is AllTypes[T] => typeof arg === type;
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

function getStringFromTaggedTemplate(strings: string[], values: any[]) {
  let result = "";

  let index = 0;
  for (; index < strings.length - 1; index++)
    result += strings[index] + values[index];

  result += strings[index];

  return result;
}
