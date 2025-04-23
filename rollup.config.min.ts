import typescript from '@rollup/plugin-typescript';
import terser from './terser-plugin.ts';
import type { RollupOptions } from 'rollup';

// Too see minimum size in one-file bundleing

const outDir = 'dist-min/';

const terserOption = {
  compress: {
    toplevel: false,
    unused: true,
  },
};

const terserOption2 = {
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
      terser([outDir], terserOption),
      typescript(),
    ],
    treeshake: false,
    output: {
      name: 'minified',
      file: `${outDir}min-mangle-size-test.js`,
      format: 'es',
      generatedCode: {
        constBindings: true
      }
    },
  },
  {
    input: 'index.min.ts',
    plugins: [
      terser([outDir], terserOption2),
      typescript(),
    ],
    treeshake: false,
    output: {
      name: 'minified',
      file: `${outDir}min-nonmangle-size-test.js`,
      format: 'es',
      generatedCode: {
        constBindings: true
      }
    },
  }
] as RollupOptions[];
export default config;
