import { l2Dist3 } from '../numeric';


export const namedColor = new Map(Object.entries({
  rosybrown: [188, 143, 143],
  indianred: [205, 92, 92],
  brown: [165, 42, 42],
  firebrick: [178, 34, 34],
  lightcoral: [240, 128, 128],
  maroon: [128, 0, 0],
  darkred: [139, 0, 0],
  red: [255, 0, 0],
  snow: [255, 250, 250],
  mistyrose: [255, 228, 225],
  salmon: [250, 128, 114],
  tomato: [255, 99, 71],
  darksalmon: [233, 150, 122],
  coral: [255, 127, 80],
  orangered: [255, 69, 0],
  lightsalmon: [255, 160, 122],
  sienna: [160, 82, 45],
  seashell: [255, 245, 238],
  chocolate: [210, 105, 30],
  saddlebrown: [139, 69, 19],
  sandybrown: [244, 164, 96],
  peachpuff: [255, 218, 185],
  peru: [205, 133, 63],
  linen: [250, 240, 230],
  bisque: [255, 228, 196],
  darkorange: [255, 140, 0],
  burlywood: [222, 184, 135],
  antiquewhite: [250, 235, 215],
  tan: [210, 180, 140],
  navajowhite: [255, 222, 173],
  blanchedalmond: [255, 235, 205],
  papayawhip: [255, 239, 213],
  moccasin: [255, 228, 181],
  orange: [255, 165, 0],
  wheat: [245, 222, 179],
  oldlace: [253, 245, 230],
  floralwhite: [255, 250, 240],
  darkgoldenrod: [184, 134, 11],
  goldenrod: [218, 165, 32],
  cornsilk: [255, 248, 220],
  gold: [255, 215, 0],
  lemonchiffon: [255, 250, 205],
  khaki: [240, 230, 140],
  palegoldenrod: [238, 232, 170],
  darkkhaki: [189, 183, 107],
  beige: [245, 245, 220],
  lightgoldenrodyellow: [250, 250, 210],
  olive: [128, 128, 0],
  yellow: [255, 255, 0],
  lightyellow: [255, 255, 224],
  ivory: [255, 255, 240],
  olivedrab: [107, 142, 35],
  yellowgreen: [154, 205, 50],
  darkolivegreen: [85, 107, 47],
  greenyellow: [173, 255, 47],
  chartreuse: [127, 255, 0],
  lawngreen: [124, 252, 0],
  darkseagreen: [143, 188, 143],
  forestgreen: [34, 139, 34],
  limegreen: [50, 205, 50],
  lightgreen: [144, 238, 144],
  palegreen: [152, 251, 152],
  darkgreen: [0, 100, 0],
  green: [0, 128, 0],
  lime: [0, 255, 0],
  honeydew: [240, 255, 240],
  seagreen: [46, 139, 87],
  mediumseagreen: [60, 179, 113],
  springgreen: [0, 255, 127],
  mintcream: [245, 255, 250],
  mediumspringgreen: [0, 250, 154],
  mediumaquamarine: [102, 205, 170],
  aquamarine: [127, 255, 212],
  turquoise: [64, 224, 208],
  lightseagreen: [32, 178, 170],
  mediumturquoise: [72, 209, 204],
  darkslategray: [47, 79, 79],
  paleturquoise: [175, 238, 238],
  teal: [0, 128, 128],
  darkcyan: [0, 139, 139],
  cyan: [0, 255, 255],
  lightcyan: [224, 255, 255],
  azure: [240, 255, 255],
  darkturquoise: [0, 206, 209],
  cadetblue: [95, 158, 160],
  powderblue: [176, 224, 230],
  lightblue: [173, 216, 230],
  deepskyblue: [0, 191, 255],
  skyblue: [135, 206, 235],
  lightskyblue: [135, 206, 250],
  steelblue: [70, 130, 180],
  aliceblue: [240, 248, 255],
  dodgerblue: [30, 144, 255],
  slategray: [112, 128, 144],
  lightslategray: [119, 136, 153],
  lightsteelblue: [176, 196, 222],
  cornflowerblue: [100, 149, 237],
  royalblue: [65, 105, 225],
  midnightblue: [25, 25, 112],
  lavender: [230, 230, 250],
  navy: [0, 0, 128],
  rebeccapurple: [102, 51, 153],
  darkblue: [0, 0, 139],
  mediumblue: [0, 0, 205],
  blue: [0, 0, 255],
  ghostwhite: [248, 248, 255],
  slateblue: [106, 90, 205],
  darkslateblue: [72, 61, 139],
  mediumslateblue: [123, 104, 238],
  mediumpurple: [147, 112, 216],
  blueviolet: [138, 43, 226],
  indigo: [75, 0, 130],
  darkorchid: [153, 50, 204],
  darkviolet: [148, 0, 211],
  mediumorchid: [186, 85, 211],
  thistle: [216, 191, 216],
  plum: [221, 160, 221],
  violet: [238, 130, 238],
  purple: [128, 0, 128],
  darkmagenta: [139, 0, 139],
  magenta: [255, 0, 255],
  orchid: [218, 112, 214],
  mediumvioletred: [199, 21, 133],
  deeppink: [255, 20, 147],
  hotpink: [255, 105, 180],
  palevioletred: [216, 112, 147],
  lavenderblush: [255, 240, 245],
  crimson: [220, 20, 60],
  pink: [255, 192, 203],
  lightpink: [255, 182, 193],
  white: [255, 255, 255],
  whitesmoke: [245, 245, 245],
  gainsboro: [220, 220, 220],
  lightgray: [211, 211, 211],
  silver: [192, 192, 192],
  darkgray: [169, 169, 169],
  gray: [128, 128, 128],
  dimgray: [105, 105, 105],
  black: [0, 0, 0],
}));

/**
 * Find the closet named-color. The alpha channel is omitted.
 * @param rgb RGB color array.
 * @return CSS \<named-color\> value.
 */
export const rgb2named = (
  rgb: readonly number[],
): string => {
  let minDist = Infinity;
  let dist: number;
  let closest;
  for (const [name, namedRgb] of namedColor) {
    dist = l2Dist3(rgb, namedRgb);
    if (dist < minDist) {
      closest = name;
      minDist = dist;
    }
  }
  // @ts-expect-error `minDist` is init to be `Infinity`. Thus closest will be assigned value.
  return closest;
};

/**
 * Return a RGB color of a CSS \<named-color\>.
 * @param name CSS \<named-color\> value. The input string is case insensitive.
 * If the input is invalid, return RGB of black.
 * @return RGB color array.
 */
export const named2rgb = (name: string) => {
  let rgb = namedColor.get(name.toLowerCase());
  if (rgb === undefined) rgb = [0, 0, 0, 1];
  else rgb[3] = 1;
  return rgb;
};
