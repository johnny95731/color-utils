import { extend } from 'colord';
import harmoniesPlugin from 'colord/plugins/harmonies';
import mixPlugin from 'colord/plugins/mix';

import { performanceTest } from '../../../test-utils/perf.js';
import { SampleGenerator } from '../test-utils/sample.js';
import { harmonize, rgb2hsb } from '../../../dist/index.js';

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
      harmonize(rgbs[i], 'analogous');
    }
  };

  return performanceTest(
    'Analogous',
    [colord, ['color-utils',  custom]]
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
      harmonize(rgbs[i], 'complementary');
    }
  };

  return performanceTest(
    'Complementary',
    [colord, ['color-utils',  custom]]
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
      harmonize(rgbs[i], 'split complementary');
    }
  };

  return performanceTest(
    'split complementary',
    [colord, ['color-utils',  custom]]
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
      harmonize(rgbs[i], 'triadic');
    }
  };

  return performanceTest(
    'triadic',
    [colord, ['color-utils',  custom]]
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
      harmonize(rgbs[i], 'tetradic2');
    }
  };

  return performanceTest(
    'rectangle',
    [colord, ['color-utils',  custom]]
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
      harmonize(rgb2hsb(rgbs[i]), 'shades', 6);
    }
  };

  return performanceTest(
    'shades',
    [colord, ['color-utils',  custom]]
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
      harmonize(rgb2hsb(rgbs[i]), 'tints', 6);
    }
  };

  return performanceTest(
    'tints',
    [colord, ['color-utils',  custom]]
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
      harmonize(rgb2hsb(rgbs[i]), 'tones', 6);
    }
  };

  return performanceTest(
    'tones',
    [colord, ['color-utils',  custom]]
  );
}

function others() {
  const colord = () => {
    for (let i = 0; i < length; i++) {
      colords[i].harmonies('tetradic');
    }
  };
  const tetradic1 = () => {
    for (let i = 0; i < length; i++) {
      harmonize(rgbs[i], 'tetradic1');
    }
  };
  const tetradic3 = () => {
    for (let i = 0; i < length; i++) {
      harmonize(rgbs[i], 'tetradic3');
    }
  };

  return performanceTest(
    'Tetradic',
    [colord, tetradic1, tetradic3]
  );
}


const fns = [
  analogous_,
  complementary_,
  split_,
  triadic_,
  rectangle_,
  shades_,
  tints_,
  tones_,
  others,
];
for (const fn of fns) {
  await fn();
}
