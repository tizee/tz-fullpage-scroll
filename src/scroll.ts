enum Easings {
  linear = 'linear',
  ease = 'ease',
  easeIn = 'easeIn',
  easeOut = 'easeOut',
  easeInOut = 'easeInOut',
  easeInQuad = 'easeInQuad',
  easeOutQuad = 'easeOutQuad',
  easeInOutQuad = 'easeInOutQuad',
  easeInCubic = 'easeInCubic',
  easeOutCubic = 'easeOutCubic',
  easeInOutCubic = 'easeInOutCubic',
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
}

// see https://developer.mozilla.org/en-US/docs/Web/CSS/transition-timing-function
const mapToCSS3: Record<string, string> = {
  linear: 'cubic-bezier(0.0, 0.0, 1.0, 1.0)',
  ease: 'cubic-bezier(0.25, 0.1, 0.25, 1.0)',
  easeIn: 'cubic-bezier(0.42, 0, 1.0, 1.0)',
  easeOut: 'cubic-bezier(0, 0, 0.58, 1.0)',
  easeInOut: 'cubic-bezier(0.42, 0, 0.58, 1.0)',
};

class PageScroll {
  static defaultConfig: Config = {
    easing: Easings.easeInOutQuad,
    duration: 600,
    slideClass: 'slide',
    loop: true,
  };
  private config: Config;
  private container: HTMLElement;
  private curIdx: number;
  private total: number;
  private lastTime: unknown;
  private isAnimating: boolean;

  constructor(container: HTMLElement, config?: Config) {
    this.config = Object.assign(PageScroll.defaultConfig, {}, config);
    this.container = container;
    this.curIdx = 0;
    this.total = 0;
    this.isAnimating = false;
    document.documentElement.style.overflow = 'hidden';
    this.handleResize = this.handleResize.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.init();
  }

  init(): void {
    const { height } = document.documentElement.getBoundingClientRect();
    let slides = this.container.querySelectorAll<HTMLElement>(
      '.' + this.config.slideClass
    );
    // use css3 animation
    this.container.style.transition = `all ${mapToCSS3[this.config.easing]} ${
      this.config.duration
    }ms`;
    // you can scroll once transition end
    this.container.ontransitionend = () => {
      this.isAnimating = false;
    };
    // load from url
    let idx = Number.parseInt(
      window.location.hash
        .replace(`#${this.config.slideClass}`, '')
        .split('/')[0]
    );
    if (!Number.isNaN(idx)) {
      this.curIdx = idx;
      this.moveToSlide(this.curIdx);
    }
    this.total = slides.length;
    this.setSlidesHeight(slides, height);
    this.container.style.position = 'relative';
    this.container.style.height = '100%';
    slides.forEach(el => {
      el.style.position = 'relative';
    });
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
      this.moveToSlide(this.curIdx);
    } else {
      throw new Error(`PageScroll need id for slides`);
    }
  }

  updateHash() {
    window.location.hash = (this.config.slideClass || 'slide') + this.curIdx;
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
    this.moveToSlide(this.curIdx);
    this.updateHash();
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

  // move to index-th slide
  moveToSlide(index: number): void {
    let slides = this.container.querySelectorAll<HTMLElement>(
      '.' + this.config.slideClass
    );
    // scroll down
    this.isAnimating = true;
    this.container.style.transform = `translate3d(0,-${
      index * document.documentElement.clientHeight
    }px,0)`;
    slides.forEach(el => el.classList.remove('active'));
    slides[index].classList.toggle('active');
  }
}

export default PageScroll;
