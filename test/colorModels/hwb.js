import { colord, extend } from 'colord';
import hwbPlugin from 'colord/plugins/hwb';
import convert from 'color-convert';

import { performanceTest } from '../utilsForTest/perf.js';
import { SampleGenerator } from '../utilsForTest/sample.js';
import { rgb2hwb, hwb2rgb } from '../../dist/colors.mjs';

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
  const convert_ = () => {
    for (let i = 0; i < length; i++) {
      convert.rgb.hwb.raw(rgbs[i]);
    }
  };
  const custom_ = () => {
    for (let i = 0; i < length; i++) {
      rgb2hwb(rgbs[i]);
    }
  };
  return performanceTest(
    'RGB to HWB',
    [colord_, color_, convert_, custom_]
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
  const convert_ = () => {
    for (let i = 0; i < length; i++) {
      convert.hwb.rgb.raw(tempArr[i]);
    }
  };
  const custom_ = () => {
    for (let i = 0; i < length; i++) {
      hwb2rgb(tempArr[i]);
    }
  };

  return performanceTest(
    'HWB to RGB',
    [colord_, color_, convert_, custom_]
  );
}


const fns = [
  toHwb,
  fromHwb,
];
for (const fn of fns) {
  await fn();
}
