import typescript from '@rollup/plugin-typescript';
import terser from './terser-plugin.ts';
import type { RollupOptions } from 'rollup';

// Too see minimum size in one-file bundleing

const outDir = 'dist-min/';

const terserMangleProps = {
  compress: {
    toplevel: false,
    unused: true,
  },
};

const terserNoMangleProps = {
  compress: {
    toplevel: false,
    unused: true,
  },
  mangle: {
    keep_fnames: false,
    properties: false
  },
  nameCache: undefined,
};

const config = [
  {
    input: 'index.min.ts',
    plugins: [
      terser([outDir], terserMangleProps),
      typescript(),
    ],
    treeshake: false,
    output: {
      name: 'minified',
      file: `${outDir}mangle-size.js`,
      format: 'es',
    },
  },
  {
    input: 'conversions.min.ts',
    plugins: [
      terser([outDir], terserNoMangleProps),
      typescript(),
    ],
    treeshake: false,
    output: {
      name: 'conversinons',
      file: `${outDir}conversions-size.js`,
      format: 'es',
    },
  },
  {
    input: 'index.min.ts',
    plugins: [
      terser([outDir], terserNoMangleProps),
      typescript(),
    ],
    treeshake: false,
    output: {
      name: 'minified2',
      file: `${outDir}no-nmangle-size.js`,
      format: 'es',
    },
  },
] as RollupOptions[];
export default config;
