# BreezeBlock

An experimental templating language for JS that can compile directly to DOM.

Compatible with all modern browsers and IE9+.


## Technique

BreezeBlock templates can compile to a number of different formats:

- HTML, like most other templating engines
- Precompiled HTML generator
- Precompiled DOM generator


The HTML format simply outputs a string of markup when the template is rendered. The Precompiled HTML generator format outputs the template as JavaScript, preventing unnecessary overhead from parsing the template and traversing its AST. This feature is implemented in many templating engines. The DOM generator is unique: the template is output as JavaScript that directly generates DOM using `createElement` and `createTextNode`.

```html
<!-- This: -->
<img src={{foo}}>

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

Write HTML as you normally would. Self-closing tags that are not [void elements](http://www.w3.org/html/wg/drafts/html/master/single-page.html#void-elements) must use a closing slash (`<foo />`).


```html
<div>
  Text nodes can be included inline
  <br>
  <!-- HTML comments are welcome -->
  <b class="really-bold">Mix and match tags</b>

  <my-custom-element />
</div>
```


Attribute names and values may be variable:

```mustache
<div {{foo}}="bar"></div>
<div data-foo={{bar}}></div>

<!--
`fieldChecked` and `fieldReadonly` should contain "checked" and "readonly respectively"
-->
<input type="text" {{fieldChecked}} {{fieldReadonly}}>

<!-- Attributes may be conditional -->
<img src="foo.jpg" alt="" {% if imageTitle %}title={{imageTitle}}{%/ if %}>
<input type="checkbox" {% if checkboxChecked %}checked{%/ if %}>
```


Node contents can be variable:

```mustache
<div>Here is my {{value}}</div>
<aside>{{value}}</aside>
```


## Work to Be Done

- Decide which language constructs to make available
  - `{% loop ... %}`
  - `{% if ... %}`
  - ...
- Figure out where each language construct should be usable
  - Conditional attribute values
  - Loops to define attributes
- More expression features
  - Member expressions `{{foo.bar}}`
  - Subscript expressions `{{foo[bar]}}`
- Support for "noescape" (triple brace `{{{foo}}}`)
- Support for expressions within strings `<img src="{{cdn}}/img/{{imagePath}}" />`
