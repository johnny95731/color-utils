import { colord, extend } from 'colord';
import labPlugin from 'colord/plugins/lab';
import lchPlugin from 'colord/plugins/lch';
import convert from 'color-convert';

import { performanceTest } from '../utilsForTest/perf.js';
import { SampleGenerator } from '../utilsForTest/sample.js';
import { rgb2lab, lab2rgb, rgb2lchab, lchab2rgb } from '../../dist/colors.mjs';

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
  const convert_ = () => {
    for (let i = 0; i < length; i++) {
      convert.rgb.lab.raw(rgbs[i]);
    }
  };
  const custom_ = () => {
    for (let i = 0; i < length; i++) {
      rgb2lab(rgbs[i]);
    }
  };
  return performanceTest(
    'RGB to Lab',
    [colord_, color_, convert_, custom_]
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
  const convert_ = () => {
    for (let i = 0; i < length; i++) {
      convert.lab.rgb.raw(tempArr[i]);
    }
  };
  const custom_ = () => {
    for (let i = 0; i < length; i++) {
      lab2rgb(tempArr[i]);
    }
  };
  return performanceTest(
    'Lab to RGB',
    [colord_, color_, convert_, custom_]
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
  const convert_ = () => {
    for (let i = 0; i < length; i++) {
      convert.rgb.lch.raw(rgbs[i]);
    }
  };
  const custom_ = () => {
    for (let i = 0; i < length; i++) {
      rgb2lchab(rgbs[i]);
    }
  };
  return performanceTest(
    'RGB to LCH(ab)',
    [colord_, color_, convert_, custom_]
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
  const convert_ = () => {
    for (let i = 0; i < length; i++) {
      convert.lch.rgb.raw(tempArr[i]);
    }
  };
  const custom_ = () => {
    for (let i = 0; i < length; i++) {
      lchab2rgb(tempArr[i]);
    }
  };
  return performanceTest(
    'LCH(ab) to RGB',
    [colord_, color_, convert_, custom_]
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
