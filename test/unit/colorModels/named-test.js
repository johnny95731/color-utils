import Color from 'color';
import convert from 'color-convert';
import { colord, extend } from 'colord';
import namesPlugin from 'colord/plugins/names';

import { rgb2hex, rgb2named } from '../../../dist/index.js';
import { equivalenceTest } from '../../../test-utils/color-test.js';
import { SampleGenerator } from '../../../test-utils/sample.js';


extend([namesPlugin]);

const { rgbs } = SampleGenerator.defaults;

const compFn = (name1, name2) => name1 === name2;

function namedEquiv() {
  const colord_ = [
    'colord',
    (rgb) => {
      const name = colord(rgb2hex(rgb)).toName({ closest: true });
      return name;
    },
  ];
  const color_ = [
    'color',
    (rgb) => {
      const name = Color(rgb2hex(rgb)).keyword();
      return name;
    },
  ];
  const convert_ = [
    'color-convert',
    (rgb) => {
      const name = convert.rgb.keyword(rgb);
      return name;
    },
  ];
  const custom = [
    'color-utils',
    rgb => rgb2named(rgb).toLowerCase(),
  ];

  equivalenceTest(custom, colord_, rgbs, compFn);
  equivalenceTest(custom, color_, rgbs, compFn);
  equivalenceTest(custom, convert_, rgbs, compFn);
}

console.log(
  'Named equivalence: The order of name list may cause the results'
  + 'are different.',
);
namedEquiv();
