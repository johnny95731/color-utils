import convert from 'color-convert';
import { colord, extend } from 'colord';
import hwbPlugin from 'colord/plugins/hwb';

import { rgb2hwb, hwb2rgb } from '../../../dist/index.js';
import { performanceTest } from '../../../test-utils/perf.js';
import { SampleGenerator } from '../../../test-utils/sample.js';


extend([hwbPlugin]);

const { rgbs, colors, colords, length } = SampleGenerator.defaults;


function toHwb() {
  const colord_ = () => {
    for (let i = 0; i < length; i++) {
      colords[i].toHwb();
    }
  };
  const color_ = () => {
    for (let i = 0; i < length; i++) {
      colors[i].hwb();
    }
  };
  const fn = convert.rgb.hwb.raw;
  const convert_ = () => {
    for (let i = 0; i < length; i++) {
      fn(rgbs[i]);
    }
  };
  const custom_ = () => {
    for (let i = 0; i < length; i++) {
      rgb2hwb(rgbs[i]);
    }
  };
  return performanceTest(
    'RGB to HWB',
    [
      ['color-utils', custom_],
      ['colord', colord_],
      ['color', color_],
      ['color-convert', convert_],
    ],
  );
}

function fromHwb() {
  const tempColord = [];
  const tempColor = [];
  const tempArr = [];
  for (let i = 0; i < length; i++) {
    tempColord.push(colords[i].toHwb());
    tempColor.push(colors[i].hwb());
    tempArr.push(rgb2hwb(rgbs[i]));
  }

  const colord_ = () => {
    for (let i = 0; i < length; i++) {
      colord(tempColord[i]);
    }
  };
  const color_ = () => {
    for (let i = 0; i < length; i++) {
      tempColor[i].rgb();
    }
  };
  const fn = convert.hwb.rgb.raw;
  const convert_ = () => {
    for (let i = 0; i < length; i++) {
      fn(tempArr[i]);
    }
  };
  const custom_ = () => {
    for (let i = 0; i < length; i++) {
      hwb2rgb(tempArr[i]);
    }
  };

  return performanceTest(
    'HWB to RGB',
    [
      ['color-utils', custom_],
      ['colord', colord_],
      ['color', color_],
      ['color-convert', convert_],
    ],
  );
}


const fns = [
  toHwb,
  fromHwb,
];
for (const fn of fns) {
  await fn();
}
