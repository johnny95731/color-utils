import { diff } from 'color-diff';

import { SampleGenerator } from '../../../test-utils/sample.js';
import { deg2rad, distE00, rgb2lab } from '../../../dist/index.js';
import { performanceTest } from '../../../test-utils/perf.js';

let { rgbs, length } = SampleGenerator.a(10);

const rgb2labObj = ([l,a,b]) => ({ L:l, a, b });
const labs = rgbs.map(rgb => rgb2lab(rgb));
const labObj = labs.map(rgb2labObj);

let max = -1;
let base = [];
for (let i = 0; i < length; i++) {
  for (let j = i+1; j < length; j++) {
    const e00 = distE00(labs[i], labs[j]);
    const e00Lib = diff(labObj[i], labObj[j]);
    const err = Math.abs(e00 - e00Lib);
    if (err > max) {
      max = err;
      base = [i, j];
    }
    if (err > 1e-7) {
      i = length;
      break;
    }
  }
}
let [i, j] = base;
console.log(max, labs[i], labs[j], distE00(labs[i], labs[j]), diff(labObj[i], labObj[j]));

const cos = (deg) => Math.cos(deg2rad(deg));
const sin = (deg) => Math.sin(deg2rad(deg));
const cos3H = (cosH) => 4*cosH*cosH*cosH - 3*cosH;

const cos30 = cos(30);
const cos30c = 0.17 * cos(30);
const sin30 = sin(30);
const sin30c = 0.17 * sin(30);
const cos6 = cos(6);
const cos6c1 = 1.28 * cos(6);
const cos6c2 = 0.96 * cos(6);
const sin6 = sin(6);
const sin6c = 1.28 * sin(6);
const cos63 = cos(63);
const cos63c1 = 1.6 * cos(63);
const cos63c2 = 0.48 + 1.6 * cos(63);
const sin63 = sin(63);
const sin63c = 0.8 * sin(63);

const bias = 1 - 0.24 + 0.2 * cos(63) - 0.4  * cos(63);
const s1 = 0.96 * sin(6) + sin30c;
const c1 = cos30c + cos6c2;

const fn1 = (hMeanP) => {
  return 1
    - 0.17 * Math.cos(deg2rad(    hMeanP - 30))
    + 0.24 * Math.cos(deg2rad(2 * hMeanP))
    + 0.32 * Math.cos(deg2rad(3 * hMeanP + 6))
    - 0.2  * Math.cos(deg2rad(4 * hMeanP - 63));
};

const fn2 = (hMeanP) => {
  const cosH = cos(hMeanP);
  const sinH = sin(hMeanP);
  const cos2H = 2 * cosH * cosH - 1;
  const sin2H = 2*sinH*cosH;
  return 1
    - 0.17 * (cosH * cos30 + sinH * sin30)
    + 0.24 * cos2H
    + 0.32 * (cos3H(cosH) * cos6 + cos3H(sinH) * sin6)
    - 0.2  * ((2*cos2H*cos2H - 1)*cos63 + 2*sin2H*cos2H*sin63);
};

const fn3 = (hMeanP) => {
  const rad = hMeanP * (Math.PI / 180); // 一次轉換
  const cosH = Math.cos(rad);
  const sinH = Math.sin(rad);
  const sinH63c = sinH * sin63c;
  const cosHH = cosH * cosH;
  return bias
    + cosH * (
      + cosHH * cos6c1
      + sinH63c
      - 2 * sinH63c * cosHH
      - c1
    )
    + cosHH * (cos63c2 - cosHH * cos63c1)
    + sinH * (sinH * sinH * sin6c - s1);
};

const formulaComparison = () => {
  let max = [-1, -1];
  for (let i = 0; i < 360; i++) {
    const diff = Math.abs(fn3(i) - fn1(i));
    if (diff > max[1]) {
      max[1] = diff;
      max[0] = i;
    }
  }
  console.log(max);
};

const fomulaPerformance = () => {
  const test1 = () => {
    for (let i = 0, j = 0; j < 10; i+=0.5) {
      if (i >= 360) {
        i = 0;
        j += 1;
      }
      fn1(i);
    }
  };
  const test2 = () => {
    for (let i = 0, j = 0; j < 10; i+=0.5) {
      if (i >= 360) {
        i = 0;
        j += 1;
      }
      fn2(i);
    }
  };
  const test3 = () => {
    for (let i = 0, j = 0; j < 10; i+=0.5) {
      if (i >= 360) {
        i = 0;
        j += 1;
      }
      fn3(i);
    }
  };

  performanceTest(
    'fn',
    [test1, test2, test3],
    { time: 500 }
  );
};

formulaComparison();
fomulaPerformance();
