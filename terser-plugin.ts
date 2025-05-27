import { minify } from 'terser';
import type {  Plugin } from 'rollup';
import type { MinifyOptions } from 'terser';

const isObject = (item: unknown) => {
  return (item && typeof item === 'object' && !Array.isArray(item));
};
// eslint-disable-next-line
const mergeDeep = (target: any, ...sources: any[]) => {
  if (!sources.length) return target;
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        mergeDeep(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }
  return mergeDeep(target, ...sources);
};


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
  const mergedOption = mergeDeep({}, defaultOptions, options);
  return {
    name: 'terser',
    renderChunk: {
      order: 'post',
      async handler(code, chunk) {
        if (!/(m|c)?js$/.test(chunk.fileName)) return;
        const result = await minify(code, mergedOption);
        console.log(result.code!.length + 1);
        return {
          code: result.code!
        };
      },
    }
  } satisfies Plugin;
};
