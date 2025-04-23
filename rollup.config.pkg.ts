import typescript from '@rollup/plugin-typescript';
import terser from './terser-plugin.ts';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import type { RollupOptions } from 'rollup';

// To see the package size

const outDir = 'dist-pkg/';

const terserOption = {
  compress: {
    toplevel: false,
    unused: true,
  }
};


const config = [
  {
    input: {
      colord: './colord.pkg.ts',
      color: 'color',
      'color-convert': 'color-convert'
    },
    plugins: [
      nodeResolve(),
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
  }
] satisfies RollupOptions[];
export default config;
