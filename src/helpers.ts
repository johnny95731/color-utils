export type DeepReadonly<T> = Readonly<{
  [K in keyof T]:
  // Is it a primitive? Then make it readonly
  T[K] extends (number | string | symbol) ? Readonly<T[K]>
    // Is it an array of items? Then make the array readonly and the item as well
    : T[K] extends Array<infer A> ? Readonly<Array<DeepReadonly<A>>>
    // It is some other object, make it readonly as well
      : DeepReadonly<T[K]>;
}>;
export type DeepWriteable<T> = {
  -readonly [P in keyof T]: DeepWriteable<T[P]>
};
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
    }
    else if (obj instanceof Date) {
      result = new Date(obj);
    }
    else if (typeof obj === 'object') {
      result = {} as T;
      for (const key in obj) {
        // @ts-expect-error
        result[key] = cloneDeep(obj[key]);
      }
    }
    else {
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
  ): R[]
  /**
   * Similar to Array.prototype.map but this can control the length of output array .
   */
  <R, T extends readonly unknown[]>(
    arr: T,
    callback: (val: T[number], i: number) => R,
    len?: number,
  ): R[]
};
export const map: map = <R, T extends readonly unknown[]>(
  arr: number | T,
  callback:
    typeof arr extends number
      ? ((i: number) => R)
      : ((val: T[number], i: number) => R),
  len?: number,
): R[] => {
  // @ts-expect-error
  const result = Array(len ??= (arr.length ?? arr));
  let i = 0;
  if (typeof arr === 'number') {
    for (; i < arr;) {
      // @ts-expect-error
      result[i] = callback(i++);
    }
  }
  else {
    for (; i < len!;) {
      // @ts-expect-error
      result[i] = callback(arr[i], i++);
    }
  }
  return result;
};

/**
 * Normalize a option or an index to a option in list.
 * @param value The input value to resolve. Can be a string or an index number.
 * @param list Valid options.
 * @param defaults Default value.
 * @returns A value in list.
 */
export const normalizeOption = <T extends readonly string[]>(
  value: T[number] | number,
  list: T,
  defaults: T[number] = list[0],
): T[number] => {
  if (typeof value === 'number') value = list[value];
  if (!value) value = defaults;
  return value;
};
