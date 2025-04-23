import { random, extend } from 'colord';
import a11yPlugin from 'colord/plugins/a11y';

import { performanceTest } from './utilsForTest/perf.js';
import { SampleGenerator } from './utilsForTest/sample.js';
import { dot3, randInt } from '../dist/helpers.mjs';
import {
  getContrastRatio, isReadable, linearRgb2srgb, randRgbGen, rgb2hex, rgb2hue,
  relativeLuminance, srgb2linearRgb
} from '../dist/colors.mjs';

extend([a11yPlugin]);


const { rgbs, colors, colords, length } = SampleGenerator.defaults;


function generation() {
  const hex = '0123456789ABCDEF';
  const randomHex = () => {
    let s = '#';
    for (let i = 0; i < 6; i++) s += hex[randInt(16)];
    return s;
  };

  const hexArr = hex.split('');
  const randomHexArr = () => {
    let s = '#';
    for (let i = 0; i<6; i++) s += hexArr[randInt(16)];
    return s;
  };

  const randRgb2hex_ = () => rgb2hex(randRgbGen());
  const colord_ = () => random();


  return performanceTest(
    'Random RGB generation',
    [
      randomHex,
      randomHexArr,
      randRgbGen,
      randRgb2hex_,
      colord_
    ],
    { time: 300 }
  );
}

function rgbLinearize() {
  const linearRgb = rgbs.map(rgb => rgb.map(val => srgb2linearRgb(val)));
  const srgb2linearRgb_ = () => {
    for (let i = 0; i < length; i++) {
      const rgb = rgbs[i];
      srgb2linearRgb(rgb[0]);
      srgb2linearRgb(rgb[1]);
      srgb2linearRgb(rgb[2]);
    }
  };
  const linearRgb2srgb_ = () => {
    for (let i = 0; i < length; i++) {
      const rgb = linearRgb[i];
      linearRgb2srgb(rgb[0]);
      linearRgb2srgb(rgb[1]);
      linearRgb2srgb(rgb[2]);
    }
  };


  return performanceTest(
    'linearization of RGB',
    [srgb2linearRgb_, linearRgb2srgb_],
  );
}

function rgb2gray_() {
  const colord_ = () => {
    for (let i = 0; i < length; i++) {
      colords[i].brightness() * 255; // eslint-disable-line
    }
  };
  const rgb2grayDot = (rgb) => dot3(rgb, [.299, .587, .114]);
  const customDot_ = () => {
    for (let i = 0; i < length; i++) {
      rgb2grayDot(rgbs[i]);
    }
  };
  const rgb2grayMul = (rgb)=>.299*rgb[0]+.587*rgb[1]+.114*rgb[2];
  const customMul_ = () => {
    for (let i = 0; i < length; i++) {
      rgb2grayMul(rgbs[i]);
    }
  };


  return performanceTest(
    'To grayscale (same as Y channel of YIQ.)',
    [colord_, customDot_, customMul_],
  );
}

function hue_() {
  const colord_ = () => {
    for (let i = 0; i < length; i++) {
      colords[i].hue();
    }
  };
  const color_ = () => {
    for (let i = 0; i < length; i++) {
      colors[i].hue();
    }
  };
  const custom_ = () => {
    for (let i = 0; i < length; i++) {
      rgb2hue(rgbs[i]);
    }
  };

  return performanceTest(
    'Hue',
    [colord_, color_, custom_],
  );
}

function relativeLuminance_() {
  const colord_ = () => {
    for (let i = 0; i < length; i++) {
      colords[i].luminance();
    }
  };
  const color_ = () => {
    for (let i = 0; i < length; i++) {
      colors[i].luminosity();
    }
  };
  const custom_ = () => {
    for (let i = 0; i < length; i++) {
      relativeLuminance(rgbs[i]);
    }
  };

  return performanceTest(
    'Relative luminance',
    [colord_, color_, custom_],
  );
}

function contrastRatio_() {
  const colord_ = () => {
    for (let i = 1; i < length; i++) {
      colords[i].contrast(colords[i-1]);
    }
  };
  const color_ = () => {
    for (let i = 1; i < length; i++) {
      colors[i].contrast(colors[i-1]);
    }
  };
  const custom_ = () => {
    for (let i = 1; i < length; i++) {
      getContrastRatio(rgbs[i], rgbs[i-1]);
    }
  };

  return performanceTest(
    'contrast ratio',
    [colord_, color_, custom_],
  );
}

function isReadable_() {
  const colord_ = () => {
    for (let i = 1; i < length; i++) {
      colords[i].isReadable(colords[i-1]);
    }
  };
  const custom_ = () => {
    for (let i = 1; i < length; i++) {
      isReadable(rgbs[i], rgbs[i-1]);
    }
  };

  return performanceTest(
    'Is readable',
    [colord_, custom_],
  );
}


const fns = [
  generation,
  rgbLinearize,
  rgb2gray_,
  hue_,
  relativeLuminance_,
  contrastRatio_,
  isReadable_,
];
for (const fn of fns) {
  await fn();
}
