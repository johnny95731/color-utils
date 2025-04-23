import { performanceTest } from '../utilsForTest/perf.js';
import { SampleGenerator } from '../utilsForTest/sample.js';
import { adjContrast, CONTRAST_METHODS } from '../../dist/colors.mjs';


const { rgbs, length } = SampleGenerator.defaults;


function overall() {
  const fns = [];
  CONTRAST_METHODS.forEach(name => {
    fns.push([
      name,
      function(){
        for (let i = 5; i < length; i++) {
          adjContrast(rgbs.slice(i-5, i), name, 'RGB');
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
