import { random, extend, Colord } from 'colord';
import a11yPlugin from 'colord/plugins/a11y';
import labPlugin from 'colord/plugins/lab';
import xyzPlugin from 'colord/plugins/xyz';

import {
  dot3, randInt, rgb2contrast, isReadable, linearRgb2srgb, randRgbGen, rgb2hex,
  rgb2hue, rgb2luminance, srgb2linearRgb, getCssColor, COLOR_SPACES, rgb2hsl,
  rgb2lab, rgb2xyz,
} from '../../dist/index.js';
import { performanceTest } from '../../test-utils/perf.js';
import { SampleGenerator } from '../../test-utils/sample.js';


extend([a11yPlugin, labPlugin, xyzPlugin]);


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
    for (let i = 0; i < 6; i++) s += hexArr[randInt(16)];
    return s;
  };

  const randRgb2hex = () => rgb2hex(randRgbGen());
  const colord_ = () => random();


  return performanceTest(
    'Random RGB generation',
    [
      randomHex,
      randomHexArr,
      randRgb2hex,
      randRgbGen,
      colord_,
    ],
    { time: 300 },
  );
}

function getColorSpace_() {
  const space = 'Lab';

  const arrayFind_ = (space) => {
    space = space.toUpperCase();
    return COLOR_SPACES.find(
      item => item.name_.toUpperCase() === space,
    ) ?? COLOR_SPACES[0];
  };
  const arrayFind = () => arrayFind_(space);

  const table_ = (space) => {
    space = space.toUpperCase();
    return COLOR_SPACES[{
      RGB: 0,
      HSL: 1,
      HSB: 2,
      HWB: 3,
      CMYK: 4,
      XYZ: 5,
      LAB: 6,
      LUV: 7,
      LCHAB: 8,
      LCHUV: 9,
      OKLAB: 10,
      OKLCH: 11,
    }[space] ?? 0];
  };
  const table = () => table_(space);

  return performanceTest(
    'getColorSpace',
    [
      ['from array-find', arrayFind],
      ['from object-literal', table],
    ],
    { time: 300 },
  );
}

function rgbString() {
  const custom_ = () => {
    for (let i = 0; i < length; i++) {
      getCssColor(rgbs[i]);
    }
  };
  const custom2_ = () => {
    for (let i = 0; i < length; i++) {
      getCssColor(rgbs[i], undefined, { percent_: false });
    }
  };
  const colord_ = () => {
    for (let i = 0; i < length; i++) {
      colords[i].toRgbString();
    }
  };
  const color_ = () => {
    for (let i = 0; i < length; i++) {
      colors[i].toString();
    }
  };

  return performanceTest(
    'RGB string',
    [
      ['color-utils', custom_],
      ['color-utils (number)', custom2_],
      ['colord', colord_],
      ['color', color_],
    ],
    { time: 300 },
  );
}

function hslString() {
  const custom_ = () => {
    for (let i = 0; i < length; i++) {
      getCssColor(rgb2hsl(rgbs[i]), 'HSL');
    }
  };
  const custom2_ = () => {
    for (let i = 0; i < length; i++) {
      getCssColor(rgb2hsl(rgbs[i]), 'HSL', { percent_: false });
    }
  };
  const colord_ = () => {
    for (let i = 0; i < length; i++) {
      colords[i].toHslString();
    }
  };
  const color_ = () => {
    for (let i = 0; i < length; i++) {
      colors[i].hsl().toString();
    }
  };

  return performanceTest(
    'HSL string',
    [
      ['color-utils', custom_],
      ['color-utils (number)', custom2_],
      ['colord', colord_],
      ['color', color_],
    ],
    { time: 300 },
  );
}

Colord.prototype.toXyzString = function () {
  const { x, y, z } = this.toXyz();
  return `xyz(${x} ${y} ${z})`;
};
function xyzString() {
  const custom_ = () => {
    for (let i = 0; i < length; i++) {
      getCssColor(rgb2xyz(rgbs[i]), 'XYZ');
    }
  };
  const custom2_ = () => {
    for (let i = 0; i < length; i++) {
      getCssColor(rgb2xyz(rgbs[i]), 'XYZ', { percent_: false });
    }
  };
  const colord_ = () => {
    for (let i = 0; i < length; i++) {
      colords[i].toXyzString();
    }
  };
  const color_ = () => {
    for (let i = 0; i < length; i++) {
      colors[i].xyz().toString();
    }
  };

  return performanceTest(
    'XYZ string',
    [
      ['color-utils', custom_],
      ['color-utils (number)', custom2_],
      ['colord', colord_],
      ['color', color_],
    ],
    { time: 300 },
  );
}

Colord.prototype.toLabString = function () {
  const { l, a, b } = this.toLab();
  return `lab(${l} ${a} ${b})`;
};
function labString() {
  const custom_ = () => {
    for (let i = 0; i < length; i++) {
      getCssColor(rgb2lab(rgbs[i]), 'LAB');
    }
  };
  const custom2_ = () => {
    for (let i = 0; i < length; i++) {
      getCssColor(rgb2xyz(rgbs[i]), 'LAB', { percent_: false });
    }
  };
  const colord_ = () => {
    for (let i = 0; i < length; i++) {
      colords[i].toLabString();
    }
  };
  const color_ = () => {
    for (let i = 0; i < length; i++) {
      colors[i].lab().toString();
    }
  };

  return performanceTest(
    'LAB string',
    [
      ['color-utils', custom_],
      ['color-utils (number)', custom2_],
      ['colord', colord_],
      ['color', color_],
    ],
    { time: 300 },
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
  const rgb2grayDot = rgb => dot3(rgb, [0.299, 0.587, 0.114]);
  const customDot_ = () => {
    for (let i = 0; i < length; i++) {
      rgb2grayDot(rgbs[i]);
    }
  };
  const rgb2grayMul = rgb => 0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2];
  const customMul_ = () => {
    for (let i = 0; i < length; i++) {
      rgb2grayMul(rgbs[i]);
    }
  };
  const colord_ = () => {
    for (let i = 0; i < length; i++) {
      colords[i].brightness() * 255; // eslint-disable-line
    }
  };

  return performanceTest(
    'To grayscale (same as Y channel of YIQ.)',
    [
      ['color-utils dot', customDot_],
      ['color-utils mul', customMul_],
      ['colord', colord_],
    ],
  );
}

function hue_() {
  const custom_ = () => {
    for (let i = 0; i < length; i++) {
      rgb2hue(rgbs[i]);
    }
  };
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

  return performanceTest(
    'Hue',
    [
      ['color-utils', custom_],
      ['colord', colord_],
      ['color', color_],
    ],
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
      rgb2luminance(rgbs[i]);
      rgb2luminance(rgbs[i]);
    }
  };

  return performanceTest(
    'Relative luminance',
    [
      ['color-utils', custom_],
      ['colord', colord_],
      ['color', color_],
    ],
  );
}

function contrastRatio_() {
  const colord_ = () => {
    for (let i = 1; i < length; i++) {
      colords[i].contrast(colords[i - 1]);
    }
  };
  const color_ = () => {
    for (let i = 1; i < length; i++) {
      colors[i].contrast(colors[i - 1]);
    }
  };
  const custom_ = () => {
    for (let i = 1; i < length; i++) {
      rgb2contrast(rgbs[i], rgbs[i - 1]);
    }
  };

  return performanceTest(
    'contrast ratio',
    [
      ['color-utils', custom_],
      ['colord', colord_],
      ['color', color_],
    ],
  );
}

function isReadable_() {
  const colord_ = () => {
    for (let i = 1; i < length; i++) {
      colords[i].isReadable(colords[i - 1]);
    }
  };
  const custom_ = () => {
    for (let i = 1; i < length; i++) {
      isReadable(rgbs[i], rgbs[i - 1]);
    }
  };

  return performanceTest(
    'Is readable',
    [
      ['color-utils', custom_],
      ['colord', colord_],
    ],
  );
}


const fns = [
  generation,
  getColorSpace_,
  rgbString,
  hslString,
  xyzString,
  labString,
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
