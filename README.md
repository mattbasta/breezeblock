# BreezeBlock

An experimental templating language for JS that can compile directly to DOM.

Compatible with all modern browsers and IE9+.


## Technique

BreezeBlock templates can compile to a number of different formats:

- HTML, like most other templating engines
- Precompiled HTML generator (WIP)
- Precompiled DOM generator


The HTML format simply outputs a string of markup when the template is rendered. The Precompiled HTML generator format outputs the template as JavaScript, preventing unnecessary overhead from parsing the template and traversing its AST. This feature is implemented in many templating engines. The DOM generator is unique: the template is output as JavaScript that directly generates DOM using `createElement` and `createTextNode`.

```html
<!-- This: -->
<img src={{foo}} />

<!-- becomes this: -->
<script>
  function template(document, elem, scope) {
    var elem1 = document.createElement("img");

    elem1.setAttribute("src".toLowerCase(), scope["foo"]);
    elem.appendChild(elem1);
    elem.appendChild(document.createTextNode("\n"));
  }
</script>
```


## Documentation

Write HTML as you normally would. Self-closing tags (like `<img>`) must use a closing slash (`<img />`), though this requirement may be lifted in the future.


```html
<div>
  Text nodes can be included inline
  <br />
  <!-- HTML comments are welcome -->
  <b class="really-bold">Mix and match tags</b>
</div>
```


Attribute names and values may be variable:

```mustache
<div {{foo}}="bar"></div>
<div data-foo={{bar}}></div>
```


Node contents can be variable:

```mustache
<div>{{value}}</div>
```


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
- Support for eliminating the closing slash on self-closing tags
