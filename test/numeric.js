import { performanceTest } from './utilsForTest/perf.js';
import { map } from '../dist/index.js';


function randPositiveInt() {
  const max = 100;
  const trunc = () => {
    return Math.trunc(Math.random() * (max+1));
  };
  const floor = () => {
    return Math.floor(Math.random() * (max+1));
  };
  const bitwiseOR = () => {
    return Math.random() * (max+1) | 0;
  };
  const bitwiseNOT = () => {
    return ~~(Math.random() * (max + 1));
  };


  return performanceTest(
    'random positive integer',
    [trunc, floor, bitwiseOR, bitwiseNOT]
  );
}

function rounding() {
  const place = 3;
  const generator = () => Math.round() * 10;
  const math = () => {
    const val = generator();
    return Math.round(10**place * val) / 10**place;
  };
  const mathCache = () => {
    const val = generator();
    const temp = 10**place;
    return Math.round(temp * val) / temp;
  };
  const bitwise = () => {
    let val = generator();
    val *= 10**place;
    return ((val + 0.5) << 0) / 10**place;
  };

  return performanceTest(
    'rounding',
    [math, mathCache, bitwise],
    { time: 500 }
  );
}

function clip() {
  const ifelse_ = (num, min, max) => {
    return (
      num < +min ?
        num = min :
        num > +max && (num = max),
      num);
  };
  const ifelse = () => {
    ifelse_(Math.random(), Math.random(), Math.random());
  };

  const math_ = (num, min, max) => {
    return Math.min(Math.max(num, +min), +max);
  };
  const math = () => {
    math_(Math.random(), Math.random(), Math.random());
  };

  return performanceTest(
    'clip',
    [ifelse, math],
    { time: 100 }
  );
}

function rad2deg() {
  const gen = () => Math.random() * 3.1;
  const c = 180 / Math.PI;
  const direct = () => {
    return gen() / Math.PI * 180;
  };
  const cache = () => {
    return gen() * c;
  };

  return performanceTest(
    'rad2deg',
    [direct, cache],
    { time: 500 }
  );
}

function atan2() {
  const gen = () => [Math.random()-0.5, Math.random()-0.5];
  const mod = () => {
    return (Math.atan2(...gen())/ Math.PI * 180 + 360) % 360;
  };
  const ifelse = () => {
    const rad = Math.atan2(...gen());
    return (rad > 0 ? rad : (Math.PI + rad)) * 180 / Math.PI;
  };
  const ifelse2 = () => {
    const rad = Math.atan2(...gen()) / Math.PI;
    return 180 * (rad < 0 ? rad + 2 : rad);
  };
  const ifelse3 = () => {
    const rad = 180 * (Math.atan2(...gen()) / Math.PI);
    return rad < 0 ? rad + 360 : rad;
  };

  return performanceTest(
    'atan2',
    [mod, ifelse, ifelse2, ifelse3]
  );
}

function elementwiseMean() {
  const num = 5;
  const arr1 = [...Array(num)].map(Math.random);
  const arr2 = [...Array(num)].map(Math.random);

  const builtinFor = () => {
    const len = Math.min(arr1.length, arr2.length);
    const r = [];
    for (let i = 0; i < len;) {
      r.push((arr1[i] + arr2[i++]) / 2);
    }
    return r;
  };
  const prototype = () => {
    return (arr1.length <= arr2.length ? arr1 : arr2)
      .map((_, i) => (arr1[i] + arr2[i]) / 2);
  };
  const customMapDiv = () => {
    return map(
      Math.min(arr1.length, arr2.length),
      (_, i) => (arr1[i] + arr2[i]) / 2,
    );
  };
  const customMapMult = () => {
    return map(
      Math.min(arr1.length, arr2.length),
      (_, i) => (arr1[i] + arr2[i]) * 0.5,
    );
  };

  return performanceTest(
    'elementwise mean',
    [builtinFor, prototype, customMapDiv, customMapMult]
  );
}

function power_() {
  const gen = () => [
    Math.random() * 10,
    Math.random() * 10,
  ];

  const star = () => {
    const k = gen();
    return k[0]**k[1];
  };

  const math = () => {
    const k = gen();
    return Math.pow(k[0], k[1]);
  };

  const m = (x, y) => {
    if (!y) return 1;
    if (!x) return 0;
    return !y ? 1 : !x ? 0 :Math.exp(y * Math.log(x));
  };
  const explog = () => {
    const k = gen();
    return m(k[0], k[1]);
  };

  return performanceTest(
    'Power',
    [star, math, explog],
    { time: 100 }
  );
}

const fns = [
  randPositiveInt,
  rounding,
  clip,
  rad2deg,
  atan2,
  elementwiseMean,
  power_
];
for (const fn of fns) {
  await fn();
}

