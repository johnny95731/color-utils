import { isSameColor } from './helpers.js';

/**
 * Test whether colors `rgb` and `toRgb(fromRgb(rgb))` are same for every `rgb`
 * in `sample`
 * @param {CallableFunction} fromRgb
 * @param {CallableFunction} toRgb
 * @param {import('./sample.js').Sample | number[][]} sample
 * @param {number} atol  Default: `1e-3`. The absolute tolerance.
 */
export const stabilityTest = (
  fromRgb,
  toRgb,
  sample,
  atol
) => {
  const rgbs = sample.rgbs ?? sample;
  console.log('Stability test start.');
  for (const rgb of rgbs) {
    const remappedRgb = toRgb(fromRgb(rgb));
    if (!isSameColor(rgb, remappedRgb, atol)) {
      console.error(rgb, '=>', remappedRgb);
      break;
    }
  }
  console.log('Done.\n');
};

/**
 * Test two transformations are equivalent or not.
 *
 * @param {CallableFunction | [string, CallableFunction]} fn1
 * @param {CallableFunction | [string, CallableFunction]} fn2
 * @param {number[][] | Iterable<number[]>} sample
 * @param {CallableFunction} compFn Compare two values are equal or not.
 */
export const equivalenceTest = (
  fn1,
  fn2,
  sample,
  compFn = isSameColor
) => {
  // Test function name
  let name1 = fn1.name;
  let name2 = fn2.name;
  if (Array.isArray(fn1)) {
    name1 = fn1[0];
    fn1 = fn1[1];
  }
  if (Array.isArray(fn2)) {
    name2 = fn2[0];
    fn2 = fn2[1];
  }

  console.log(`Equivalence test start: ${name1} and ${name2}`);
  for (const color of sample) {
    const r1 = fn1(color);
    const r2 = fn2(color);
    if (!compFn(r1, r2)) {
      console.error(color, '=>', r1, r2);
      break;
    }
  }
  console.log('Done.\n');
};


/**
 * Check whether the output of a transformation has no `NaN`.
 * @param {CallableFunction} fn
 * @param {CallableFunction} fn2
 * @param {number[][] | Iterable<number[]>} sample
 */
export const validityTest = (
  fn,
  sample
) => {
  console.log('Validity test start.');
  for (const color of sample) {
    const result = fn(color);
    for (const val of result) {
      if (isNaN(val)) {
        console.error(color, '=>', result);
        break;
      }
    }
  }
  console.log('Done.\n');
};
