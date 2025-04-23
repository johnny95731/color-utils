import { extend } from 'colord';
import harmoniesPlugin from 'colord/plugins/harmonies';
import mixPlugin from 'colord/plugins/mix';

import { performanceTest } from '../utilsForTest/perf.js';
import { SampleGenerator } from '../utilsForTest/sample.js';
import { harmolize, rgb2hsb } from '../../dist/colors.mjs';

extend([harmoniesPlugin]);
extend([mixPlugin]);

const { rgbs, colords, length } = SampleGenerator.defaults;


function analogous_() {
  const colord = () => {
    for (let i = 0; i < length; i++) {
      colords[i].harmonies('analogous');
    }
  };
  const custom = () => {
    for (let i = 0; i < length; i++) {
      harmolize(rgbs[i], 'analogous');
    }
  };

  return performanceTest(
    'Analogous',
    [colord, custom]
  );
}

function complementary_() {
  const colord = () => {
    for (let i = 0; i < length; i++) {
      colords[i].harmonies('complementary');
    }
  };
  const custom = () => {
    for (let i = 0; i < length; i++) {
      harmolize(rgbs[i], 'complementary');
    }
  };

  return performanceTest(
    'Complementary',
    [colord, custom]
  );
}

function tetradic_() {
  const colord = () => {
    for (let i = 0; i < length; i++) {
      colords[i].harmonies('tetradic');
    }
  };
  const tetradic1 = () => {
    for (let i = 0; i < length; i++) {
      harmolize(rgbs[i], 'tetradic1');
    }
  };
  const tetradic3 = () => {
    for (let i = 0; i < length; i++) {
      harmolize(rgbs[i], 'tetradic3');
    }
  };

  return performanceTest(
    'Tetradic',
    [colord, tetradic1, tetradic3]
  );
}

function split_() {
  const colord = () => {
    for (let i = 0; i < length; i++) {
      colords[i].harmonies('split-complementary');
    }
  };
  const custom = () => {
    for (let i = 0; i < length; i++) {
      harmolize(rgbs[i], 'split complementary');
    }
  };

  return performanceTest(
    'split complementary',
    [colord, custom]
  );
}

function triadic_() {
  const colord = () => {
    for (let i = 0; i < length; i++) {
      colords[i].harmonies('triadic');
    }
  };
  const custom = () => {
    for (let i = 0; i < length; i++) {
      harmolize(rgbs[i], 'triadic');
    }
  };

  return performanceTest(
    'triadic',
    [colord, custom]
  );
}

function rectangle_() {
  const colord = () => {
    for (let i = 0; i < length; i++) {
      colords[i].harmonies('rectangle');
    }
  };
  const custom = () => {
    for (let i = 0; i < length; i++) {
      harmolize(rgbs[i], 'tetradic2');
    }
  };

  return performanceTest(
    'rectangle',
    [colord, custom]
  );
}

function shades_() {
  const colord = () => {
    for (let i = 0; i < length; i++) {
      colords[i].shades(6);
    }
  };
  const custom = () => {
    for (let i = 0; i < length; i++) {
      harmolize(rgb2hsb(rgbs[i]), 'shades', 6);
    }
  };

  return performanceTest(
    'shades',
    [colord, custom]
  );
}

function tints_() {
  const colord = () => {
    for (let i = 0; i < length; i++) {
      colords[i].tints(6);
    }
  };
  const custom = () => {
    for (let i = 0; i < length; i++) {
      harmolize(rgb2hsb(rgbs[i]), 'tints', 6);
    }
  };

  return performanceTest(
    'tints',
    [colord, custom]
  );
}

function tones_() {
  const colord = () => {
    for (let i = 0; i < length; i++) {
      colords[i].tones(6);
    }
  };
  const custom = () => {
    for (let i = 0; i < length; i++) {
      harmolize(rgb2hsb(rgbs[i]), 'tones', 6);
    }
  };

  return performanceTest(
    'tones',
    [colord, custom]
  );
}


const fns = [
  analogous_,
  complementary_,
  tetradic_,
  split_,
  triadic_,
  rectangle_,
  shades_,
  tints_,
  tones_,
];
for (const fn of fns) {
  await fn();
}
