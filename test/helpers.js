import { performanceTest } from './utilsForTest/perf.js';
import { map, cloneDeep } from '../dist/index.js';

const num = 5;

function clone4Layers() {
  const obj4layers = {
    a: 1,
    b: '2',
    c: {
      a: 1,
      b: '2',
      c: {
        a: 1,
        b: '2',
        c: {
          a: 1,
          b: '2',
          c: {
          }
        },
        d: [0, 1, 2]
      },
      d: [0, 1, 2]
    },
    d: [0, 1, 2]
  };

  const json = () => {
    JSON.parse(JSON.stringify(obj4layers));
  };
  const builtin = () => {
    structuredClone(obj4layers);
  };
  const custom = () => {
    cloneDeep(obj4layers);
  };

  return performanceTest(
    'Clone - 4 layers',
    [json, builtin, custom],
    { time: 500 }
  );
}

function clone2Layers() {
  const obj1layers = {
    a: 1,
    b: '2',
    c: {
      qqqqqq: 5,
      abc: 123,
    },
    d: [1, 9, 8],
  };

  const json = () => {
    JSON.parse(JSON.stringify(obj1layers));
  };
  const builtin = () => {
    structuredClone(obj1layers);
  };
  const custom = () => {
    cloneDeep(obj1layers);
  };

  return performanceTest(
    'Clone - 2 layers',
    [json, builtin, custom],
    { time: 500 }
  );
}


function mapNumber() {
  const arr = Array(num);
  const builtinFor = () => {
    const r = [];
    for (let i = 0; i < arr.length;) {
      r.push(i++);
    }
    return r;
  };
  const prototype = () => {
    return [...Array(num)].map((_, i) => i);
  };
  const customFunction = () => {
    return map(num, (_, i) => i);
  };

  return performanceTest(
    'map - number',
    [builtinFor, prototype, customFunction],
    { time: 200 }
  );
}

function mapArray() {
  const arr = [...Array(num)];
  const builtinFor = () => {
    const r = [];
    for (let i = 0; i < arr.length;) {
      r.push(i++);
    }
    return r;
  };
  const prototype = () => {
    return arr.map((_, i) => i);
  };
  const customFunction = () => {
    return map(arr, (_, i) => i);
  };

  return performanceTest(
    'map - array',
    [builtinFor, prototype, customFunction],
    { time: 200 }
  );
}

function typeChecking_() {
  const getItem = () => Math.random() < 0.5 ? '1' : [1];
  const isArray_ = () => {
    const item = getItem();
    return Array.isArray(item) ? item[0] : item;
  };
  const typeof_ = () => {
    const item = getItem();
    return typeof item === 'string'? item : item[0];
  };
  return performanceTest(
    'Type checking',
    [isArray_, typeof_],
    { time: 500 }
  );
}


const fns = [
  clone4Layers,
  clone2Layers,
  mapNumber,
  mapArray,
  typeChecking_,
];
for (const fn of fns) {
  await fn();
}

