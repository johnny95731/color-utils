import { performanceTest } from '../utilsForTest/perf.js';
import { SampleGenerator } from '../utilsForTest/sample.js';
import { adjContrast, CONTRAST_METHODS, rgb2lab } from '../../dist/index.js';


const { rgbs, length } = SampleGenerator.defaults;


function overall() {
  const fns = [];
  const labs = rgbs.map(rgb => rgb2lab(rgb));
  CONTRAST_METHODS.forEach(name => {
    fns.push([
      name,
      function(){
        for (let i = 5; i < length; i++) {
          adjContrast(labs.slice(i-5, i), name, 'LAB');
        }
      }
    ]);
  });

  return performanceTest(
    'Adjust test',
    fns
  );
}


const fns = [
  overall
];
for (const fn of fns) {
  await fn();
}
