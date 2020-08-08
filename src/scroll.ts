import { linear, easeInQuad, easeOutQuad, easeInOutQuad } from './easings';
enum Easings {
  linear = 'linear',
  ease = 'ease',
  easeIn = 'easeIn',
  easeOut = 'easeOut',
  easeInOut = 'easeInOut',
}

interface Config {
  // easing function
  // to-do: use js animation
  easing: Easings;
  // millisecond
  duration: number;
  // slide classname
  slideClass: string;
  // whether loop when reching boundaries
  loop: boolean;
  // use rAF for animation
  useJS: boolean;
}

const mapToFunction: Record<string, Function> = {
  linear: linear,
  ease: easeInOutQuad,
  easeIn: easeInQuad,
  easeInOutQuad: easeInOutQuad,
};
// see https://developer.mozilla.org/en-US/docs/Web/CSS/transition-timing-function
const mapToCSS3: Record<string, string> = {
  linear: 'cubic-bezier(0.0, 0.0, 1.0, 1.0)',
  ease: 'cubic-bezier(0.25, 0.1, 0.25, 1.0)',
  easeIn: 'cubic-bezier(0.42, 0, 1.0, 1.0)',
  easeOut: 'cubic-bezier(0, 0, 0.58, 1.0)',
  easeInOut: 'cubic-bezier(0.42, 0, 0.58, 1.0)',
};

interface ScrollMethod {
  (
    container: HTMLElement,
    slideClass: string,
    type: Easings,
    duration: number,
    index: number,
    callback: Function,
    dir?: boolean
  ): void;
}

const DefaultScroll: ScrollMethod = () => {
  // noop
};

const lerp = (a: number, b: number, progress: number) => {
  return a + (b - a) * progress;
};

const CSSScroll: ScrollMethod = (
  container: HTMLElement,
  slideClass: string,
  type: Easings,
  duration: number,
  index: number,
  callback: Function,
  dir?: boolean
) => {
  // scroll down
  // only run once
  container.style.transition = `all ${mapToCSS3[type]} ${duration}ms`;
  requestAnimationFrame(() => {
    console.log(index);
    let slides = container.querySelectorAll<HTMLElement>('.' + slideClass);
    container.ontransitionend = () => {
      if (callback) {
        console.log('callback');
        callback();
      }
    };
    container.style.transform = `translate3d(0,-${
      index * document.documentElement.clientHeight
    }px,0)`;
    slides.forEach(el => el.classList.remove('active'));
    slides[index].classList.toggle('active');
  });
};

const JSScroll: ScrollMethod = (
  container: HTMLElement,
  slideClass: string,
  type: Easings,
  duration: number,
  index: number,
  callback: Function,
  dir?: boolean
) => {
  let slides = container.querySelectorAll<HTMLElement>('.' + slideClass);
  let start = new Date().getTime();
  slides.forEach(el => el.classList.remove('active'));
  slides[index].classList.toggle('active');
  function scroll() {
    let cur = new Date().getTime();
    let offset = cur - start;
    let progress = mapToFunction[type](offset / duration);
    const height = document.documentElement.clientHeight;
    if (dir) {
      const newHeight = lerp((index - 1) * height, index * height, progress);
      container.style.transform = `translate3d(0,-${newHeight}px,0)`;
    } else {
      const newHeight = lerp((index + 1) * height, index * height, progress);
      container.style.transform = `translate3d(0,-${newHeight}px,0)`;
    }
    if (offset >= duration) {
      // end
      if (callback) {
        console.log('callback');
        callback();
      }
      return;
    }
    requestAnimationFrame(scroll);
  }
  scroll();
};

class PageScroll {
  static defaultConfig: Config = {
    easing: Easings.ease,
    duration: 600,
    slideClass: 'slide',
    loop: true,
    useJS: false,
  };
  private scrollMethod: ScrollMethod;
  private config: Config;
  private container: HTMLElement;
  private curIdx: number;
  private total: number;
  public isAnimating: boolean;

  constructor(container: HTMLElement, config?: Config) {
    this.config = Object.assign(PageScroll.defaultConfig, {}, config);
    this.container = container;
    this.scrollMethod = DefaultScroll;
    this.curIdx = 0;
    this.total = 0;
    this.isAnimating = false;
    document.documentElement.style.overflow = 'hidden';
    this.handleResize = this.handleResize.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.init();
  }

  setScrollMode(useJS: boolean): void {
    this.config.useJS = useJS;
    if (this.config.useJS) {
      // reset
      this.container.style.transition = ``;
      // you can scroll once transition end
      this.scrollMethod = JSScroll;
    } else {
      // use css3 animation
      // we could also use animate() to create an Animation Object
      this.scrollMethod = CSSScroll;
      // you can scroll once transition end
    }
  }

  init(): void {
    const { height } = document.documentElement.getBoundingClientRect();
    let slides = this.container.querySelectorAll<HTMLElement>(
      '.' + this.config.slideClass
    );
    this.container.ontransitionend = () => {
      this.isAnimating = false;
    };
    this.total = slides.length;
    this.setSlidesHeight(slides, height);
    this.setScrollMode(this.config.useJS);
    this.container.style.position = 'relative';
    this.container.style.height = '100%';
    slides.forEach(el => {
      el.style.position = 'relative';
    });
    // load from url
    let idx = Number.parseInt(
      window.location.hash
        .replace(`#${this.config.slideClass}`, '')
        .split('/')[0]
    );
    console.log(this.curIdx, idx);
    if (!Number.isNaN(idx)) {
      this.curIdx = idx;
      const callback = () => {
        this.isAnimating = false;
      };
      callback.bind(this);
      this.isAnimating = true;
      this.scrollMethod(
        this.container,
        this.config.slideClass,
        this.config.easing,
        this.config.duration,
        this.curIdx,
        callback
      );
    }
    this.addListeners();
  }

  setContainer(container: HTMLElement) {
    this.container = container;
    this.removeListeners();
    this.init();
  }

  addListeners() {
    window.addEventListener('resize', this.handleResize, false);
    window.addEventListener('wheel', this.handleScroll, false);
  }

  handleScroll(e: WheelEvent) {
    const { deltaY } = e;
    if (deltaY > 0) {
      this.scrollDown();
    } else {
      this.scrollUp();
    }
  }

  // move down on slide
  scrollDown(): void {
    if (!this.isAnimating) {
      this.scroll(true);
    }
  }

  // move up one slide
  scrollUp(): void {
    if (!this.isAnimating) {
      this.scroll(false);
    }
  }

  removeListeners() {
    window.removeEventListener('resize', this.handleResize, false);
  }

  setSlidesHeight(slides: NodeListOf<HTMLElement>, height: number) {
    if (slides.length) {
      slides.forEach(slide => {
        this.setHeight(slide, height);
      });
    }
  }

  setHeight(el: HTMLElement, height: number) {
    el.style.height = height + 'px';
  }

  // responsive
  handleResize() {
    if (this.config.slideClass) {
      const { height } = document.documentElement.getBoundingClientRect();
      let slides = this.container.querySelectorAll<HTMLElement>(
        '.' + this.config.slideClass
      );
      this.setSlidesHeight(slides, height);
      const callback = () => {
        this.isAnimating = false;
      };
      this.isAnimating = true;
      this.scrollMethod(
        this.container,
        this.config.slideClass,
        this.config.easing,
        this.config.duration,
        this.curIdx,
        callback.bind(this)
      );
    } else {
      throw new Error(`PageScroll need id for slides`);
    }
  }

  // defer animation to scroll
  scroll(dir: boolean) {
    if (dir) {
      // scroll down
      if (this.curIdx + 1 === this.total && !this.config.loop) {
        return;
      }
      this.curIdx = (this.curIdx + 1) % this.total;
    } else {
      // scroll up
      if (this.curIdx - 1 < 0 && !this.config.loop) {
        return;
      }
      this.curIdx = (this.curIdx - 1 + this.total) % this.total;
    }
    const callback = () => {
      this.isAnimating = false;
    };
    this.isAnimating = true;
    this.scrollMethod(
      this.container,
      this.config.slideClass,
      this.config.easing,
      this.config.duration,
      this.curIdx,
      callback.bind(this),
      dir
    );
    this.updateHash();
  }

  updateHash() {
    window.location.hash = (this.config.slideClass || 'slide') + this.curIdx;
  }
}

export default PageScroll;
