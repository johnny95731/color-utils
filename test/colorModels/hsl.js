import { colord } from 'colord';
import convert from 'color-convert';

import { performanceTest } from '../utilsForTest/perf.js';
import { SampleGenerator } from '../utilsForTest/sample.js';
import { rgb2hsl, hsl2rgb } from '../../dist/index.js';


const { rgbs, colors, colords, length } = SampleGenerator.defaults;


function toHsl() {
  const colord_ = () => {
    for (let i = 0; i < length; i++) {
      colords[i].toHsl();
    }
  };
  const color_ = () => {
    for (let i = 0; i < length; i++) {
      colors[i].hsl();
    }
  };
  const convert_ = () => {
    for (let i = 0; i < length; i++) {
      convert.rgb.hsl.raw(rgbs[i]);
    }
  };
  const custom_ = () => {
    for (let i = 0; i < length; i++) {
      rgb2hsl(rgbs[i]);
    }
  };
  return performanceTest(
    'RGB to HSL',
    [colord_, color_, convert_, custom_]
  );
}

function fromHsl() {
  const tempColord = [];
  const tempColor = [];
  const tempArr = [];
  for (let i = 0; i < length; i++) {
    tempColord.push(colords[i].toHsl());
    tempColor.push(colors[i].hsl());
    tempArr.push(rgb2hsl(rgbs[i]));
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
      convert.hsl.rgb.raw(tempArr[i]);
    }
  };
  const custom_ = () => {
    for (let i = 0; i < length; i++) {
      hsl2rgb(tempArr[i]);
    }
  };

  return performanceTest(
    'HSL to RGB',
    [colord_, color_, convert_, custom_]
  );
}


const fns = [
  toHsl,
  fromHsl,
];
for (const fn of fns) {
  await fn();
}
