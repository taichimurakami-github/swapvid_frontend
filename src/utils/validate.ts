export default class Validate {
  static isFiniteNumber(i: any) {
    //値がNumber型かつ有限数である場合のみtrue
    return Number.isFinite(i);
  }

  static clamp(min: number, val: number, max: number) {
    return Math.min(Math.max(min, val), max);
  }
}
