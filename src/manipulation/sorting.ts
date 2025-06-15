import { cloneDeep, map, normalizeOption, type DeepWriteable } from '../helpers';
import { squareSum4, randInt, pow, l2Dist3, l2Norm3, deg2rad, rad2deg } from '../numeric';
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
 * @see https://en.wikipedia.org/wiki/Color_difference
 */
export const distE76: CIEDifferenceFn = (lab1: readonly number[], lab2: readonly number[]) => {
  return l2Dist3(lab1, lab2);
};

/**
 * Color difference of two CIELAB colors with CIE 1994 formula.
 * @param lab1 CIELAB color 1
 * @param lab2 CIELAB color 2
 * @returns
 * @see https://en.wikipedia.org/wiki/Color_difference
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

  return l2Norm3(
    deltaL,
    deltaC / (1 + 0.045 * c1Star),
    deltaH / (1 + 0.015 * c1Star)
  );
};

/**
 * Color difference of two CIELAB colors with CIEDE2000 formula.
 * @param lab1 CIELAB color 1
 * @param lab2 CIELAB color 2
 * @see https://en.wikipedia.org/wiki/Color_difference
 */
export const distE00: CIEDifferenceFn = (() => {
  const cos6 = Math.cos(deg2rad(6));
  const sin6 = Math.sin(deg2rad(6));
  const cos30 = Math.cos(deg2rad(30));
  const cos63 = Math.cos(deg2rad(63));
  const sin63 = Math.sin(deg2rad(63));

  return (lab1: readonly number[], lab2: readonly number[]) => {
    // const [l1, a1, b1] = lab1;
    // const [l2, a2, b2] = lab2;
    const l1 = lab1[0];
    const a1 = lab1[1];
    const b1 = lab1[2];
    const l2 = lab2[0];
    const a2 = lab2[1];
    const b2 = lab2[2];
    const c1 = l2Norm3(a1, b1);
    const c2 = l2Norm3(a2, b2);
    const cMean7 = pow((c1 + c2) / 2, 7);
    // XXX: Reduce formulas to
    // `const aconst = 1.5 - Math.sqrt(omit) / 2;`
    // `const a1P = a1 * aconst;`
    // may make result ±0.5 for some lab1 = [l1, a1, a2], lab2 = [l2, -a1, -b1].
    // Because a small accurate issue (<=1e-14) of `h1P` and `h2P` such that
    // `Math.abs(h2P - h1P) > 180` to be true or false.
    // Currently, the result is more closer to Bruce Lindbloom's Web Site.
    const aconst = (1 - Math.sqrt(cMean7 / (cMean7 + 6103515625))) / 2;
    // 'P' for prime.

    // Compute C' and h'
    const a1P = a1 * (1 + aconst);
    const a2P = a2 * (1 + aconst);

    const c1P = l2Norm3(a1P, b1);
    const c2P = l2Norm3(a2P, b2);
    // Floating issue.
    let h1P = rad2deg(Math.atan2(b1, a1P));
    let h2P = rad2deg(Math.atan2(b2, a2P));
    if (h1P < 0) h1P += 360;
    if (h2P < 0) h2P += 360;
    let hP = h2P - h1P;
    let hMeanP = (h1P + h2P) / 2;
    if (c1P * c2P === 0) {
      hP = 0;
      hMeanP *= 2;
    } else if (hP > 180 || hP < -180) {
      hP += 360;
      hMeanP += hMeanP < 180 ? 180 : -180;
    }

    // Original formula:
    // const T = 1
    //   - 0.17 * Math.cos(deg2rad(    hMeanP - 30))
    //   + 0.24 * Math.cos(deg2rad(2 * hMeanP))
    //   + 0.32 * Math.cos(deg2rad(3 * hMeanP + 6))
    //   - 0.2  * Math.cos(deg2rad(4 * hMeanP - 63));
    // Transform by trigonometric identities:
    const cosH = Math.cos(deg2rad(hMeanP));
    const sinH = Math.sin(deg2rad(hMeanP));
    const cos2H = 2 * cosH * cosH - 1;
    // const T = 1 + 0.2 * cos63
    // - 0.17 * (cosH * cos30 + sinH / 2)
    // + 0.24 * cos2H
    // + 0.32 * ((4*cosH*cosH*cosH - 3*cosH) * cos6 + (4*sinH*sinH*sinH - 3*sinH) * sin6)
    // - 0.4  * cos2H * (cos2H * cos63 + sin2H * sin63);
    // Reduced:
    const T = 1 + 0.2 * cos63
      - 0.17 * (cosH * cos30 + sinH / 2)
      + 0.32 * ((4*cosH*cosH - 3) * cosH * cos6 + (4*sinH*sinH - 3) * sinH * sin6)
      + 0.4 * cos2H * (0.6 - cos2H * cos63 - 2 * cosH * sinH * sin63);

    const lMeanP2 = ((l1 + l2) / 2 - 50)**2;
    const cMeanP = (c1P + c2P) / 2;
    const cMeanP7 = pow(cMeanP, 7);

    const SL = 1 + 0.015 * lMeanP2 / Math.sqrt(20 + lMeanP2);
    const SC = 1 + 0.045 * cMeanP;
    const SH = 1 + 0.015 * cMeanP * T;
    const RT = (
      2 * Math.sqrt(cMeanP7 / (cMeanP7 + 6103515625))
      * Math.sin(deg2rad(60 / Math.exp((hMeanP/25 - 11)**2)))
    );

    // Final terms
    const deltaLTerm = (l2 - l1) / SL;
    const deltaCTerm = (c2P - c1P) / SC;
    const deltaHTerm = (
      2 * Math.sqrt(c1P * c2P) * Math.sin(deg2rad(hP / 2)) / SH
    );
    return Math.sqrt(
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
  const len = items.length;
  const labs = map(items, (item) => rgb2lab(rgbGetter(item)));

  // Ignore first index since first element is in the result.
  const indices = map(len - 1, i => i + 1);
  const result: T[] = [items[0]];

  let pivot: number[] = labs[0];
  let dist: number;
  let minDist: number;
  let minIdx: number;
  let targetIdx: number;
  // index of inner loop. For byte savings.
  let i = len - 1;
  let k: number;
  // First element is in result. Last element does not need to compare.
  // `i = len - 1` : Make `k < i` to reach every unselected indeces since
  //   `indices.length === len - 1`
  // `i > 1` : Pass last element.
  for (; i > 1;) {
    minDist = Infinity;
    minIdx = 0;
    for (k = 0; k < i; k++) {
      dist = diffOp(pivot, labs[indices[k]]);
      if (dist < minDist) {
        minDist = dist;
        minIdx = k;
      }
    }
    // Swap selected index to last position.
    targetIdx = indices[minIdx];
    indices[minIdx] = indices[--i];
    indices[i] = targetIdx;

    pivot = labs[targetIdx];
    result.push(items[targetIdx]);
  }
  result.push(items[indices[0]]);
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
  method = normalizeOption(method, SORTING_ACTIONS, 'CIEDE2000');

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
