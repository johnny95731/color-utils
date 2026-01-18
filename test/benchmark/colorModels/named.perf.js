import Color from 'color';
import convert from 'color-convert';
import { colord, extend } from 'colord';
import namesPlugin from 'colord/plugins/names';

import { named2rgb, rgb2named } from '../../../dist/index.js';
import { performanceTest } from '../../../test-utils/perf.js';
import { SampleGenerator } from '../../../test-utils/sample.js';


extend([namesPlugin]);


const { rgbs, colords, colors, length } = SampleGenerator.defaults;


function toNamed() {
  const colord_ = () => {
    for (let i = 0; i < length; i++) {
      colords[i].toName({ closest: true });
    }
  };
  const color_ = () => {
    for (let i = 0; i < length; i++) {
      colors[i].keyword();
    }
  };
  const fn = convert.rgb.keyword.raw;
  const convert_ = () => {
    for (let i = 0; i < length; i++) {
      fn(rgbs[i]);
    }
  };
  const custom_ = () => {
    for (let i = 0; i < length; i++) {
      rgb2named(rgbs[i]);
    }
  };
  return performanceTest(
    'RGB to NAMED',
    [
      ['color-utils', custom_],
      ['colord', colord_],
      ['color', color_],
      ['color-convert', convert_],
    ],
  );
}

function fromNamed() {
  const tempColord = [];
  const tempColor = [];
  const tempArr = [];
  const tempArr2 = [];
  for (let i = 0; i < length; i++) {
    tempColord.push(colords[i].toName({ closest: true }));
    tempColor.push(colors[i].keyword());
    tempArr.push(convert.rgb.keyword.raw(rgbs[i]));
    tempArr2.push(rgb2named(rgbs[i]));
  }

  const colord_ = () => {
    for (let i = 0; i < length; i++) {
      colord(tempColord[i]);
    }
  };
  const color_ = () => {
    for (let i = 0; i < length; i++) {
      Color(tempColor[i]);
    }
  };
  const fn = convert.keyword.rgb.raw;
  const convert_ = () => {
    for (let i = 0; i < length; i++) {
      fn(tempArr[i]);
    }
  };
  const custom_ = () => {
    for (let i = 0; i < length; i++) {
      named2rgb(tempArr2[i]);
    }
  };
  return performanceTest(
    'NAMED to RGB',
    [
      ['color-utils', custom_],
      ['colord', colord_],
      ['color', color_],
      ['color-convert', convert_],
    ],
  );
}


const fns = [
  toNamed,
  fromNamed,
];
for (const fn of fns) {
  await fn();
}
