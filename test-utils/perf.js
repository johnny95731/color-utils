import { Bench } from 'tinybench';


const round = (val, place = 0) => {
  return Math.round(10 ** place * val) / 10 ** place;
};

function convertToMarkdownTable(data) {
  if (!data || data.length === 0) {
    return '';
  }

  const keys = [
    'Task name', 'Latency avg (ns)', 'Throughput avg (ops/s)', 'Comparison',
  ];
  const header = [
    'Library', 'Latency avg (ns)', 'Throughput avg (ops/s)', 'Comparison',
  ];

  const maxTextLength = keys.map(() => 0);
  const markdownData = data.map((obj) => {
    const ret = {};
    keys.forEach((key, i) => {
      const text = obj[key];
      let len;
      if (key !== 'Comparison' && key !== 'Task name') {
        const arr = text.split('±');
        len = arr[0].length;
      }
      else len = text.length;
      if (len > maxTextLength[i]) maxTextLength[i] = len;
      ret[key] = text;
    });
    return ret;
  });

  markdownData.forEach((obj) => {
    keys.forEach((key, j) => {
      if (j === 0) {
        obj[key] = obj[key].padEnd(maxTextLength[0]);
      }
      else if (key !== 'Comparison') {
        const arr = obj[key].split('±');
        const numPadding = maxTextLength[j] - arr[0].length;
        arr[0] += '&ensp;'.repeat(numPadding);
        obj[key] = arr.join('±');
      }
    });
  });

  let markdown = ` ${header.join(' | ')}\n`;
  markdown
    += `${header.map(text => ''.padEnd(text.length + 2, '-')).join('|')}\n`;

  for (const row of markdownData) {
    const rowValues = keys.map(header => row[header]);
    markdown += `${rowValues.join(' | ')}\n`;
  }
  return markdown;
}

/**
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
  print = true,
) => {
  if (print)
    console.log(testName);
  const bench = new Bench({ name: testName, time: 1000, ...options });
  fns.forEach((fn) => {
    if (Array.isArray(fn)) {
      bench.add(...fn);
    }
    else {
      bench.add(fn.name, fn);
    }
  });
  await bench.run();
  if (print) {
    const table = bench.table();
    const avgs = table.map(t => parseInt(Object.values(t)[3]));
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
      }
      else {
        return 'fastest';
      }
    });
    table.forEach((t, i) => {
      t['Comparison'] = comparison[i];
    });

    console.table(table);

    const markdowns = convertToMarkdownTable(table);
    console.table(markdowns);
  }
  else {
    console.log(testName, 'completed.');
  }
  return [bench.name, bench.table()];
};
