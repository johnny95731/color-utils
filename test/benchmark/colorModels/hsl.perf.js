import convert from 'color-convert';
import { colord } from 'colord';

import { rgb2hsl, hsl2rgb } from '../../../dist/index.js';
import { performanceTest } from '../../../test-utils/perf.js';
import { SampleGenerator } from '../../../test-utils/sample.js';


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
  const fn = convert.rgb.hsl.raw;
  const convert_ = () => {
    for (let i = 0; i < length; i++) {
      fn(rgbs[i]);
    }
  };
  const custom_ = () => {
    for (let i = 0; i < length; i++) {
      rgb2hsl(rgbs[i]);
    }
  };
  return performanceTest(
    'RGB to HSL',
    [
      ['color-utils', custom_],
      ['colord', colord_],
      ['color', color_],
      ['color-convert', convert_],
    ],
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
  const fn = convert.hsl.rgb.raw;
  const convert_ = () => {
    for (let i = 0; i < length; i++) {
      fn(tempArr[i]);
    }
  };
  const custom_ = () => {
    for (let i = 0; i < length; i++) {
      hsl2rgb(tempArr[i]);
    }
  };

  return performanceTest(
    'HSL to RGB',
    [
      ['color-utils', custom_],
      ['colord', colord_],
      ['color', color_],
      ['color-convert', convert_],
    ],
  );
}


const fns = [
  toHsl,
  fromHsl,
];
for (const fn of fns) {
  await fn();
}
