import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import { dts } from 'rollup-plugin-dts';

import pkg from './package.json';

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        format: 'cjs',
        file: pkg.main,
        sourcemap: true,
      },
      {
        format: 'esm',
        file: pkg.module,
        sourcemap: true,
      },
    ],
    plugins: [
      resolve({
        extensions: ['.ts', '.js'],
      }),
      commonjs(),
      replace({
        'process.env.NODE_ENV': JSON.stringify('production'),
        preventAssignment: true,
      }),
      terser(),
      typescript({ tsconfig: './tsconfig.json', outDir: './dist' }),
    ],
  },
  {
    input: 'src/index.ts',
    output: [{ file: pkg.types, format: 'es' }],
    plugins: [dts()],
  },
];
