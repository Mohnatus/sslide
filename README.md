# SlideIt
Simple js animation library for slide effect

## Install

```npm i slideit```

## Usage

```js
const slideit = require('slideit');
let slideEl = slideit(document.getElementById('element'));

slideEl.slideDown(500, () => console.log('slide end'));
slideEl.slideUp(500, () => console.log('slide end'));
slideEl
    .slideUp(500, () => console.log('slide end'))
    .slideDown(500, () => console.log('slide end'));
slideEl.slideToggle(500, () => console.log('slide end'));
```



