import { colord, extend } from 'colord';
import cmykPlugin from 'colord/plugins/cmyk';
import convert from 'color-convert';

import { performanceTest } from '../utilsForTest/perf.js';
import { SampleGenerator } from '../utilsForTest/sample.js';
import { rgb2cmyk, cmyk2rgb } from '../../dist/index.js';

extend([cmykPlugin]);


const { rgbs, colors, colords, length } = SampleGenerator.defaults;

function toCmyk() {
  const colord_ = () => {
    for (let i = 0; i < length; i++) {
      colords[i].toCmyk();
    }
  };
  const color_ = () => {
    for (let i = 0; i < length; i++) {
      colors[i].cmyk();
    }
  };
  const convert_ = () => {
    for (let i = 0; i < length; i++) {
      convert.rgb.cmyk.raw(rgbs[i]);
    }
  };
  const custom_ = () => {
    for (let i = 0; i < length; i++) {
      rgb2cmyk(rgbs[i]);
    }
  };
  return performanceTest(
    'RGB to CMYK',
    [colord_, color_, convert_, custom_]
  );
}
function fromCmyk() {
  const tempColord = [];
  const tempColor = [];
  const tempArr = [];
  for (let i = 0; i < length; i++) {
    tempColord.push(colords[i].toCmyk());
    tempColor.push(colors[i].cmyk());
    tempArr.push(rgb2cmyk(rgbs[i]));
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
      convert.cmyk.rgb.raw(tempArr[i]);
    }
  };
  const custom_ = () => {
    for (let i = 0; i < length; i++) {
      cmyk2rgb(tempArr[i]);
    }
  };
  return performanceTest(
    'CMYK to RGB',
    [colord_, color_, convert_, custom_]
  );
}

const fns = [
  toCmyk,
  fromCmyk,
];
for (const fn of fns) {
  await fn();
}
