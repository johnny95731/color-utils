import { expect, test } from '@jest/globals';

import { cloneDeep, map } from '../../dist/index.js';


test('cloneDeep', () => {
  const primitive = [
    new Number(0),
    new String('str'),
    new Boolean(1),
    null,
    undefined,
  ];
  primitive.forEach((val) => {
    expect(cloneDeep(val)).toBe(val?.valueOf ? val.valueOf() : val);
  });

  const date = new Date();
  expect(cloneDeep(date)).toStrictEqual(date);

  const obj = {
    a: 1,
    b: Symbol('0'),
    c: { aa: 1, b: [123], c: new Date() },
    d: new Date(123),
    e: NaN,
  };
  expect(cloneDeep(obj)).toStrictEqual(obj);
});


test('map', () => {
  expect(map(3, i => i)).toStrictEqual([...Array(3)].map((_, i) => i));

  const arr = [4, 5, 9, 8];
  expect(map(arr, (val, i) => val + i)).toStrictEqual(
    arr.map((val, i) => val + i),
  );
});
