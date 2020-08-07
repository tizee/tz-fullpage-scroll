export function linear(time: number): number {
  return time;
}

export function easeInQuad(time: number): number {
  return time * time;
}

export function easeOutQuad(time: number): number {
  return 1 - (time - 1) * (time - 1);
}
