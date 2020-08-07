<div align="center">
<h3>tz-fullpage-scroll</h3>
<p>A simple fullpage scroll plugin.</p>

</div>

## Why?

Have fun building my own wheel.

## Usage

```javascript
import PageScroll from 'tz-fullpage-scroll';

let container = document.querySelector('.slides');
let ps = new PageScroll(container, {
  easing: 'linear', // easing name | function | transition-timing-function
  duration: 600, // time to scroll a slide
  id: 'slide', // common id for slides
});
```
