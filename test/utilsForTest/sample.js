import { colord } from 'colord';
import Color from 'color';
import { randRgbGen, rgb2hex } from './helpers.js';


export class Sample {
  /**@type {number[][]} */
  rgbs;
  /**@type {string[]} */
  hex;
  /**@type {import('colord').Colord[]} */
  colords;
  /**@type {import('color').ColorInstance[]} */
  colors;
  /**@type {number} */
  length;

  /**
   * @param {number[][]} rgbs
   */
  constructor(rgbs) {
    this.length = rgbs.length;
    this.rgbs = rgbs;
    const hex = [];
    const colords = [];
    const colors = [];
    rgbs.forEach((rgb) => {
      const h = rgb2hex(rgb);
      hex.push(h);
      colords.push(colord(h));
      colors.push(Color(h));
    });
    this.hex = hex;
    this.colords = colords;
    this.colors = colors;
  }
}

/**
 * Color test sample generator.
 */
export const SampleGenerator = {
  /**
   * Latest sample.
   * @type {Sample | undefined} cacheA
   */
  cache: undefined,
  /**
   * @type {{step: number, sample: Sample} | undefined} cacheA
   */
  cacheA: undefined,
  /**
   * Generate evenly spaced values within [0, 255] (includes 0 and 255).
   * And create RGBs of all combinations of theese values.
   *
   * @param {number} step Default: `32`.
   */
  a(step = 32) {
    if (step < 1) step = 1;
    /**
     * @type {Sample}
     */
    let sample;
    if (this.cacheA?.step === step) {
      sample = this.cacheA.sample;
    } else {
      const rgbs = (() => {
        let i = 0;
        const rgbValues = [];
        while (i <= 255) {
          rgbValues.push(i);
          i += step;
        }
        if (!rgbValues.includes(255)) rgbValues.push(255);

        const rgbs = [];
        for (const r of rgbValues)
          for (const g of rgbValues)
            for (const b of rgbValues)
              rgbs.push([r, g, b]);
        return rgbs;
      })();
      sample = new Sample(rgbs);

      this.cacheA = {
        step,
        sample
      };
    }

    this.cache = this.cacheA.sample;
    return sample;
  },

  /**
   * Return RGBs with a given number of random RGB.
   * @returns {Sample}
   */
  b(num = 10) {
    const rgbs = (() => {
      const rgbs = [];
      while (rgbs.length < num) {
        rgbs.push(randRgbGen());
      }
      return rgbs;
    })();
    const sample = new Sample(rgbs);
    this.cache = sample;
    return sample;
  },
  /**
   * Return a random RGB.
   * @returns {Sample}
   */
  r() {
    const sample = new Sample([randRgbGen()]);
    this.cache = sample;
    return sample;
  },

  /** @returns {Sample} */
  get defaults() {
    if (this.cache) return this.cache;
    else return this.b();
  }
};

/**
 *
 * @param {number | number[]} max
 * @param {number} dim
 * @returns
 */
export const indexIterator = (max, dim = 1) => {
  const max_ = [];
  const indices = [];
  for (let i = 0; i < dim; i++) {
    if (typeof max === 'number') max_.push(max);
    else {
      max_.push(max[i] ?? max[max.length - 1]);
    };
    indices.push(0);
  }
  return {
    [Symbol.iterator]: () => {
      return {
        /** @return {{value?: number[] , done: boolean}} */
        next() {
          for (let i = indices.length - 1; i > 1; i--) {
            if (indices[i] > max_[i])
              return indices[i] = 0, indices[i-1]++, this.next();
          }
          if (indices[0] > max_[0]) return { done: true };

          const ret = [...indices];
          indices[dim - 1]++;
          return { value: ret, done: false };
        }
      };
    }
  };
};
