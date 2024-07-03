import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import { dts } from 'rollup-plugin-dts';

import pkg from './package.json';

const banner = `/* @license ${pkg.name} v${pkg.version} */`;

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        format: 'cjs',
        file: pkg.main,
        sourcemap: true,
        banner,
      },
      {
        format: 'esm',
        file: pkg.module,
        sourcemap: true,
        banner,
      },
    ],
    external: [...Object.keys(pkg.peerDependencies ?? {})],
    plugins: [
      resolve({
        extensions: ['.ts', '.js'],
      }),
      commonjs({
        include: /node_modules/,
        ignoreDynamicRequires: true,
      }),
      replace({
        'process.env.NODE_ENV': JSON.stringify('production'),
        preventAssignment: true,
      }),
      typescript({
        tsconfig: './tsconfig.json',
        compilerOptions: { noEmit: true },
        noForceEmit: true,
      }),
      babel({
        exclude: /node_modules/,
        extensions: ['.js', '.ts'],
        babelHelpers: 'bundled',
        presets: ['@babel/preset-env', '@babel/preset-typescript'],
      }),
      terser(),
    ],
  },
  {
    input: 'src/index.ts',
    output: [{ file: pkg.types, format: 'es' }],
    plugins: [dts()],
  },
];
