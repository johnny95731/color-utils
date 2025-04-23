import { l2Dist } from '../numeric';
import { hex2rgb } from './hex';

export const namedColor = new Map(Object.entries({
  'RosyBrown': 'BC8F8F',
  'IndianRed': 'CD5C5C',
  'Brown': 'A52A2A',
  'FireBrick': 'B22222',
  'LightCoral': 'F08080',
  'Maroon': '800000',
  'DarkRed': '8B0000',
  'Red': 'FF0000',
  'Snow': 'FFFAFA',
  'MistyRose': 'FFE4E1',
  'Salmon': 'FA8072',
  'Tomato': 'FF6347',
  'DarkSalmon': 'E9967A',
  'Coral': 'FF7F50',
  'OrangeRed': 'FF4500',
  'LightSalmon': 'FFA07A',
  'Sienna': 'A0522D',
  'SeaShell': 'FFF5EE',
  'Chocolate': 'D2691E',
  'SaddleBrown': '8B4513',
  'SandyBrown': 'F4A460',
  'PeachPuff': 'FFDAB9',
  'Peru': 'CD853F',
  'Linen': 'FAF0E6',
  'Bisque': 'FFE4C4',
  'Darkorange': 'FF8C00',
  'BurlyWood': 'DEB887',
  'AntiqueWhite': 'FAEBD7',
  'Tan': 'D2B48C',
  'NavajoWhite': 'FFDEAD',
  'BlanchedAlmond': 'FFEBCD',
  'PapayaWhip': 'FFEFD5',
  'Moccasin': 'FFE4B5',
  'Orange': 'FFA500',
  'Wheat': 'F5DEB3',
  'OldLace': 'FDF5E6',
  'FloralWhite': 'FFFAF0',
  'DarkGoldenRod': 'B8860B',
  'GoldenRod': 'DAA520',
  'Cornsilk': 'FFF8DC',
  'Gold': 'FFD700',
  'LemonChiffon': 'FFFACD',
  'Khaki': 'F0E68C',
  'PaleGoldenRod': 'EEE8AA',
  'DarkKhaki': 'BDB76B',
  'Beige': 'F5F5DC',
  'LightGoldenRodYellow': 'FAFAD2',
  'Olive': '808000',
  'Yellow': 'FFFF00',
  'LightYellow': 'FFFFE0',
  'Ivory': 'FFFFF0',
  'OliveDrab': '6B8E23',
  'YellowGreen': '9ACD32',
  'DarkOliveGreen': '556B2F',
  'GreenYellow': 'ADFF2F',
  'Chartreuse': '7FFF00',
  'LawnGreen': '7CFC00',
  'DarkSeaGreen': '8FBC8F',
  'ForestGreen': '228B22',
  'LimeGreen': '32CD32',
  'LightGreen': '90EE90',
  'PaleGreen': '98FB98',
  'DarkGreen': '006400',
  'Green': '008000',
  'Lime': '00FF00',
  'HoneyDew': 'F0FFF0',
  'SeaGreen': '2E8B57',
  'MediumSeaGreen': '3CB371',
  'SpringGreen': '00FF7F',
  'MintCream': 'F5FFFA',
  'MediumSpringGreen': '00FA9A',
  'MediumAquaMarine': '66CDAA',
  'Aquamarine': '7FFFD4',
  'Turquoise': '40E0D0',
  'LightSeaGreen': '20B2AA',
  'MediumTurquoise': '48D1CC',
  'DarkSlateGray': '2F4F4F',
  'PaleTurquoise': 'AFEEEE',
  'Teal': '008080',
  'DarkCyan': '008B8B',
  'Cyan': '00FFFF',
  'LightCyan': 'E0FFFF',
  'Azure': 'F0FFFF',
  'DarkTurquoise': '00CED1',
  'CadetBlue': '5F9EA0',
  'PowderBlue': 'B0E0E6',
  'LightBlue': 'ADD8E6',
  'DeepSkyBlue': '00BFFF',
  'SkyBlue': '87CEEB',
  'LightSkyBlue': '87CEFA',
  'SteelBlue': '4682B4',
  'AliceBlue': 'F0F8FF',
  'DodgerBlue': '1E90FF',
  'SlateGray': '708090',
  'LightSlateGray': '778899',
  'LightSteelBlue': 'B0C4DE',
  'CornflowerBlue': '6495ED',
  'RoyalBlue': '4169E1',
  'MidnightBlue': '191970',
  'Lavender': 'E6E6FA',
  'Navy': '000080',
  'RebeccaPurple': '663399',
  'DarkBlue': '00008B',
  'MediumBlue': '0000CD',
  'Blue': '0000FF',
  'GhostWhite': 'F8F8FF',
  'SlateBlue': '6A5ACD',
  'DarkSlateBlue': '483D8B',
  'MediumSlateBlue': '7B68EE',
  'MediumPurple': '9370D8',
  'BlueViolet': '8A2BE2',
  'Indigo': '4B0082',
  'DarkOrchid': '9932CC',
  'DarkViolet': '9400D3',
  'MediumOrchid': 'BA55D3',
  'Thistle': 'D8BFD8',
  'Plum': 'DDA0DD',
  'Violet': 'EE82EE',
  'Purple': '800080',
  'DarkMagenta': '8B008B',
  'Magenta': 'FF00FF',
  'Orchid': 'DA70D6',
  'MediumVioletRed': 'C71585',
  'DeepPink': 'FF1493',
  'HotPink': 'FF69B4',
  'PaleVioletRed': 'D87093',
  'LavenderBlush': 'FFF0F5',
  'Crimson': 'DC143C',
  'Pink': 'FFC0CB',
  'LightPink': 'FFB6C1',
  'White': 'FFFFFF',
  'WhiteSmoke': 'F5F5F5',
  'Gainsboro': 'DCDCDC',
  'LightGrey': 'D3D3D3',
  'Silver': 'C0C0C0',
  'DarkGray': 'A9A9A9',
  'Gray': '808080',
  'DimGray': '696969',
  'Black': '000000'
}));

/**
 * Add a white space before capital letters except the first letter.
 */
export const unzipCssNamed = (name: string) => name.replace(/([A-Z])/g, ' $1').trim();

/**
 * All names of CSS <named-color> (removed synonym name) with sapce between words.
 */
export const unzipedNameList: string[] = [];

const cacheNameRgb: [string, number[]][] = [];

namedColor.forEach((hex, name) => {
  unzipedNameList.push(unzipCssNamed(name));
  cacheNameRgb.push([name, hex2rgb(hex)]);
});

/**
 * Find the closet named-color.
 */
export const getClosestNamed = (
  rgb: number[]
): string => {
  let minDist = Infinity;
  let dist: number;
  let closest;
  for (let i = 0; i < cacheNameRgb.length; i++) {
    dist = l2Dist(rgb, cacheNameRgb[i][1]);
    if (dist < minDist) {
      closest = cacheNameRgb[i][0];
      minDist = dist;
    }
  }
  // @ts-expect-error `minDist` is init to be `Infinity`. Thus closest will be assigned value.
  return closest;
};

export const getNamedRgb = (name: string) => {
  return hex2rgb(namedColor.get(name) ?? 'black');
};
