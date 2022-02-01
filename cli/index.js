#!/usr/bin/env node

const series = require("../dist");
const getSeriesString = (rangeString, separator = " ") => {
  try {
    return series(rangeString).join(separator);
  } catch (ex) {
    console.error(ex.message);
    process.exit(1);
  }
};

const args = process.argv.slice(2);

if (!args.length) {
  console.log(`See the help text.\n"series --help"`);
  process.exit(0);
}

if (args.length !== 1 && args.length !== 3) {
  console.error(`Invalid arguments`);
  process.exit(1);
}

if (args.length === 1) {
  const arg = args[0];

  if (arg === "--help") {
    console.log(require("./help-txt"));
    process.exit(0);
  }

  console.log(getSeriesString(arg));
} else {
  let separator, rangeString;
  if (args[0] === "-s") [, separator, rangeString] = args;
  else if (args[1] === "-s") [rangeString, , separator] = args;
  else {
    console.error(`Invalid arguments (error_for: "-s" option)!`);
    process.exit(1);
  }

  console.log(getSeriesString(rangeString, separator));
}
