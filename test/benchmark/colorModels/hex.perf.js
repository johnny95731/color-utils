import { colord } from 'colord';
import Color from 'color';
import convert from 'color-convert';

import { performanceTest } from '../../../test-utils/perf.js';
import { SampleGenerator } from '../../../test-utils/sample.js';
import { rgb2hex, hex2rgb } from '../../../dist/index.js';

const { rgbs, hex, colors, colords, length } = SampleGenerator.defaults;

function toHex() {
  const colord_ = () => {
    for (let i = 0; i < length; i++) {
      colords[i].toHex();
    }
  };
  const color_ = () => {
    for (let i = 0; i < length; i++) {
      colors[i].hex();
    }
  };
  const fn = convert.rgb.hex.raw;
  const convert_ = () => {
    for (let i = 0; i < length; i++) {
      fn(rgbs[i]);
    }
  };
  const custom_ = () => {
    for (let i = 0; i < length; i++) {
      rgb2hex(rgbs[i]);
    }
  };

  return performanceTest(
    'RGB to HEX',
    [
      ['color-utils',  custom_],
      ['colord', colord_],
      ['color', color_],
      ['color-convert', convert_],
    ]
  );
}

function fromHex() {
  const colord_ = () => {
    for (let i = 0; i < length; i++) {
      colord(hex[i]);
    }
  };
  const color_ = () => {
    for (let i = 0; i < length; i++) {
      Color(hex[i]);
    }
  };
  const fn = convert.hex.rgb.raw;
  const convert_ = () => {
    for (let i = 0; i < length; i++) {
      fn(hex[i]);
    }
  };
  const custom_ = () => {
    for (let i = 0; i < length; i++) {
      hex2rgb(hex[i]);
    }
  };

  return performanceTest(
    'HEX to RGB',
    [
      ['color-utils',  custom_],
      ['colord', colord_],
      ['color', color_],
      ['color-convert', convert_],
    ]
  );
};


const fns = [
  toHex,
  fromHex,
];
for (const fn of fns) {
  await fn();
}
