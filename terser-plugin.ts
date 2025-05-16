import { minify } from 'terser';
import merge from 'lodash-es/merge.js';
import type {  Plugin } from 'rollup';
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


export default (options: MinifyOptions) => {
  const mergedOption = merge({}, defaultOptions, options);
  return {
    name: 'terser',
    renderChunk: {
      order: 'post',
      async handler(code) {
        const result = await minify(code, mergedOption);
        return {
          code: result.code!
        };
      },
    }
  } satisfies Plugin;
};
