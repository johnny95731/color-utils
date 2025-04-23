import { map } from './helpers';

/**
 * The modulo function. Equivalent to
 *   `let a = n % m;
 *    if (a < 0) a += m;`
 * @param {Number} n Dividend.
 * @param {Number} m Divisor.
 * @return {Number} Signed remainder.
 */
export const mod = (n: number, m: number): number => {
  return ((n % m) + m) % m;
};

/**
 * An alias of x**y. About 25%~30% faster than x**y = Nath.pow(x,y).
 */
export const pow = (x: number, y: number) => {
  if (!x && !y) return 1;
  return Math.exp(y * Math.log(x));
};

/**
 * Generate a random (positive) integer between [0,max].
 */
export const randInt = (max: number) => {
  return Math.random() * (max + 1) | 0;
};

/**
 * Rounding a number to specifit place value.
 * @param num A number.
 * @param place Default: `0`. Rounding to specific place value. Positive means decimal places
 * and negative means whole number places.
 * @return Percentage number.
 */
export const round = (num: number, place: number = 0): number =>
  Math.round(pow(10, place) * num) / pow(10, place);

/**
 * Convert a number `num` to percentage form, that is, `num * 100%`.
 * @param num A number.
 * @param place Rounding to specific place value. Positive means decimal places
 * and negative means whole number places.
 * @return Percentage number.
 */
export const toPercentage = (num: number, place: number = 0): number => {
  return round(100 * num, place);
};

/**
 * Fraction to percentage.
 * Return round(100 * idx / num, 2)%
 * @param num Numerator.
 * @param denom Denominator.
 * @returns
 */
export const frac2percentage = (num: number, denom: number): string => {
  return round(100 * num / denom, 2) + '%';
};


/**
 * Clip the number in the range [`min`, `max`].
 * @param num Number to clip.
 * @param min Minimum value.
 * @param max Maximum value.
 * @returns Clipped number.
 */
export const clip = (num: number, min: number, max: number): number => {
  return Math.min(Math.max(num, +min!), +max!);
};

/**
 * Linear mapping a number from a range to another range.
 * @param val The value that be transform.
 * @param min Minimum of original range.
 * @param max Maximum of original range.
 * @param newMin Minimum of new range.
 * @param newMax Maximum of new range.
 * @param place Rounding to specific place value. Positive means decimal places
 * and negative means whole number places.
 */
export const rangeMapping = (
  val: number,
  min: number,
  max: number,
  newMin: number,
  newMax: number,
  place?: number,
) => {
  const ratio = clip((val - min) / (max - min), 0, 1); // avoid floating problem.
  const newVal = newMin + ratio * (newMax - newMin);
  return place == null ? newVal : round(newVal, place);
};

export const [deg2rad, rad2deg] = (() => {
  const factor = Math.PI / 180;
  /** Degree to radian. */
  const deg2rad = (deg: number) => {
    return deg * factor;
  };
  /** Radian to degree. */
  const rad2deg = (rad: number) => {
    return rad / factor;
  };
  return [deg2rad, rad2deg];
})();

/**
 * Dot product of two arrays with lenght=3.
 */
export const dot3 = (arr1: readonly number[], arr2: readonly number[]): number => {
  return arr1[0] * arr2[0] + arr1[1] * arr2[1] + arr1[2] * arr2[2];
};

/**
 * Return the summation of square of numbers.
 */
export const squareSum = (a: number, b: number, c: number = 0, d: number = 0): number => {
  return a * a + b * b + c * c + d * d;
};
export const l2Norm = (a: number, b: number) => Math.sqrt(squareSum(a, b));

/**
 * Square of L2-distance (not take square root yet) of two array.
 * This function is present for comparing.
 * @param color1 Array with length = 3.
 * @param color2 Array with length = 3.
 * @returns The mean value of arr1 and arr2.
 */
export const l2Dist = (color1: readonly number[], color2: readonly number[]): number => {
  return Math.sqrt(squareSum(
    color1[0] - color2[0],
    color1[1] - color2[1],
    color1[2] - color2[2]
  ));
};

/**
 * Evaluates elementwise mean of two arrays, that is, returns an array that
 * each value is the mean of input arrays at same index.
 * @param arr1 Array 1.
 * @param arr2 Array 2.
 * @returns The mean value of arr1 and arr2.
 */
export const elementwiseMean = (arr1: readonly number[], arr2: readonly number[]): number[] => {
  return map(
    Math.min(arr1.length, arr2.length),
    (_, i) => (arr1[i] + arr2[i]) / 2,
  );
};
