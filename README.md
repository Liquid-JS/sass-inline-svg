# sass-inline-svg

[![GitHub license](https://img.shields.io/github/license/Liquid-JS/sass-inline-svg.svg)](https://github.com/Liquid-JS/sass-inline-svg/blob/master/LICENSE)
[![npm](https://img.shields.io/npm/dm/@liquid-js/sass-inline-svg.svg)](https://www.npmjs.com/package/@liquid-js/sass-inline-svg)
[![scope](https://img.shields.io/npm/v/@liquid-js/sass-inline-svg.svg)](https://www.npmjs.com/package/@liquid-js/sass-inline-svg)

A sass function that inlines svg files.

## Installation

    npm install @liquid-js/sass-inline-svg

## API Documentation

<https://liquid-js.github.io/sass-inline-svg/>

## Usage

### Simple example

```js
import inlinerFunctions from '@liquid-js/sass-inline-svg'
import { compile } from 'sass'

const result = compile('styles.scss', {
    functions: {
        ...inlinerFunctions,
        // other functions
    }
})
```

```scss
.logo-icon {
    background: svg("logo.svg");
}
```

### SVG transformation

The inliner accepts a second argument, a map that describes transformation as `{ selector: { attribute: value } }`. 

```scss
.logo-icon {
    background: svg("logo.svg", (path: (fill: green), rect: (stroke: white)));
}
```

In the above example all `path` elemens will have `fill="green"` and all `rect` elements will have `stroke="white"`.

### Configuring the inliner

```js
import { inliner } from '@liquid-js/sass-inline-svg'
import { compile } from 'sass'

const result = compile('styles.scss', {
    functions: {
        'svg($path, $selectors: null)': inliner('[basePath]', {
            // Use SVGO to optimize the code before inlining
            optimize: true,
            // Encode SVG as plain data URI, which is smaller than base64 encoding (but might not be supported on legacy browsers)
            encodingFormat: 'uri'
        })
    }
})
```

## License

[ISC License](https://github.com/Liquid-JS/sass-inline-svg/blob/master/LICENSE)
