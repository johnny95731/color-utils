import { extend } from 'colord';
import mixPlugin from 'colord/plugins/mix';

import { performanceTest } from '../../../test-utils/perf.js';
import { SampleGenerator } from '../../../test-utils/sample.js';
import { mixColors, meanMix, MIXING_MODES, mix, softLightBlend } from '../../../dist/index.js';

extend([mixPlugin]);

const { rgbs, colords, length } = SampleGenerator.defaults;


function mix_() {
  const colord = () => {
    for (let i = 1; i < length; i++) {
      colords[i].mix(colords[i-1]);
    }
  };
  const callDirectly = () => {
    for (let i = 1; i < length; i++) {
      mix(rgbs[i], rgbs[i-1]);
    }
  };
  const callInterface = () => {
    for (let i = 1; i < length; i++) {
      mixColors([rgbs[i], rgbs[i-1]], 'weighted');
    }
  };

  return performanceTest(
    'Weighted Mix',
    [colord, callDirectly, callInterface]
  );
}

function mean_() {
  const colord = () => {
    for (let i = 1; i < length; i++) {
      colords[i].mix(colords[i-1]);
    }
  };
  const callDirectly = () => {
    for (let i = 1; i < length; i++) {
      meanMix(rgbs[i], rgbs[i-1]);
    }
  };
  const callInterface = () => {
    for (let i = 1; i < length; i++) {
      mixColors([rgbs[i], rgbs[i-1]], 'mean');
    }
  };

  return performanceTest(
    'Mean mix',
    [colord, callDirectly, callInterface]
  );
}

function softLight_() {
  const fns = [];
  ['photoshop', 'pegtop', 'illusions.hu', 'w3c'].forEach(name => {
    fns.push([
      name,
      function() {
        for (let i = 1; i < length; i++) {
          softLightBlend(rgbs[i], rgbs[i-1], name);
        }
      }
    ]);
  });

  return performanceTest(
    'Soft Light Blend',
    fns
  );
}


function overall() {
  const fns = [];
  MIXING_MODES.forEach(name => {
    fns.push([
      name,
      function(){
        for (let i = 1; i < length; i++) {
          mixColors([rgbs[i], rgbs[i-1]], name);
        }
      }
    ]);
  });

  return performanceTest(
    'Mix test',
    fns,
  );
}


const fns = [
  mix_,
  mean_,
  softLight_,
  overall,
];
for (const fn of fns) {
  await fn();
}
