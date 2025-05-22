import { cloneDeep, map, type DeepWriteable } from '../helpers';
import { deg2rad, squareSum4, randInt, pow, rad2deg, l2Dist3, l2Norm3 } from '../numeric';
import { rgb2gray } from '../colors';
import { rgb2lab } from '../colorModels/cielab';


// # Constants
/**
 * Actions for sorting palette colors.
 */
export const SORTING_ACTIONS = [
  'luminance', 'random', 'reversion', 'CIE76', 'CIE94', 'CIEDE2000'
] as const;
export type Sort = typeof SORTING_ACTIONS[number];

type SortOp = (rgb1: readonly number[], rgb2: readonly number[]) => number

type CIEDifferenceFn = (lab1: readonly number[], lab2: readonly number[]) => number

// # Distance functions.
/**
 * Luminance difference of first and second colors.
 * @param rgb1 First RGB color.
 * @param rgb2 Second RGB color.
 */
export const diffLuminance: SortOp = (
  rgb1: readonly number[],
  rgb2: readonly number[]
) => {
  return rgb2gray(rgb1) - rgb2gray(rgb2);
};

/**
 * Color difference of two LAB colors with CIE 1976 formula.
 */
export const distE76: CIEDifferenceFn = (lab1: readonly number[], lab2: readonly number[]) => {
  return l2Dist3(lab1, lab2);
};

/**
 * Color difference of two CIELAB colors with CIE 1994 formula.
 * Note that CIE 1976 formula is "not" symmetry, that is, `diffE94(hex1, hex2)`
 * and `diffE94(hex2, hex1)` may be different.
 * @param lab1 CIELAB color 1
 * @param lab2 CIELAB color 2
 * @returns
 */
export const distE94: CIEDifferenceFn = (lab1: readonly number[], lab2: readonly number[]) => {
  const l1 = lab1[0];
  const a1 = lab1[1];
  const b1 = lab1[2];
  const l2 = lab2[0];
  const a2 = lab2[1];
  const b2 = lab2[2];

  const c1Star = l2Norm3(a1, b1);
  const c2Star = l2Norm3(a2, b2);
  const deltaA = a1 - a2;
  const deltaB = b1 - b2;

  const deltaL = l1 - l2;
  const deltaC = c1Star - c2Star;
  // May be NaN. Due to floating problem.
  const deltaH = Math.sqrt(deltaA*deltaA + deltaB*deltaB - deltaC*deltaC) || 0;

  return squareSum4(
    deltaL,
    deltaC / (1 + 0.045 * c1Star),
    deltaH / (1 + 0.015 * c1Star)
  );
};

/**
 * Color difference of two CIELAB colors with CIEDE2000 formula.
 * @param lab1 CIELAB color 1
 * @param lab2 CIELAB color 2
 */
export const distE00: CIEDifferenceFn = (() => {
  const f7 = (val: number) => (val = pow(val, 7), Math.sqrt(val / (val + pow(25, 7))));
  const cos = (deg: number) => Math.cos(deg2rad(deg));
  const sin = (deg: number) => Math.sin(deg2rad(deg));
  // cos(3*H) = 4*cos(H)**3 - 3*cos(H)
  const cos3H = (cosH: number) => 4*cosH*cosH*cosH - 3*cosH;

  const cos30 = cos(30);
  const sin30 = sin(30);
  const cos6 = cos(6);
  const sin6 = sin(6);
  const cos63 = cos(63);
  const sin63 = sin(63);

  return (lab1: readonly number[], lab2: readonly number[]) => {
    let temp: number;

    const l1 = lab1[0];
    const a1 = lab1[1];
    const b1 = lab1[2];
    const l2 = lab2[0];
    const a2 = lab2[1];
    const b2 = lab2[2];

    const cMean = (l2Norm3(a1, b1) + l2Norm3(a2, b2)) / 2;
    const aconst = 1 - f7(cMean);
    // 'P' for prime.
    const a1P = a1 + a1 / 2 * aconst;
    const a2P = a2 + a2 / 2 * aconst;

    const c1P = l2Norm3(a1P, b1);
    const c2P = l2Norm3(a2P, b2);
    const h1P = (rad2deg(Math.atan2(b1, a1P)) + 360) % 360;
    const h2P = (rad2deg(Math.atan2(b2, a2P)) + 360) % 360;

    const hDist = Math.abs(h1P - h2P);

    const hasGray = !c1P || !c2P;

    // // Original formula has 2 conditions to decide to rotate +360 deg or -360 deg.
    // // But +360 deg and -360 deg are the same for `sin(hP / 2)`.
    const hP = hasGray ? 0 : (h2P - h1P + (hDist > 180 ? 360 : 0));

    let hMeanP = (h1P + h2P) / 2;
    hMeanP += (
      hasGray ? hMeanP :
        hDist <= 180 ? 0 :
          hMeanP < 180 ? 180 : -180
    );

    // # Coefficients
    const cosH = cos(hMeanP);
    const sinH = sin(hMeanP);
    const cos2H = 2 * cosH * cosH - 1;
    const sin2H = 2*sinH*cosH;
    const T = 1
      - 0.17 * (cosH * cos30 + sinH * sin30)
      + 0.24 * cos2H
      + 0.32 * (cos3H(cosH) * cos6 + cos3H(sinH) * sin6)
      - 0.2  * ((2*cos2H*cos2H - 1)*cos63 + 2*sin2H*cos2H*sin63);
    // Original formula:
    // const T = 1
    //   - 0.17 * cos(    hMeanP - 30)
    //   + 0.24 * cos(2 * hMeanP)
    //   + 0.32 * cos(3 * hMeanP + 6)
    //   - 0.2  * cos(4 * hMeanP - 63);
    const cMeanP = (c1P + c2P) / 2;
    const SH = 1 + 0.015 * cMeanP * T;
    const SC = 1 + 0.045 * cMeanP;

    // const lMeanM50 = ((l1 + l2) / 2 - 50)**2;
    const lMeanM50 = (temp = (l1 + l2) / 2 - 50, temp * temp);
    const SL = 1 + 0.015 * lMeanM50 / Math.sqrt(20 + lMeanM50);
    const RT = 2 * f7(cMeanP) *
      sin(60 / Math.exp((temp = hMeanP/25 - 11, temp*temp)));

    // # Delta L
    const deltaLTerm = (l2 - l1) / SL;
    // # Delta C
    const deltaCTerm = (c2P - c1P) / SC;
    // # Delta H
    const deltaHTerm = 2 * Math.sqrt(c1P * c2P) * sin(hP / 2) / SH;
    return (
      squareSum4(deltaLTerm, deltaCTerm, deltaHTerm)
      - RT * deltaCTerm * deltaHTerm
    );
  };
})();


// Sorting
/**
 * In-place shuffle an array by Fisher-Yates shuffle.
 * @param arr The array to be shuffled.
 */
export const shuffle = <T>(
  arr: T[],
): T[] | DeepWriteable<T[]> => {
  let j: number;
  for (let i = arr.length - 1; i > 0; i--) {
    j = randInt(i);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

type tspGreedy = {
  <T>(
    arr: readonly T[],
    rgbGetter: (color: T | DeepWriteable<T>) => number[],
    diffOp: CIEDifferenceFn,
    copy: true
  ): DeepWriteable<T[]>
  <T>(
    arr: T[],
    rgbGetter: (color: T | DeepWriteable<T>) => number[],
    diffOp: CIEDifferenceFn,
    copy?: false,
  ): T[]
}
/**
 * Travelling salesman problem by greedy algorithm.
 * The first point is fixed.
 * @param items Array of points.
 * @param diffOp Distance function.
 */
export const tspGreedy: tspGreedy = <T>(
  items: T[] | readonly T[],
  rgbGetter: (color: T | DeepWriteable<T>) => number[],
  diffOp: CIEDifferenceFn,
  copy: boolean = false,
): T[] | DeepWriteable<T[]> => {
  const result: T[] = [];
  // remaining indices
  const indices = map(items, (_, i) => i);
  const labs = map(items, (item) => rgb2lab(rgbGetter(item)));

  let pivot: number[] = labs[0];
  let temp: number;
  let min: number;
  let minIdx: number;
  while (indices.length) {
    min = Infinity;
    minIdx = 0;
    for (let k = 0; k < indices.length; k++) {
      temp = diffOp(pivot, labs[indices[k]]);
      if (temp < min) {
        min = temp;
        minIdx = k;
      }
    }
    pivot = labs[indices[minIdx]];
    result.push(items[indices[minIdx]]);
    indices.splice(minIdx, 1);
  }
  return copy ? cloneDeep(result) : result;
};


/**
 * Sort array of colors.
 * @param colors Colors to be sorted. Can be array of colors or object with
 * some key to get RGB.
 * @param method Sort method.
 * @param rgbGetter To get RGB from input color.
 */
export const sortColors = <T>(
  colors: readonly T[],
  method: Sort | number,
  rgbGetter: (color: T | DeepWriteable<T>) => number[],
): DeepWriteable<T[]> => {
  if (typeof method === 'number') method = SORTING_ACTIONS[method];

  let result = cloneDeep(colors);
  let op: undefined | CIEDifferenceFn;

  if (method === SORTING_ACTIONS[0])
    result = result.sort((a, b) => diffLuminance(rgbGetter(a), rgbGetter(b)));
  else if (method === SORTING_ACTIONS[1]) result = shuffle(result);
  else if (method === SORTING_ACTIONS[2]) result.reverse();
  else if (method === SORTING_ACTIONS[3]) op = distE76;
  else if (method === SORTING_ACTIONS[4]) op = distE94;
  else op = distE00;

  if (op) {
    result = tspGreedy<T>(
      result as T[],
      rgbGetter,
      op,
    );
  }
  return result;
};


/**
 * Sort array of RGB colors.
 * @param rgbs Sort RGB colors.
 * @param method Sort method.
 */
export const sortRgbs = (
  rgbs: readonly number[][],
  method: Sort | number,
): number[][] => {
  return sortColors(rgbs, method, (rgb: number[]) => rgb);
};
