import { extend } from 'colord';
import harmoniesPlugin from 'colord/plugins/harmonies';
import mixPlugin from 'colord/plugins/mix';

import { performanceTest } from '../../../test-utils/perf.js';
import { SampleGenerator } from '../../../test-utils/sample.js';
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
      harmonize(rgb2hsb(rgbs[i]), 'analogous');
    }
  };

  return performanceTest(
    'Analogous',
    [
      ['color-utils',  custom],
      colord,
    ]
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
      harmonize(rgb2hsb(rgbs[i]), 'complementary');
    }
  };

  return performanceTest(
    'Complementary',
    [
      ['color-utils',  custom],
      colord,
    ]
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
      harmonize(rgb2hsb(rgbs[i]), 'split complementary');
    }
  };

  return performanceTest(
    'split complementary',
    [
      ['color-utils',  custom],
      colord,
    ]
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
      harmonize(rgb2hsb(rgbs[i]), 'triadic');
    }
  };

  return performanceTest(
    'triadic',
    [
      ['color-utils',  custom],
      colord,
    ]
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
      harmonize(rgb2hsb(rgbs[i]), 'tetradic2');
    }
  };

  return performanceTest(
    'rectangle',
    [
      ['color-utils',  custom],
      colord,
    ]
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
    [
      ['color-utils',  custom],
      colord,
    ]
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
    [
      ['color-utils',  custom],
      colord,
    ]
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
    [
      ['color-utils',  custom],
      colord,
    ]
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
      harmonize(rgb2hsb(rgbs[i]), 'tetradic1');
    }
  };
  const tetradic3 = () => {
    for (let i = 0; i < length; i++) {
      harmonize(rgb2hsb(rgbs[i]), 'tetradic3');
    }
  };

  return performanceTest(
    'Tetradic',
    [
      tetradic1,
      tetradic3,
      colord,
    ]
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
