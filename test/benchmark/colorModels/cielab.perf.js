import { colord, extend } from 'colord';
import labPlugin from 'colord/plugins/lab';
import lchPlugin from 'colord/plugins/lch';
import convert from 'color-convert';

import { performanceTest } from '../../../test-utils/perf.js';
import { SampleGenerator } from '../../../test-utils/sample.js';
import { rgb2lab, lab2rgb, rgb2lchab, lchab2rgb } from '../../../dist/index.js';

extend([labPlugin, lchPlugin]);

const { rgbs, colors, colords, length } = SampleGenerator.defaults;

function toLab() {
  const colord_ = () => {
    for (let i = 0; i < length; i++) {
      colords[i].toLab();
    }
  };
  const color_ = () => {
    for (let i = 0; i < length; i++) {
      colors[i].lab();
    }
  };
  const fn = convert.rgb.lab.raw;
  const convert_ = () => {
    for (let i = 0; i < length; i++) {
      fn(rgbs[i]);
    }
  };
  const custom_ = () => {
    for (let i = 0; i < length; i++) {
      rgb2lab(rgbs[i]);
    }
  };
  return performanceTest(
    'RGB to Lab',
    [
      ['color-utils',  custom_],
      ['colord', colord_],
      ['color', color_],
      ['color-convert', convert_],
    ]
  );
}

function fromLab() {
  const tempColord = [];
  const tempColor = [];
  const tempArr = [];
  for (let i = 0; i < length; i++) {
    tempColord.push(colords[i].toLab());
    tempColor.push(colors[i].lab());
    tempArr.push(rgb2lab(rgbs[i]));
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
  const fn = convert.lab.rgb.raw;
  const convert_ = () => {
    for (let i = 0; i < length; i++) {
      fn(tempArr[i]);
    }
  };
  const custom_ = () => {
    for (let i = 0; i < length; i++) {
      lab2rgb(tempArr[i]);
    }
  };
  return performanceTest(
    'Lab to RGB',
    [
      ['color-utils',  custom_],
      ['colord', colord_],
      ['color', color_],
      ['color-convert', convert_],
    ]
  );
}

function toLchab() {
  const colord_ = () => {
    for (let i = 0; i < length; i++) {
      colords[i].toLch();
    }
  };
  const color_ = () => {
    for (let i = 0; i < length; i++) {
      colors[i].lch();
    }
  };
  const fn = convert.rgb.lch.raw;
  const convert_ = () => {
    for (let i = 0; i < length; i++) {
      fn(rgbs[i]);
    }
  };
  const custom_ = () => {
    for (let i = 0; i < length; i++) {
      rgb2lchab(rgbs[i]);
    }
  };
  return performanceTest(
    'RGB to LCH(ab)',
    [
      ['color-utils',  custom_],
      ['colord', colord_],
      ['color', color_],
      ['color-convert', convert_],
    ]
  );
}

function fromLchab() {
  const tempColord = [];
  const tempColor = [];
  const tempArr = [];
  for (let i = 0; i < length; i++) {
    tempColord.push(colords[i].toLch());
    tempColor.push(colors[i].lch());
    tempArr.push(rgb2lchab(rgbs[i]));
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
  const fn = convert.lch.rgb.raw;
  const convert_ = () => {
    for (let i = 0; i < length; i++) {
      fn(tempArr[i]);
    }
  };
  const custom_ = () => {
    for (let i = 0; i < length; i++) {
      lchab2rgb(tempArr[i]);
    }
  };
  return performanceTest(
    'LCH(ab) to RGB',
    [
      ['color-utils',  custom_],
      ['colord', colord_],
      ['color', color_],
      ['color-convert', convert_],
    ]
  );
}


const fns = [
  toLab,
  fromLab,
  toLchab,
  fromLchab,
];
for (const fn of fns) {
  await fn();
}
