import { map, type DeepReadonly } from './helpers';

/**
 * An alias of x**y. About 25%~30% faster than x**y = Math.pow(x,y) for non-integer `y`.
 */
export const pow = (x: number, y: number) => {
  if (!y) return 1;
  if (!x) return 0;
  return Math.exp(y * Math.log(x));
};

/**
 * Generate a random (positive) integer between [0, max].
 */
export const randInt = (max: number) => {
  return Math.random() * (max + 1) | 0;
};

/**
 * Rounding a number to specific place value.
 * @param num A number.
 * @param place Default: `0`. Rounding to specific place value. Positive means decimal places
 * and negative means whole number places.
 */
export const round = (num: number, place: number = 0): number =>
  Math.round(10 ** place * num) / 10 ** place;


/**
 * Limit the number in the interval [`min`, `max`].
 * @param num Number to clip.
 * @param min Minimum value.
 * @param max Maximum value.
 * @returns Clipped number.
 */
export const clip = (num: number, min?: number, max?: number): number => {
  // +undifined = NaN. The comparison always get false
  if (num < min!) return min!; // (max < min && val < min) returns min
  else if (num > max!) return max!;
  return num;
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
export const dot3 = (
  arr1: readonly number[],
  arr2: readonly number[],
): number => {
  return arr1[0] * arr2[0] + arr1[1] * arr2[1] + arr1[2] * arr2[2];
};

/**
 * Return the summation of square of numbers.
 */
export const squareSum4 = (
  a: number,
  b: number,
  c: number = 0,
  d: number = 0,
): number => {
  return a * a + b * b + c * c + d * d;
};
export const l2Norm3 = (
  a: number,
  b: number,
  c: number = 0,
) => Math.sqrt(squareSum4(a, b, c));

/**
 * L2-distance of two array.
 * @param color1 Array with length = 3.
 * @param color2 Array with length = 3.
 * @returns The mean value of arr1 and arr2.
 */
export const l2Dist3 = (
  color1: readonly number[],
  color2: readonly number[],
): number => {
  return l2Norm3(
    color1[0] - color2[0],
    color1[1] - color2[1],
    color1[2] - color2[2],
  );
};

/**
 * Evaluates elementwise mean of two arrays, that is, returns an array that
 * each value is the mean of input arrays at same index.
 * @param arr1 Array 1.
 * @param arr2 Array 2.
 * @returns The mean value of arr1 and arr2.
 */
export const elementwiseMean = (
  arr1: readonly number[],
  arr2: readonly number[],
): number[] => {
  return map(
    Math.min(arr1.length, arr2.length),
    i => (arr1[i] + arr2[i]) / 2,
  );
};

export type Array3<T = number> = [T, T, T];
export type Mat3x3<T = number> = Array3<Array3<T>>;

/**
 * @deprecated
 * Matrix-vector product.
 * Multiply a 3x3 matrix by a 3 vector
 */
export const matVecProduct3 = <
  Mat extends number[][] | Mat3x3,
  Vec extends number[] | Array3,
>(mat: DeepReadonly<Mat>, vec: DeepReadonly<Vec>) => {
  return [
    dot3(mat[0], vec),
    dot3(mat[1], vec),
    dot3(mat[2], vec),
  ];
};
