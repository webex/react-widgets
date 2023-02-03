import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import external from 'rollup-plugin-peer-deps-external';
import del from 'rollup-plugin-delete';
import dts from 'rollup-plugin-dts';
import { terser } from 'rollup-plugin-terser';

const packageJson = require('./package.json');
const moduleName = packageJson.name.replace('@', '').replace('/', '-');

export default [
  {
    input: packageJson.source,
    output: [
      {
        file: packageJson.main,
        format: 'cjs',
        sourcemap: true,
        name: moduleName,
        globals: { rxjs: 'rxjs' },
      },
      {
        file: `${packageJson.main.slice(0, -3)}.min.js`,
        format: 'cjs',
        sourcemap: true,
        plugins: [terser()],
        globals: { rxjs: 'rxjs' },
      },
      {
        file: packageJson.module,
        format: 'esm',
        sourcemap: true,
        globals: { rxjs: 'rxjs' },
      },
      {
        file: `${packageJson.module.slice(0, -3)}.min.js`,
        format: 'esm',
        sourcemap: true,
        plugins: [terser()],
        globals: { rxjs: 'rxjs' },
      },
    ],
    external: [/rxjs/],
    plugins: [
      del({ targets: 'dist/*' }),
      external(),
      resolve(),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json',
        declarationDir: '.',
        outputToFilesystem: true,
      }),
    ],
  },
  {
    input: 'dist/esm/src/index.d.ts',
    output: [{ file: 'dist/index.d.ts', format: 'esm' }],
    external: [/\.css$/, /\.scss$/],
    plugins: [dts()],
  },
];
