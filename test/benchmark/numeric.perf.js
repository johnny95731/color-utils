import { performanceTest } from '../../test-utils/perf.js';
import { dot3, map } from '../../dist/index.js';


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
  const cache = 180 / Math.PI;
  const mod = () => {
    const rad = Math.atan2(...gen());
    return (rad * cache + 360) % 360;
  };
  const ifelse = () => {
    const rad = Math.atan2(...gen());
    return (rad > 0 ? rad : (Math.PI + rad)) * cache;
  };
  const ifelse2 = () => {
    const rad = Math.atan2(...gen()) / Math.PI;
    return 180 * (rad < 0 ? rad + 2 : rad);
  };
  const ifelse3 = () => {
    const deg = Math.atan2(...gen()) * cache;
    return deg < 0 ? deg + 360 : deg;
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

function invertMat3x3_() {
  // XYZ_2_LMS
  const mat = [
    [0.8189330101, 0.3618667424, -0.1288597137],
    [0.0329845436, 0.9293118715, 0.0361456387],
    [0.0482003018, 0.2643662691, 0.6338517070],
  ];
  const func1 = () => {
    const [
      [a, b, c],
      [d, e, f],
      [g, h, i]
    ] = mat;
    const x = e*i - h*f,
      y = f*g - d*i,
      z = d*h - g*e,
      det = a*x + b*y + c*z;

    return det ? [
      [x/det, (c*h - b*i)/det, (b*f - c*e)/det],
      [y/det, (a*i - c*g)/det, (d*c - a*f)/det],
      [z/det, (g*b - a*h)/det, (a*e - d*b)/det]
    ] : null;
  };
  const func2 = () => {
    const [
      [a, b, c],
      [d, e, f],
      [g, h, i]
    ] = mat;

    const A =  e*i - f*h;
    const B = -(d*i - f*g);
    const C =  d*h - e*g;
    const D = -(b*i - c*h);
    const E =  a*i - c*g;
    const F = -(a*h - b*g);
    const G =  b*f - c*e;
    const H = -(a*f - c*d);
    const I =  a*e - b*d;

    const det = a*A + b*B + c*C;

    const invDet = det;

    return isFinite(det) ? [
      [A / invDet, D / invDet, G / invDet],
      [B / invDet, E / invDet, H / invDet],
      [C / invDet, F / invDet, I / invDet]
    ] : null;
  };

  return performanceTest(
    'Calc inverse matrix',
    [func1, func2],
    { time: 300 }
  );
}

const matrixMultiplyVector = () => {
  // LMS_2_LAB
  const mat = [
    [0.2104542553, 0.7936177850, -0.0040720468],
    [1.9779984951, -2.4285922050, 0.4505937099],
    [0.0259040371, 0.7827717662, -0.8086757660],
  ];
  const vec = [5.4213183, 23.944321, 99.1234312];

  const func1 = () => {
    const row1 = mat[0];
    const row2 = mat[1];
    const row3 = mat[2];
    let i = 0;
    let x = 0, y = 0, z = 0;
    let linear;
    for (; i < 3;) {
      linear = vec[i];
      // Same as `dot3(rgb2xyzMat[number], linearRgb)`
      x += row1[i] * linear;
      y += row2[i] * linear;
      z += row3[i++] * linear;
    }
    return [x, y, z];
  };

  const func2 = () => {
    return [
      dot3(mat[0], vec),
      dot3(mat[1], vec),
      dot3(mat[2], vec),
    ];
  };

  return performanceTest(
    'Matrix x vector',
    [func1, func2],
    { time: 500 }
  );
};

const fns = [
  randPositiveInt,
  rounding,
  clip,
  rad2deg,
  atan2,
  elementwiseMean,
  power_,
  invertMat3x3_,
  matrixMultiplyVector,
];
for (const fn of fns) {
  await fn();
}
