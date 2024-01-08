export const isFiniteNumber = (i: unknown) => {
  //値がNumber型かつ有限数である場合のみtrue
  return Number.isFinite(i);
};

export const clamp = (min: number, val: number, max: number) => {
  return Math.min(Math.max(min, val), max);
};
