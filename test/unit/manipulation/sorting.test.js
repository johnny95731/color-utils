import { expect, test } from '@jest/globals';
import { diffLuminance, distE00, distE76, distE94, randInt, randRgbGen, rgb2gray, rgb2lab, shuffle, SORTING_ACTIONS, sortRgbs, tspGreedy } from '../../../dist/index.js';

test('diffLuminance', () => {
  for (let i = 0; i < 20; i++) {
    const rgb1 = randRgbGen();
    const rgb2 = randRgbGen();

    const ret = diffLuminance(rgb1, rgb2);
    expect(ret).toBeCloseTo(rgb2gray(rgb1) - rgb2gray(rgb2));
  }
});

test('shuffle', () => {
  for (let i = 0; i < 20; i++) {
    const vals = [...Array(randInt(10)+1)].map((_, i) => i);

    const ret = shuffle(vals);
    expect(ret).toHaveLength(vals.length);
    vals.forEach((val) => {
      expect(ret).toContain(val);
    });
  }
});

test('tspGreedy', () => {
  for (let i = 0; i < 20; i++) {
    let rgbs = [
      [0, 0, 0],
      [255, 255, 255],
    ];
    const num = randInt(8) + 2;
    for (let j = rgbs.length; j < num; j++) {
      rgbs.splice(1, 0, randRgbGen());
    }

    const op = distE76;
    const ret = tspGreedy(rgbs, (rgb) => rgb, op, true);

    expect(ret).toHaveLength(rgbs.length);
    rgbs.forEach((rgb) => {
      expect(ret).toContainEqual(rgb);
      expect(ret).not.toContain(rgb);
    });

    expect(ret[0]).toStrictEqual(rgbs[0]);

    const retLabs = ret.map(rgb => rgb2lab(rgb));
    // Next color is closest.
    retLabs.slice(0, num - 1).forEach((current, i) => {
      const minDiff = op(current, retLabs[i+1]);

      retLabs.slice(i + 2).forEach((other) => {
        expect(op(current, other)).toBeGreaterThanOrEqual(minDiff);
      });
    });
  }
});

test('sortRgbs', () => {
  for (let i = 0; i < 20; i++) {
    let rgbs = [
      [0, 0, 0],
      [255, 255, 255],
    ];
    const num = randInt(8) + 2;
    for (let j = rgbs.length; j < num; j++) {
      rgbs.splice(1, 0, randRgbGen());
    }

    SORTING_ACTIONS.forEach((key, i) => {
      const ret = sortRgbs(rgbs, key);
      expect(ret).toHaveLength(rgbs.length);
      rgbs.forEach((rgb) => {
        expect(ret).toContainEqual(rgb);
      });
      if (key === 'random') return;

      expect(ret).toStrictEqual(sortRgbs(rgbs, i));

      if (key === 'reversion') {
        rgbs.forEach((_, i) => {
          expect(ret[i]).toStrictEqual(rgbs[num - 1 - i]);
        });
        return;
      }

      expect(ret[0]).toStrictEqual(rgbs[0]);
      if (key === 'luminance') {
        expect(ret[num-1]).toStrictEqual(rgbs[num-1]);
      } else {
        let op;
        if (key === SORTING_ACTIONS[3]) op = distE76;
        else if (key === SORTING_ACTIONS[4]) op = distE94;
        else op = distE00;

        const retLabs = ret.map(rgb => rgb2lab(rgb));
        // Next color is closest.
        retLabs.slice(0, num - 1).forEach((current, i) => {
          const minDiff = op(current, retLabs[i+1]);

          retLabs.slice(i + 2).forEach((other) => {
            expect(op(current, other)).toBeGreaterThanOrEqual(minDiff);
          });
        });
      }
    });
  }
});
