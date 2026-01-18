import { diff } from 'color-diff';

import {
  distE00, distE76, distE94, rgb2lab, sortColors, SORTING_ACTIONS,
} from '../../../dist/index.js';
import { performanceTest } from '../../../test-utils/perf.js';
import { SampleGenerator } from '../../../test-utils/sample.js';


const { rgbs, length } = SampleGenerator.defaults;


function distFn() {
  const labs = rgbs.map(rgb => rgb2lab(rgb));
  const labObj = labs.map(([l, a, b]) => ({ L: l, a, b }));
  const e76 = () => {
    for (let i = 1; i < length; i++) {
      distE76(labs[i - 1], labs[i]);
    }
  };
  const e94 = () => {
    for (let i = 1; i < length; i++) {
      distE94(labs[i - 1], labs[i]);
    }
  };
  const e00 = () => {
    for (let i = 1; i < length; i++) {
      distE00(labs[i - 1], labs[i]);
    }
  };
  const colorDiff = () => {
    for (let i = 1; i < length; i++) {
      diff(labObj[i - 1], labObj[i]);
    }
  };
  return performanceTest(
    'CIE dist function',
    [
      e76,
      e94,
      e00,
      colorDiff,
    ],
  );
}

function overall() {
  const fns = [];
  SORTING_ACTIONS.forEach((name) => {
    fns.push([
      name,
      function () {
        sortColors(rgbs, name, color => color);
      },
    ]);
  });

  return performanceTest(
    'Sort test',
    fns,
  );
}


const fns = [
  distFn,
  overall,
];
for (const fn of fns) {
  await fn();
}
