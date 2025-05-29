import { rgb2xyz, xyz2rgb } from './ciexyz';
import { lcc2lch, lch2lcc } from './lch';

/**
 * Convert RGB to Oklab.
 * @param rgb RGB color array.
 * @return Oklab color array.
 */
export const rgb2oklab = (rgb: readonly number[]) => {
  const xyz = rgb2xyz(rgb);
  const x = xyz[0];
  const y = xyz[1];
  const z = xyz[2];
  // To lms (temporary state)
  const l = Math.cbrt(8.189330101e-3 * x + 3.618667424e-3 * y + -1.288597137e-3 * z);
  const m = Math.cbrt(0.329845436e-3 * x + 9.293118715e-3 * y +  0.361456387e-3 * z);
  const s = Math.cbrt(0.482003018e-3 * x + 2.643662691e-3 * y +  6.338517070e-3 * z);
  // To oklab
  return [
    0.2104542553 * l +  0.7936177850 * m + -0.0040720468 * s,
    1.9779984951 * l + -2.4285922050 * m +  0.4505937099 * s,
    0.0259040371 * l +  0.7827717662 * m + -0.8086757660 * s
  ];
};
/**
 * Convert Oklab to RGB.
 * @param oklab Oklab color array.
 * @return RGB color array.
 */
export const oklab2rgb = (oklab: readonly number[]) => {
  const l = oklab[0];
  const a = oklab[1];
  const b = oklab[2];
  // To lms (temporary state)
  let l_ = 0.9999999984505199 * l +  0.39633779217376786 * a +  0.2158037580607588 * b;
  let m_ = 1.0000000088817607 * l + -0.10556134232365634 * a + -0.0638541747717059 * b;
  let s_ = 1.000000054672411  * l + -0.08948418209496577 * a + -1.291485537864092  * b;
  l_ *= l_ * l_;
  m_ *= m_ * m_;
  s_ *= s_ * s_;
  // to XYZ
  const xyz = [
    122.70138511035211 * l_ + -55.77999806518222 * m_ + 28.12561489664678  * s_,
    -4.058017842328059 * l_ +  111.225686961683  * m_ + -7.167667866560119 * s_,
    -7.63812845057069  * l_ + -42.14819784180127 * m_ + 158.6163220440795  * s_,
  ];
  return xyz2rgb(xyz);
};

/**
 * Convert RGB to Oklch.
 * @param rgb RGB color array.
 * @return Oklch color array.
 */
export const rgb2oklch = (rgb: readonly number[]) => {
  return lcc2lch(rgb2oklab(rgb));
};


/**
 * Convert Oklch to RGB.
 * @param oklch Oklch color array.
 * @return RGB color array.
 */
export const oklch2rgb = (oklch: readonly number[]) => {
  return oklab2rgb(lch2lcc(oklch));
};
