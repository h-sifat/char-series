const helpText = `Series - A character series generator just like "A..Z" of bash.
Synopsis: series [-s <separator>] character-range

Usages:
  1. series "a..c" # outputs: "a b c"
  2. series "a+2"  # outputs 2 character after "a" (inclusive): "a b c"
  3. series "2-c"  # outputs 2 character before "c" (inclusive): "a b c"
  4. series "2-c+2" # Combination of above two syntax, outputs: "a b c d e"

  Tip: Reversing character order or adding a "!r" flag at the end reverses the
  series. e.g., "c..a" => "c b a" or "a+2!r" => "c b a"

Options:
  [-s <separator>]: specify a separator string to join all the generated
  characters. e.g., series -s "-" "a..c" outputs "a-b-c"

  [--help]: shows the help text.

This tool is authored by Sifat Hossain.
GitHub Repository: https://github.com/h-sifat/char-series`;

module.exports = helpText;
