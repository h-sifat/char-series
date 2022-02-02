// @ts-nocheck
import series from "../src";

describe("char-series", () => {
  it.each([
    0,
    "",
    [],
    {},
    12,
    null,
    3453,
    "b-c",
    "a..a",
    "....",
    "b--c",
    "c*-d",
    "\n..\t",
    "shut-up",
    undefined,
    "a;sldkjf",
    { from: 1, to: 2 },
    { from: "1", to: 2 },
    { from: "1", to: "234" },
    { from: "1sd", to: "234" },
  ])("throws error for input: '%s'", (seriesStr) => {
    expect(() => series(seriesStr)).toThrow(Error);
    expect(() => series`${seriesStr}`).toThrow(Error);
  });

  it.each([
    "a..e",
    "e..a!r",
    "a+4",
    "4-e",
    "2-c+2",
    "1-b+3",
    "a..b&c..e",
    [
      { from: "a", to: "b" },
      { from: "c", to: "e" },
    ],
    { from: "a", to: "e" },
    { char: "a", after: 4 },
    { char: "e", before: 4 },
    { char: "c", before: 2, after: 2 },
    { char: "b", before: 1, after: 3 },
    { from: "e", to: "a", reverse: true },
  ])(`(%s) => ["a", "b", "c", "d", "e"]`, (range) => {
    expect(series(range)).toEqual(["a", "b", "c", "d", "e"]);
  });

  it("returns a reversed char array if the range is reversed", () => {
    const expectedCharArray = ["e", "d", "c", "b", "a"];
    expect(series`${"e"}.${"."}a`).toEqual(expectedCharArray);
    expect(series("e..a")).toEqual(expectedCharArray);
    expect(series({ from: "e", to: "a" })).toEqual(expectedCharArray);
    expect(series({ from: "a", to: "e", reverse: true })).toEqual(
      expectedCharArray
    );
  });
});
