# SSlide
Simple js animation library for slide effect

## Install

```npm i xslide```

## Usage

```js
const sslide = require('sslide');
let slideEl = xslide(document.getElementById('element'));

slideEl.slideDown(500, () => console.log('slide end'));
slideEl.slideUp(500, () => console.log('slide end'));
slideEl
    .slideUp(500, () => console.log('slide end'))
    .slideDown(500, () => console.log('slide end'));
slideEl.slideToggle(500, () => console.log('slide end'));
```



