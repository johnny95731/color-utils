import { performanceTest } from '../utilsForTest/perf.js';
import { SampleGenerator } from '../utilsForTest/sample.js';
import { rgb2lchuv, lchuv2rgb, rgb2luv, luv2rgb } from '../../dist/index.js';


const { rgbs, length } = SampleGenerator.defaults;

function toLuv() {
  const custom_ = () => {
    for (let i = 0; i < length; i++) {
      rgb2luv(rgbs[i]);
    }
  };
  return performanceTest(
    'RGB to Luv',
    [custom_]
  );
}

function fromLuv() {
  const tempCustom = [];
  for (let i = 0; i < length; i++) {
    tempCustom.push(rgb2luv(rgbs[i]));
  }

  const custom_ = () => {
    for (let i = 0; i < length; i++) {
      luv2rgb(tempCustom[i]);
    }
  };
  return performanceTest(
    'Luv to RGB',
    [custom_]
  );
}

function toLchuv() {
  const custom_ = () => {
    for (let i = 0; i < length; i++) {
      rgb2lchuv(rgbs[i]);
    }
  };
  return performanceTest(
    'RGB to LCH(uv)',
    [custom_]
  );
}

function fromLchuv() {
  const tempCustom = [];
  for (let i = 0; i < length; i++) {
    tempCustom.push(rgb2lchuv(rgbs[i]));
  }

  const custom_ = () => {
    for (let i = 0; i < length; i++) {
      lchuv2rgb(tempCustom[i]);
    }
  };
  return performanceTest(
    'LCH(uv) to RGB',
    [custom_]
  );
}


const fns = [
  toLuv,
  fromLuv,
  toLchuv,
  fromLchuv,
];
for (const fn of fns) {
  await fn();
}
