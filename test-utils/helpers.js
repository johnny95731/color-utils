/**
 * Return an array `arr` of increasing numbers in the range [`min`, `max`]
 * that `arr[i+1] - arr[i] = 1`.
 * @param {number} min
 * @param {number} max
 * @returns {number[]}
 */
export const range = (min, max) => {
  max++;
  const values = [];
  for (let i = min; i < max; i++) values.push(i);
  return values;
};

export const randInt = (max) => {
  return Math.random() * (max + 1) | 0;
};

export const randRgbGen = randAlpha => [
  randInt(255),
  randInt(255),
  randInt(255),
  randAlpha ? Math.random() : 1,
];

export const rgb2hex = (rgb) => {
  // `a << n` equals a * 2**n.
  // (1<<24).toString(16) convert to '1000000'. This will pad 0.
  const hex = '#' + (1 << 24 | rgb[0] << 16 | rgb[1] << 8 | rgb[2])
    .toString(16)
    .slice(1);
  return hex;
};


/**
 * @param {number[]} arr1
 * @param {number[]} arr2
 * @param {number} atol Default: `1e-3`. The absolute tolerance.
 * @returns {boolean}
 */
export const isSameColor = (arr1, arr2, atol = 1e-3) => {
  if (arr1.length !== arr2.length) return false;
  for (let i = 0; i < arr1.length; i++) {
    const diff = Math.abs(arr1[i] - arr2[i]);
    if (diff > atol || isNaN(diff)) return false;
  }
  return true;
};
