import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import external from 'rollup-plugin-peer-deps-external';
import dts from 'rollup-plugin-dts';
import visualizer from 'rollup-plugin-visualizer';
import license from 'rollup-plugin-license';
import del from 'rollup-plugin-delete';
import scss from 'rollup-plugin-scss';
import { terser } from 'rollup-plugin-terser';
import copy from 'rollup-plugin-copy';
// import typescript from 'typescript'
import ts from 'rollup-plugin-typescript2';
const packageJson = require('./widgets/package.json');
const moduleName = packageJson.name.replace('@', '').replace('/', '-');
const outputFolderRootPath = './packages/node_modules/@webex/widgets/';
// const packageJson = require('./packages/node_modules/@webex/widgets');


export default [
  {
    input: packageJson.source,
    output: [
      {
        file: packageJson.main,
        format: 'cjs',
        sourcemap: true,
        name: moduleName,
      },
      {
        file: `${packageJson.main.slice(0, -3)}.min.js`,
        format: 'cjs',
        sourcemap: true,
        plugins: [terser()],
      },
      {
        file: packageJson.module,
        format: 'esm',
        sourcemap: true,
      },
      {
        file: `${packageJson.module.slice(0, -3)}.min.js`,
        format: 'esm',
        sourcemap: true,
        plugins: [terser()],
      },
    ],
    plugins: [
      del({ targets: outputFolderRootPath + 'dist/*' }),
      external(),
      resolve({
        browser: true,
      }),
      commonjs(),
      // ts({
      //   typescript
      // }),
      typescript({
        tsconfig: './tsconfig.json',
        outputToFilesystem: true,
      }),
      scss({
        output: outputFolderRootPath + `dist/css/${moduleName}.css`,
        failOnError: true,
      }),
      copy({
        targets: [
          { src: 'src/localization/locales', dest: outputFolderRootPath + 'dist/cjs/' },
          {
            src: 'src/localization/locales',
            dest: outputFolderRootPath + 'dist/esm/',
          },
        ],
      }),
      license({
        banner: `
        Webex Calling
        Copyright (c) <%= new Date().toISOString() %> Cisco Systems, Inc and its affiliates.
        This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
        `,
      }),
      visualizer({
        filename: 'coverage/bundle-analysis-esm.html',
        title: 'Webex Calling Components ESM Bundle Analysis',
      }),
    ],
  },
  /* Rollup Types */
  {
    input: outputFolderRootPath + 'dist/esm/src/index.d.ts',
    output: [{ file: outputFolderRootPath + 'dist/index.d.ts', format: 'esm' }],
    external: [/\.css$/, /\.scss$/],
    plugins: [dts()],
  },
];
