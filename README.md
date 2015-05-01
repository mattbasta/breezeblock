# BreezeBlock

An experimental templating language for JS that can compile directly to DOM.


## Technique

BreezeBlock templates can compile to a number of different formats:

- HTML, like most other templating engines
- Precompiled HTML generator (WIP)
- Precompiled DOM generator


The HTML format simply outputs a string of markup when the template is rendered. The Precompiled HTML generator format outputs the template as JavaScript, preventing unnecessary overhead from parsing the template and traversing its AST. This feature is implemented in many templating engines. The DOM generator is unique: the template is output as JavaScript that directly generates DOM using `createElement` and `createTextNode`.


## Work to Be Done

- Decide which language constructs to make available
  - `{% loop ... %}`
  - `{% if ... %}`
  - ...
- Figure out where each language construct should be usable
  - Conditional attributes
  - Conditional attribute names
  - Conditional attribute values
  - Loops to define attributes
- More expression features
  - Member expressions `{{foo.bar}}`
  - Subscript expressions `{{foo[bar]}}`
- Support for "noescape" (triple brace `{{{foo}}}`)
- Support for expressions within strings `<img src="{{cdn}}/img/{{imagePath}}" />`
- Support for valueless attributes `<input type="checkbox" checked>`
