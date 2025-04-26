import typescript from '@rollup/plugin-typescript';
import terser from './terser-plugin.ts';
import watchConfig, { outDir, input, terserOption } from './rollup.config.watch.ts';
import type { RollupOptions } from 'rollup';


const config = [
  ...watchConfig,
  {
    input,
    plugins: [
      terser([outDir], terserOption),
      typescript(),
    ],
    treeshake: false,
    output: {
      dir: outDir,
      entryFileNames: '[name].cjs',
      format: 'cjs',
      generatedCode: {
        constBindings: true
      },
    },
  },
] satisfies RollupOptions[];
export default config;
