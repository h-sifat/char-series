// @ts-nocheck
import {
  is,
  MAX_CHAR_CODE,
  parseSeries,
  normalizeRangeObject,
  processTaggedTemplate,
  splitConcatenatedSeries as scs,
} from "../src/util";

describe("parseSeries", () => {
  const testData = [
    { input: "a..c", output: { from: "a", to: "c" } },
    { input: "....", output: { from: ".", to: "." } },
    { input: "a+5", output: { char: "a", after: 5 } },
    { input: "5-a", output: { char: "a", before: 5 } },
    { input: "123414-a", output: { char: "a", before: 123414 } },
    { input: "5-a+5", output: { char: "a", before: 5, after: 5 } },
    { input: "a..c!r", output: { from: "a", to: "c", reverse: true } },
    { input: "a+5!r", output: { char: "a", after: 5, reverse: true } },
    { input: "5-a!r", output: { char: "a", before: 5, reverse: true } },
    { input: "a+25433236435", output: { char: "a", after: 25433236435 } },
    {
      input: "5-a+5!r",
      output: { char: "a", before: 5, after: 5, reverse: true },
    },
  ];

  testData.forEach(({ output }) => (output.reverse = !!output.reverse));

  it.each(testData)(`("$input") => $output`, ({ input, output }) => {
    if (!("reverse" in output)) output.reverse = false;
    expect(parseSeries(input)).toEqual(output);
  });

  it(`throws error for invalid syntax`, () => {
    const invalidRangeStrings = [
      "+a",
      "a+",
      "b.c",
      "a-a",
      "b--c",
      "b.-c",
      "as..c",
      "a..cd",
      "c+a-a",
      "5~a-o",
      "o~a~5",
      "asda..cdsd",
    ];

    for (const rangeStr of invalidRangeStrings)
      expect(() => {
        parseSeries(rangeStr);
      }).toThrow(Error);
  });
});

describe("is(type)(value)", () => {
  it.each([
    { type: "char", value: "c", result: true },
    { type: "char", value: "", result: false },
    { type: "string", value: "", result: true },
    { type: "char", value: "casdf", result: false },
  ])(`is("$type")("$value") === $result`, ({ type, value, result }) => {
    expect(is(type)(value)).toBe(result);
  });
  it.each([
    { type: "positive_integer", value: 0, result: true },
    { type: "positive_integer", value: 123, result: true },
    { type: "positive_integer", value: -1, result: false },
    { type: "number[]", value: "not_array", result: false },
    { type: "number[]", value: [1, 2, "3"], result: false },
    { type: "number[]", value: [1, 2, 3], result: true },
  ])(`is("$type")($value) === $result`, ({ type, value, result }) => {
    expect(is(type)(value)).toBe(result);
  });
});

describe("normalizeRangeObject", () => {
  it.each([
    {
      input: { from: "a", to: "c" },
      output: { from: "a".charCodeAt(0), to: "c".charCodeAt(0) },
    },
    {
      input: { from: "a", to: "c", reverse: true },
      output: { to: "a".charCodeAt(0), from: "c".charCodeAt(0) },
    },
    {
      input: { char: "c", before: 2 },
      output: { from: "a".charCodeAt(0), to: "c".charCodeAt(0) },
    },
    {
      // char code of "\t" is 9
      input: { char: "\t", before: 20 },
      output: { from: 0, to: "\t".charCodeAt(0) },
    },
    {
      input: { char: "c", before: 2, reverse: true },
      output: { to: "a".charCodeAt(0), from: "c".charCodeAt(0) },
    },
    {
      input: { char: "a", after: 2 },
      output: { from: "a".charCodeAt(0), to: "c".charCodeAt(0) },
    },
    {
      input: { char: "a", after: MAX_CHAR_CODE + 23423 },
      output: { from: "a".charCodeAt(0), to: MAX_CHAR_CODE },
    },
    {
      input: { char: "a", after: 2, reverse: true },
      output: { to: "a".charCodeAt(0), from: "c".charCodeAt(0) },
    },
    {
      input: { char: "c", before: 2, after: 2 },
      output: { from: "a".charCodeAt(0), to: "e".charCodeAt(0) },
    },
    {
      input: { char: "c", before: 2, after: 2, reverse: "non_boolean_value" },
      output: { to: "a".charCodeAt(0), from: "e".charCodeAt(0) },
    },
  ])(`($input) => $output`, ({ input, output }) => {
    expect(normalizeRangeObject(input)).toEqual(output);
  });

  const invalidRangeObjects = [
    null,
    { a: 1 },
    { char: "a" },
    { char: "aasdf", after: 2 },
    { from: "a", to: "a" },
    { char: "a", before: 0 },
    { char: "a", after: -1 },
    { char: "a", before: -1 },
    { char: "a", after: -234 },
    { char: "a", before: -241 },
    { char: "a", before: 2, after: 0 },
    { char: "a", before: 0, after: 1 },
    { char: "a", before: -2, after: 1 },
    { char: "a", after: 0, reverse: false },
    { char: "a", before: 2, after: -1, reverse: true },
  ];

  it.each(invalidRangeObjects)(`throws error for %o`, (input) => {
    expect(() => normalizeRangeObject(input)).toThrow(Error);
  });
});

describe("processTaggedTemplate", () => {
  it("returns a string from tagged template", () => {
    const func = (s: string[], ...v: any[]) => processTaggedTemplate(s, v);
    expect(func``).toBe("");
    expect(func`a..b`).toBe("a..b");
    expect(func`a..${"b"}`).toBe("a..b");
    expect(func`${"a"}${"."}.${"b"}`).toBe("a..b");
    expect(func`${"a"}${"."}${"."}${"b"} `).toBe("a..b ");
  });
});

describe("splitConcatenatedSeries", () => {
  it.each([
    { input: "a..b", output: ["a..b"] },
    { input: "a../&", output: ["a..&"] },
    { input: "a../&!r", output: ["a..&!r"] },
    { input: "/&..b", output: ["&..b"] },
    { input: "/&+5&5-/&&/&../&", output: ["&+5", "5-&", "&..&"] },
    { input: "a..b&c..d", output: ["a..b", "c..d"] },
    { input: "a../&!r&c..d", output: ["a..&!r", "c..d"] },
    { input: "a..b/&c..d", output: ["a..b&c..d"] },
    { input: "a..b/&c..//", output: ["a..b&c../"] },
  ])(`("$input") => $output`, ({ input, output }) => {
    expect(scs(input)).toEqual(output);
  });

  it.each(["a../", "a../a"])(`throws error for "%s"`, (input) => {
    expect(() => {
      const result = scs(input);
      console.log(result);
    }).toThrow(Error);
  });
});
