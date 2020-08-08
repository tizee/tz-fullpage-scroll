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
  // linear, ease, easeIn, easeOut, easeInOut
  easing: 'linear',
  duration: 600, // time to scroll a slide
  id: 'slide', // common class name for slides
  useJS: false, // use rAF
  loop: false, // wheteher loop back to start/end when reaching end/start
});
```
