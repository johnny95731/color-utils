import { performanceTest } from '../utilsForTest/perf.js';
import { SampleGenerator } from '../utilsForTest/sample.js';
import { distE00, distE76, distE94, rgb2lab, sortColors, SORTING_ACTIONS } from '../../dist/colors.mjs';

const { rgbs, length } = SampleGenerator.defaults;


function distFn() {
  const labs = rgbs.map(rgb => rgb2lab(rgb));
  const e76 = () => {
    for (let i = 1; i < length; i++) {
      distE76(labs[i-1], labs[i]);
    }
  };
  const e94 = () => {
    for (let i = 1; i < length; i++) {
      distE94(labs[i-1], labs[i]);
    }
  };
  const e00 = () => {
    for (let i = 1; i < length; i++) {
      distE00(labs[i-1], labs[i]);
    }
  };
  return performanceTest(
    'CIE dist function',
    [e76, e94, e00]
  );
}

function overall() {
  const fns = [];
  SORTING_ACTIONS.slice(5).forEach(name => {
    fns.push([
      name,
      function(){
        for (let i = 5; i < length; i++) {
          sortColors(rgbs.slice(i-5, i), name, (color) => color);
        }
      }
    ]);
  });

  return performanceTest(
    'Sort test',
    fns
  );
}


const fns = [
  distFn,
  overall,
];
for (const fn of fns) {
  await fn();
}
