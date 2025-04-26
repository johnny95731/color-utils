export type DeepWriteable<T> = { -readonly [P in keyof T]: DeepWriteable<T[P]> };
export const cloneDeep = <T>(obj: T): DeepWriteable<T> => {
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
      for (const val of obj) result.push(cloneDeep(val));
    } else if (obj instanceof Date) {
      result = new Date(obj);
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

  // @ts-expect-error
  return result;
};

type map = {
  /**
   * Generate an array with specific length.
   */
  <R>(
    len: number,
    callback: (i: number) => R
  ): R[];
  /**
   * Similar to Array.prototype.map but this can control the length of output array .
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
      ((i: number) => R) :
      ((val: T, i: number) => R),
  len?: number,
): R[] => {
  const result = [];
  let i = 0;
  if (typeof arr === 'number') {
    for (; i < arr;) {
      // @ts-expect-error
      result.push(callback(i++));
    }
  } else {
    len ??= arr.length;
    for (; i < len;) {
      result.push(callback(arr[i], i++));
    }
  }
  return result;
};
