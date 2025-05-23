/**
 * Test the euivalence between different formula.
 */

import { equivalenceTest } from '../../../test-utils/color-test.js';
import { range } from '../../../test-utils/helpers.js';


// /** @type {Iterable<number[]>} */
const cmykIterator = {
  [Symbol.iterator]: () => {
    const values = range(0, 100);
    const lastIdx = values.length - 1;
    let cIdx = 0, mIdx = 0, yIdx = 0, kIdx = 0;

    return {
      /** @return {{value?: number[] , done: boolean}} */
      next() {
        if (kIdx > lastIdx) return kIdx = 0, yIdx+=2, this.next();
        if (yIdx > lastIdx) return yIdx = 0, mIdx+=2, this.next();
        if (mIdx > lastIdx) return mIdx = 0, cIdx+=2, this.next();
        if (cIdx > lastIdx) return { done: true };
        const c = values[cIdx];
        const m = values[mIdx];
        const y = values[yIdx];
        const k = values[kIdx];
        kIdx += 2;
        return { value: [c, m, y, k], done: false };
      }

    };
  }
};

const toRgb1 = (cmyk) => {
  const c = cmyk[0] / 100;
  const m = cmyk[1] / 100;
  const y = cmyk[2] / 100;
  const k = cmyk[3] / 100;

  return [
    255 * (1 - Math.min(1, c * (1 - k) + k)),
    255 * (1 - Math.min(1, m * (1 - k) + k)),
    255 * (1 - Math.min(1, y * (1 - k) + k)),
  ];
};

const toRgb2 = (cmyk) => {
  const c = cmyk[0] / 100;
  const m = cmyk[1] / 100;
  const y = cmyk[2] / 100;
  const k = cmyk[3] / 100;

  return [
    255 * (1 - c) * (1 - k),
    255 * (1 - m) * (1 - k),
    255 * (1 - y) * (1 - k),
  ];
};

const toRgb3 = (cmyk) => {
  // CMYK => CMY => RGB
  const k = cmyk[3] / 100;
  let c = cmyk[0] / 100 + k;
  let m = cmyk[1] / 100 + k;
  let y = cmyk[2] / 100 + k;

  return [
    255 * (1 - Math.min(1, c)),
    255 * (1 - Math.min(1, m)),
    255 * (1 - Math.min(1, y)),
  ];
};



console.log('CMYK equivalence between different formula.');
equivalenceTest(
  toRgb1,
  toRgb2,
  cmykIterator
);

equivalenceTest(
  toRgb1,
  toRgb3,
  cmykIterator
);
