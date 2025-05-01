import { Bench } from 'tinybench';

const round = (val, place = 0) => {
  return Math.round(10**place * val) / 10**place;
};

/**
 *
 * @param {string} testName
 * @param {(CallableFunction | [string, CallableFunction])[]} fns
 * @param {import("tinybench").BenchOptions} options
 * @param {boolean} print Default: `true`.
 * @returns
 */
export const performanceTest = async (
  testName,
  fns,
  options,
  print = true
) => {
  if (print)
    console.log(testName);
  const bench = new Bench({ name: testName, time: 1000, ...options });
  fns.forEach(fn => {
    if (Array.isArray(fn)) {
      bench.add(fn[0], fn[1]);
    } else {
      bench.add(fn.name, fn);
    }
  });
  await bench.run();
  if (print) {
    const table = bench.table();
    const avgs = table.map((t) => parseInt(Object.values(t)[3]));
    // Find fastest case.
    let idx = -1, max = -Infinity;
    for (let i = 0; i < avgs.length; i++) {
      if (avgs[i] > max) {
        max = avgs[i];
        idx = i;
      }
    }
    const comparison = avgs.map((val, i) => {
      if (i !== idx) {
        const percent = 100 * (1 - val / max);
        return `${round(percent, percent < 1 ? 2 : 0)}% slower`;
      } else {
        return 'fastest';
      }
    });
    table.forEach((t, i) => {
      t['comparison'] = comparison[i];
    });

    console.table(table);
  } else {
    console.log(testName, 'completed.');
  }
  return [bench.name, bench.table()];
};
