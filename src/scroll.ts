enum Easings {
  linear = 'linear',
  easeInQuad = 'easeInQuad',
  easeOutQuad = 'easeOutQuad',
  easeInOutQuad = 'easeInOutQuad',
  easeInCubic = 'easeInCubic',
  easeOutCubic = 'easeOutCubic',
  easeInOutCubic = 'easeInOutCubic',
}

interface Config {
  // easing function
  easing?: Easings;
  // millisecond
  duration?: number;
  // to-do: use css3 animation
  id?: string;
}

class PageScroll {
  static defaultConfig: Config = {
    easing: Easings.easeInOutQuad,
    duration: 600,
    id: 'slide',
  };
  private config: Config;
  private container: HTMLElement;
  private curIdx: number;
  private total: number;
  private lastTime: unknown;

  constructor(container: HTMLElement, config?: Config) {
    this.config = Object.assign(PageScroll.defaultConfig, {}, config);
    this.container = container;
    this.curIdx = 0;
    this.total = 0;
    this.handleResize = this.handleResize.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.init();
  }

  init(): void {
    const { height } = document.documentElement.getBoundingClientRect();
    let slides = this.container.querySelectorAll<HTMLElement>(
      '.' + this.config.id
    );
    this.total = slides.length;
    this.setSlidesHeight(slides, height);
    this.container.style.position = 'relative';
    this.container.style.height = '100%';
    slides.forEach(el => {
      el.style.position = 'relative';
    });
    this.addListeners();
  }

  setHeight(el: HTMLElement, height: number) {
    el.style.height = height + 'px';
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
    console.log('scroll', e);
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

  // responsive
  handleResize() {
    console.log('resize');
    if (this.config.id) {
      const { height } = document.documentElement.getBoundingClientRect();
      let slides = this.container.querySelectorAll<HTMLElement>(
        '.' + this.config.id
      );
      this.setSlidesHeight(slides, height);
      this.setHeight(this.container, height);
    } else {
      throw new Error(`PageScroll need id for slides`);
    }
  }

  // defer animation to scroll
  scroll(dir: boolean) {
    let slides = this.container.querySelectorAll<HTMLElement>(
      '.' + this.config.id
    );
    if (dir) {
      // scroll down
      this.curIdx = (this.curIdx + 1) % this.total;
      console.log(this.curIdx, this.total);
      this.container.style.transform = `translate3d(0,-${
        this.curIdx * this.container.clientHeight
      }px,0)`;
      this.container.style.transition = `all ease 600ms`;
    } else {
      // scroll up
      this.curIdx = (this.curIdx - 1 + this.total) % this.total;
      this.container.style.transform = `translate3d(0,-${
        this.curIdx * this.container.clientHeight
      }px,0)`;
      this.container.style.transition = `all ease 600ms`;
    }
  }

  // move down on slide
  scrollDown(): void {
    console.log('move down');
    this.scroll(true);
  }

  // move up one slide
  scrollUp(): void {
    console.log('move up');
    this.scroll(false);
  }

  // move to index-th slide
  moveToSlide(index: number): void {}
}

export default PageScroll;
