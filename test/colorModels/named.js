import { extend } from 'colord';
import namesPlugin from 'colord/plugins/names';
import convert from 'color-convert';

import { performanceTest } from '../utilsForTest/perf.js';
import { SampleGenerator } from '../utilsForTest/sample.js';
import { getClosestNamed } from '../../dist/colors.mjs';

extend([namesPlugin]);


const { rgbs, colords, colors, length } = SampleGenerator.defaults;


function name() {
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
  const convert_ = () => {
    for (let i = 0; i < length; i++) {
      convert.rgb.keyword(rgbs[i]);
    }
  };
  const custom_ = () => {
    for (let i = 0; i < length; i++) {
      getClosestNamed(rgbs[i]);
    }
  };
  return performanceTest(
    'Named colors',
    [colord_, color_, convert_, custom_]
  );
}


const fns = [
  name,
];
for (const fn of fns) {
  await fn();
}
