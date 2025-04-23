export type DeepWriteable<T> = { -readonly [P in keyof T]: DeepWriteable<T[P]> };
export const cloneDeep = <T>(obj: T, cloneCustom: boolean = false): DeepWriteable<T> => {
  let result;

  if (obj == null) result = obj;
  else {
    [Number, String, Boolean].forEach((type) => {
      if (obj instanceof type) {
        result = type(obj);
      }
    });
  }

  if (result === undefined) {
    if (Array.isArray(obj)) {
      result = [];
      reduce(obj, (_, val, i) => result[i] = cloneDeep(val));
    } else if (obj instanceof Date) {
      result = new Date(obj);
      // @ts-expect-error
    } else if (obj.constructor) {
      // @ts-expect-error
      result = cloneCustom ? obj.constructor() : obj;
    } else if (typeof obj === 'object') {
      result = {} as T;
      for (const key in obj) {
        // @ts-expect-error
        result[key] = cloneDeep(obj[key]);
      }
    } else {
      result = obj;
    }
  }

  return result;
};

type map = {
  /**
   * Generate an array with specific length.
   * Faster than Array.prototype.map about 10%-15% on node v22.11.0 if the
   * first argument is a number.
   */
  <R>(
    len: number,
    callback: (val: null, i: number) => R
  ): R[];
  /**
   * Similar to Array.prototype.map but this can control the length of
   * output array .
   *
   * Note that `arr.map` is about 3% faster than this in Node.js v22.11.0.
   */
  <R, T>(
    arr: readonly T[],
    callback: (val: T, i: number) => R,
    len?: number,
  ): R[]
}
export const map: map = <R, T>(
  arr: number | readonly T[],
  callback:
    typeof arr extends number ?
      ((val: null, i: number) => R) :
      ((val: T, i: number) => R),
  len?: number,
): R[] => {
  const result = [];
  let i = 0;
  if (typeof arr === 'number') {
    for (; i < arr;) {
      // @ts-expect-error
      result.push(callback(null, i++));
    }
  } else {
    len ??= arr.length;
    for (; i < len;) {
      result.push(callback(arr[i], i++));
    }
  }
  return result;
};


type reduce = {
  <R>(
    len: number,
    callback: (acc: R, val: null, i: number) => R,
    init?: R,
    _?: number
  ): R;
  <R, T extends string>(
    arr: T,
    callback: (acc: R, val: T, i: number) => R,
    init?: R,
    len?: number,
  ): R;
  <R, T>(
    arr: readonly T[],
    callback: (acc: R, val: T, i: number) => R,
    init?: R,
    len?: number,
  ): R;
}

/**
 * Same as Array.prototype.reduce but with for-loop.
 * Default to have same length as arr.
 *
 * The performance (ops/sec) is slightly better than prototype method (less
 * than 5%). But this function can specify the length of returned array.
 * @param arr Array
 * @param callback Callback function.
 * @param init Initial value
 * @param len Length of returened
 * @returns
 */
export const reduce: reduce = <R, T>(
  arr: readonly T[] | string | number,
  callback:
    typeof arr extends number ?
      ((acc: R, val: null, i: number) => R) :
      ((acc: R, val: T, i: number) => R),
  init?: R,
  len?: number,
): R => {
  let s = init;
  let i = 0;
  if (typeof arr === 'number') {
    for (; i < arr;) {
      // @ts-expect-error
      s = callback(s, null, i++);
    }
  } else {
    len ??= arr.length;
    for (; i < len;) {
      // @ts-expect-error
      s = callback(s, arr[i], i++);
    }
  }
  // @ts-expect-error
  return s;
};

export * from './numeric';
