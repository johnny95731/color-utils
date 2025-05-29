import { performanceTest } from '../../../test-utils/perf.js';
import { SampleGenerator } from '../../../test-utils/sample.js';
import { adjContrast, CONTRAST_METHODS } from '../../../dist/index.js';


const { rgbs, length } = SampleGenerator.defaults;


function overall() {
  const fns = [];
  CONTRAST_METHODS.forEach(name => {
    fns.push([
      name,
      function(){
        for (let i = 5; i <= length; i++) {
          adjContrast(rgbs.slice(i-5, i), name, );
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
