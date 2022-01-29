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
    expect(() => {
      series(seriesStr);
    }).toThrow(Error);
    expect(() => {
      series`${seriesStr}`;
    }).toThrow(Error);
  });

  it("returns a char array if everything is valid", () => {
    const expectedCharArray = ["a", "b", "c", "d", "e"];
    expect(series`a..e`).toEqual(expectedCharArray);
    expect(series("a..e")).toEqual(expectedCharArray);
    expect(series({ from: "a", to: "e" })).toEqual(expectedCharArray);
  });

  it("returns a reversed char array if the range is reversed", () => {
    const expectedCharArray = ["e", "d", "c", "b", "a"];
    expect(series`e..a`).toEqual(expectedCharArray);
    expect(series("e..a")).toEqual(expectedCharArray);
    expect(series({ from: "e", to: "a" })).toEqual(expectedCharArray);
  });
});
