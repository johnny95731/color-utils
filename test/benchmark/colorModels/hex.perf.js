import convert from 'color-convert';
import { colord } from 'colord';

import { rgb2hex, hex2rgb, map } from '../../../dist/index.js';
import { randInt, randRgbGen } from '../../../test-utils/helpers.js';
import { performanceTest } from '../../../test-utils/perf.js';
import { SampleGenerator } from '../../../test-utils/sample.js';


const { rgbs, hex: hex6, colords, length } = SampleGenerator.defaults;

const hexChar = '0123456789ABCDEF';
const hexGenerator = num => map(num, () => hexChar[randInt(15)]).join('');

function toHex() {
  const colord_ = () => {
    for (let i = 0; i < length; i++) {
      colords[i].toHex();
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
      ['color-utils', custom_],
      ['colord', colord_],
      ['color-convert', convert_],
    ],
  );
}

function toHexWithAlpha() {
  const rgbas = map(length, () => randRgbGen(true));
  const colords = map(rgbas, ([r, g, b, a]) => colord({ r, g, b, a }));

  const colord_ = () => {
    for (let i = 0; i < length; i++) {
      colords[i].toHex();
    }
  };
  const custom_ = () => {
    for (let i = 0; i < length; i++) {
      rgb2hex(rgbas[i]);
    }
  };

  return performanceTest(
    'RGB to HEX with alpha',
    [
      ['color-utils', custom_],
      ['colord', colord_],
    ],
  );
}

function fromHex8() {
  const hex8 = map(length, () => hexGenerator(8));
  const colord_ = () => {
    for (let i = 0; i < length; i++) {
      colord(hex8[i]);
    }
  };
  const custom_ = () => {
    for (let i = 0; i < length; i++) {
      hex2rgb(hex8[i]);
    }
  };

  return performanceTest(
    '8-digit HEX to RGB',
    [
      ['color-utils', custom_],
      ['colord', colord_],
    ],
  );
};

function fromHex6() {
  const colord_ = () => {
    for (let i = 0; i < length; i++) {
      colord(hex6[i]);
    }
  };
  const fn = convert.hex.rgb.raw;
  const convert_ = () => {
    for (let i = 0; i < length; i++) {
      fn(hex6[i]);
    }
  };
  const custom_ = () => {
    for (let i = 0; i < length; i++) {
      hex2rgb(hex6[i]);
    }
  };

  return performanceTest(
    '6-digit HEX to RGB',
    [
      ['color-utils', custom_],
      ['colord', colord_],
      ['color-convert', convert_],
    ],
  );
};

function fromHex4() {
  const hex4 = map(length, () => hexGenerator(4));

  const colord_ = () => {
    for (let i = 0; i < length; i++) {
      colord(hex4[i]);
    }
  };
  const custom_ = () => {
    for (let i = 0; i < length; i++) {
      hex2rgb(hex4[i]);
    }
  };

  return performanceTest(
    '4-digit HEX to RGB',
    [
      ['color-utils', custom_],
      ['colord', colord_],
    ],
  );
};

function fromHex3() {
  const hex3 = map(length, () => hexGenerator(3));

  const colord_ = () => {
    for (let i = 0; i < length; i++) {
      colord(hex3[i]);
    }
  };
  const fn = convert.hex.rgb.raw;
  const convert_ = () => {
    for (let i = 0; i < length; i++) {
      fn(hex3[i]);
    }
  };
  const custom_ = () => {
    for (let i = 0; i < length; i++) {
      hex2rgb(hex3[i]);
    }
  };

  return performanceTest(
    '3-digit HEX to RGB',
    [
      ['color-utils', custom_],
      ['colord', colord_],
      ['color-convert', convert_],
    ],
  );
};


const fns = [
  toHex,
  toHexWithAlpha,
  fromHex8,
  fromHex6,
  fromHex4,
  fromHex3,
];
for (const fn of fns) {
  await fn();
}
