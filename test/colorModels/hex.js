import { colord } from 'colord';
import Color from 'color';
import convert from 'color-convert';

import { performanceTest } from '../utilsForTest/perf.js';
import { SampleGenerator } from '../utilsForTest/sample.js';
import { rgb2hex, hex2rgb } from '../../dist/colors.mjs';

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
  const convert_ = () => {
    for (let i = 0; i < length; i++) {
      convert.rgb.hex(rgbs[i]);
    }
  };
  const custom_ = () => {
    for (let i = 0; i < length; i++) {
      rgb2hex(rgbs[i]);
    }
  };

  return performanceTest(
    'RGB to HEX',
    [colord_, color_, convert_, custom_]
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
  const convert_ = () => {
    for (let i = 0; i < length; i++) {
      convert.hex.rgb.raw(hex[i]);
    }
  };
  const custom_ = () => {
    for (let i = 0; i < length; i++) {
      hex2rgb(hex[i]);
    }
  };

  return performanceTest(
    'HEX to RGB',
    [colord_, color_, convert_, custom_]
  );
};


const fns = [
  toHex,
  fromHex,
];
for (const fn of fns) {
  await fn();
}
