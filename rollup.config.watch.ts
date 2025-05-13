import typescript from '@rollup/plugin-typescript';
import { dts } from 'rollup-plugin-dts';
import terser from './terser-plugin.ts';
import type { RollupOptions } from 'rollup';

export const outDir = 'dist/';
export const input = './index.ts';

export const terserOption = {
  compress: {
    toplevel: false,
    unused: true,
  },
  mangle: {
    keep_fnames: true,
    properties: false
  },
  nameCache: undefined,
};


const config = [
  {
    input,
    plugins: [
      terser([outDir], terserOption),
      typescript(),
    ],
    treeshake: false,
    output: {
      dir: outDir,
      format: 'es',
      generatedCode: {
        constBindings: true
      },
    },
  },
  {
    input,
    plugins: [
      dts({
        tsconfig: 'tsconfig.dts.json',
      }),
    ],
    treeshake: false,
    output: {
      dir: outDir,
      format: 'es',
    },
  },
] satisfies RollupOptions[];
export default config;
