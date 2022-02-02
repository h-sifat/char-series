# `Char-[ 's', 'e', 'r', 'i', 'e', 's' ]`
Just a simple function to generate an array of characters form the given range
string. For example __`"0..9"`__ to generate `["0", "1", "2", ..., "9"]`

## Importing

The library usages __UMD__ module system so you can use it with any module
system of your choice. You can also use it in your html with the `<script>`
tag.


__JavaScript__
```js
import series from "char-series"; // es module
// or
const series = require("char-series"); // commonjs
// or any other module system that the umd module system supports.
```
__html__
```html
<script src="https://unpkg.com/char-series"></script>
<-- It will be available globally by the name "char_series" -->
```

## Usages
The `series` function takes 4 kinds of argument: `string`, `object`, 
`tagged-template`, or an `array of objects`.

```js
series `1..3` // tagged template
series("1..3") // string
series({from: "1", to: "3"}) // object
// all the above function call generates the array ["1", "2", "3"]

series([{from: "1", to: "3"}, {from: "a", to: "c"}]) // object array
// this gives us the array: ["1", "2", "3", "a", "b", "c"]
```
__Note:__ In _html_ the function name is `char_series`. So use
`char_series("1..3")`.

## Argument Types

### String Range Syntax

1. __`"<from>..<to>"`__ gives us all characters from the `from`(inclusive)
character to the `to`(inclusive) character. e.g., `"a..e"`, `"0..9"`. We can
even get a reversed array just by reversing the start and end order. So
`"c..a"` would give us `["c", "b", "a"]`
1. __`<before-count>-<char>`__ gives all the characters starting from
`before-count` characters before the `char` character and ending at the
`char` character. e.g., `"2-c"` gives us `["a", "b", "c"]`
1. __`<char>+<after-count>`__ gives all the characters starting from the `char` 
character and ending at `after-count` characters after the `char` character.
e.g., `"a+2"` gives us `["a", "b", "c"]`
1. __`<before-count>-<char>+<after-count>`__ is the combination of the previous
two method. e.g., `"2-c+2"` gives us `["a", "b", "c", "d", "e"]`

__Flag:__  Any series can be reversed by adding a __`"!r"`__ flag at the
end or switching the `from` `to` characters order.
e.g., `"a..c!r"` gives us  `["c", "b", "a"]` and `"c..a!r"` gives us
`["a", "b", "c"]`.

#### Series Concatenation for string argument
Two or more series can be concatenated with an __`"&"`__ character e.g.,
`"0..9&a..z"`. But this feature gives rise to a problem though! What if we want
to see the series `"&..'"`? It should return us `["&", "'"]` but it throws an
exception.

So to solve this problem we've to __escape__ the __`"&"`__ character with a
__`"/"`__ (Notice: It's not a backslash __`"\"`__) whenever it __doesn't__
represent a __delimiter__. And then we also have to __escape__
the __`"/"`__ with another __`"/"`__ character if we want to write a single 
__`"/"`__ character (Ugh :unamused:)!

Examples:
Un-Escaped and Incorrect | Escaped and Correct 
-------------------------|---------------------
`"&..."` | `"/&..."`
`"*../"` | `"*..//"`
`"a..&&1..5"` | `"a../&&1..5"`
`"a..&&1..5&a..c"` | `"a../&&1..5&a..c!r"` 


### Object Argument Type
1. __`{from: char; to: char}`__ e.g., `{from: "a", to: "c"}`
1. __`{char: char; before: number}`__ e.g., `{char: "c", before: 2}`
1. __`{char: char; after: number}`__ e.g., `{char: "a", after: 2}`
1. __`{char: char; before: number; after: number}`__ e.g.,
`{char: "b", before: 1, after: 1}`

All the examples above gives us the array  `["a", "b", "c"]`.

__Flag:__ All these objects take an optional __`{reverse: boolean}`__
property to reverse a series. e.g., `{from: "a", to: "c", reverse: true}`
gives us `["c", "b", "a"]` and  `{from: "c", to: "a", reverse: true}` gives
us `["a", "b", "c"]`.


#### Series Concatenation for object argument
To concatenate tow or more series we can pass an array of series objects, e.g.,
`[{from: "1", to: "3"}, {char: "a", after: 2}]` to get the series
`["1", "2", "3", "a", "b", "c"]`.

## Examples
```js
const alphanumeric = [...series `0..9`, ...series `a..z`];
// or better if we use series concatenation
const alphanumeric = series `0..9&a..z` // or series("0..9&a..z");
// or 
const alphanumeric = series([{from: "0", to: "9"}, {from: "a", to: "z"}])
/* alphanumeric = [
  '0', '1', '2', '3', '4', '5', '6',
  '7', '8', '9', 'a', 'b', 'c', 'd',
  'e', 'f', 'g', 'h', 'i', 'j', 'k',
  'l', 'm', 'n', 'o', 'p', 'q', 'r',
  's', 't', 'u', 'v', 'w', 'x', 'y',
  'z'
] */

// seems like it works with other languages too :)
const digits_in_bengali = series `০+9` // give us 9 chars after "০"(inclusive)
/* [
  '০', '১', '২', '৩',
  '৪', '৫', '৬', '৭',
  '৮', '৯'
] */

// I wonder what characters are before "0"
const five_chars_before_zero = series({char: "0", before: 5}) // or series `5-0`
/* [ '+', ',', '-', '.', '/', '0' ] */

// 5 characters before "t" and 2 characters after "t" then reverse it
const my_chars = series `5-t+2!r` // or series("5-t+2!r")
//or series({char: "t", before: 5, after: 2, reverse: true})
/* [ 'v', 'u', 't', 's', 'r', 'q', 'p', 'o' ] */
```

## CLI
Yes it also has a cli! Incase you find it useful. But right now it's pretty
basic.

```bash
# first install it globally or use npx if you prefer
> npm i -g char-series
# see the help text
> series --help
```

## How it works?
Good question! It's really simple :)

```ts
function getSeries({ from, to }: {form: number; to: number}) {
  const length = Math.abs(from - to) + 1;

  return from > to
    ? Array.from({ length }, () => String.fromCharCode(from--))
    : Array.from({ length }, () => String.fromCharCode(from++));
}

getSeries({from: "a".charCodeAt(0), to: "c".charCodeAt(0)})
// and we get ["a", "b", "c"]
```

Finally, let me know if there are any improvements that I can make to this
package and kindly give this package a :star: on github if you like it :)
