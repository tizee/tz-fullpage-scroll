export function linear(time: number): number {
  return time;
}

export function easeInQuad(time: number): number {
  return time * time;
}

export function easeOutQuad(time: number): number {
  return 1 - (time - 1) * (time - 1);
}

export function easeInOutQuad(time: number): number {
  return time < 0.5 ? 2 * time * time : 1 - 2 * (time - 1);
}
