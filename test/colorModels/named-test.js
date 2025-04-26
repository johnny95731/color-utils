import { colord, extend } from 'colord';
import namesPlugin from 'colord/plugins/names';
import Color from 'color';
import convert from 'color-convert';

import { equivalenceTest } from '../utilsForTest/color-test.js';
import { SampleGenerator } from '../utilsForTest/sample.js';
import { rgb2hex, rgb2named } from '../../dist/index.js';

extend([namesPlugin]);

const { rgbs } = SampleGenerator.defaults;

const compFn = (name1, name2) => name1 === name2;

function namedEquiv() {
  const colord_ = (rgb) => {
    const name = colord(rgb2hex(rgb)).toName({ closest: true });
    return name;
  };
  const color_ = (rgb) => {
    const name = Color(rgb2hex(rgb)).keyword();
    if (name === 'fuchsia') return 'magenta';
    return name;
  };
  const convert_ = (rgb) => {
    const name = convert.rgb.keyword(rgb);
    if (name === 'fuchsia') return 'magenta';
    return name;
  };
  const custom_ = (rgb) => {
    return rgb2named(rgb).toLowerCase();
  };

  equivalenceTest(custom_, colord_, rgbs, compFn);
  equivalenceTest(custom_, color_, rgbs, compFn);
  equivalenceTest(custom_, convert_, rgbs, compFn);
}

console.log('Named equivalence: The order of name list may cause the results are different.');
namedEquiv();
