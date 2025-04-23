import * as fs  from 'fs';
import { minify } from 'terser';
import merge from 'lodash-es/merge.js';
import type { Plugin } from 'rollup';
import type { MinifyOptions } from 'terser';

const defaultOptions = {
  compress: {
    toplevel: true,
  },
  mangle: {
    toplevel: true,
    properties: {
      regex: /[^_]_$/
    }
  },
  nameCache: undefined
} satisfies MinifyOptions;


export default (
  outDir = ['./dist'],

  options: MinifyOptions
) => {
  const mergedOption = merge({}, defaultOptions, options);
  return {
    name: 'terser',
    closeBundle: {
      order: 'post',
      sequential: true,
      async handler() {
        for (const path of outDir) {
          const files = (fs.readdirSync(path) as string[])
            .filter((filename) => /\.(js|mjs|cjs )$/.test(filename));
          for (const filename of files) {
            const filePath = `${path}/${filename}`;
            const code = fs.readFileSync(filePath, 'utf-8');
            const result = await minify(code, mergedOption);
            if (result.code) fs.writeFileSync(filePath, result.code, 'utf8');
          }
        }
      },
    },
  } satisfies Plugin;
};
