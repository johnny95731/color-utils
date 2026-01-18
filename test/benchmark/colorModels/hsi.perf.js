import { rgb2hsi, hsi2rgb } from '../../../dist/index.js';
import { performanceTest } from '../../../test-utils/perf.js';
import { SampleGenerator } from '../../../test-utils/sample.js';


const { rgbs, length } = SampleGenerator.defaults;


function toHsi() {
  const custom_ = () => {
    for (let i = 0; i < length; i++) {
      rgb2hsi(rgbs[i]);
    }
  };
  return performanceTest(
    'RGB to HSI',
    [
      ['color-utils', custom_],
    ],
  );
}

function fromHsi() {
  const tempArr = [];
  for (let i = 0; i < length; i++) {
    tempArr.push(rgb2hsi(rgbs[i]));
  }

  const custom_ = () => {
    for (let i = 0; i < length; i++) {
      hsi2rgb(tempArr[i]);
    }
  };

  return performanceTest(
    'HSI to RGB',
    [
      ['color-utils', custom_],
    ],
  );
}

const fns = [
  toHsi,
  fromHsi,
];
for (const fn of fns) {
  await fn();
}
