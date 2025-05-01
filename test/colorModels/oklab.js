import { performanceTest } from '../utilsForTest/perf.js';
import { SampleGenerator } from '../utilsForTest/sample.js';
import { oklab2rgb, rgb2oklab, rgb2oklch } from '../../dist/index.js';


const { rgbs, length } = SampleGenerator.defaults;

function toOklab() {
  const custom_ = () => {
    for (let i = 0; i < length; i++) {
      rgb2oklab(rgbs[i]);
    }
  };
  return performanceTest(
    'RGB to Oklab',
    [
      ['color-utils',  custom_],
    ]
  );
}

function fromOklab() {
  const tempArr = [];
  for (let i = 0; i < length; i++) {
    tempArr.push(rgb2oklab(rgbs[i]));
  }

  const custom_ = () => {
    for (let i = 0; i < length; i++) {
      oklab2rgb(tempArr[i]);
    }
  };
  return performanceTest(
    'Oklab to RGB',
    [
      ['color-utils',  custom_],
    ]
  );
}

function toOklch() {
  const custom_ = () => {
    for (let i = 0; i < length; i++) {
      rgb2oklch(rgbs[i]);
    }
  };
  return performanceTest(
    'RGB to Oklab',
    [
      ['color-utils',  custom_],
    ]
  );
}

function fromOklch() {
  const tempArr = [];
  for (let i = 0; i < length; i++) {
    tempArr.push(rgb2oklab(rgbs[i]));
  }

  const custom_ = () => {
    for (let i = 0; i < length; i++) {
      oklab2rgb(tempArr[i]);
    }
  };
  return performanceTest(
    'Oklab to RGB',
    [
      ['color-utils',  custom_],
    ]
  );
}

const fns = [
  toOklab,
  fromOklab,
  toOklch,
  fromOklch,
];
for (const fn of fns) {
  await fn();
}
