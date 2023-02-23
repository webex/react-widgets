// import resolve from '@rollup/plugin-node-resolve';
// import commonjs from '@rollup/plugin-commonjs';
// // import typescript from 'rollup-plugin-typescript2';
// import external from 'rollup-plugin-peer-deps-external';
// // import dts from 'rollup-plugin-dts';
// import visualizer from 'rollup-plugin-visualizer';
// import license from 'rollup-plugin-license';
// import del from 'rollup-plugin-delete';
// import scss from 'rollup-plugin-scss';
// import { terser } from 'rollup-plugin-terser';
// import copy from 'rollup-plugin-copy';
// // import typescript from 'typescript'
// // import ts from 'rollup-plugin-typescript2';
// const packageJson = require('./packages/node_modules/@webex/widget-call-history/package.json');

// const moduleName = packageJson.name.replace('@', '').replace('/', '-');
// const outputFolderRootPath = './packages/node_modules/@webex/widget-call-history/';
// // const packageJson = require('./packages/node_modules/@webex/widgets');


// export default [
//   {
//     input: packageJson.src,
//     output: [
//       {
//         file: packageJson.main,
//         format: 'cjs',
//         sourcemap: true,
//         name: moduleName,
//       },
//       {
//         file: `${packageJson.main.slice(0, -3)}.min.js`,
//         format: 'cjs',
//         sourcemap: true,
//         plugins: [terser()],
//       },
//       {
//         file: packageJson.module,
//         format: 'esm',
//         sourcemap: true,
//       },
//       {
//         file: `${packageJson.module.slice(0, -3)}.min.js`,
//         format: 'esm',
//         sourcemap: true,
//         plugins: [terser()],
//       },
//     ],
//     plugins: [
//       del({ targets: outputFolderRootPath + 'dist/*' }),
//       external(),
//       resolve({
//         browser: true,
//       }),
//       commonjs(),
//       // ts({
//       //   typescript
//       // }),
//       // typescript({
//       //   tsconfig: './tsconfig.json',
//       //   outputToFilesystem: true,
//       // }),
//       scss({
//         output: outputFolderRootPath + `dist/css/${moduleName}.css`,
//         failOnError: true,
//       }),
//       copy({
//         targets: [
//           { src: 'src/localization/locales', dest: outputFolderRootPath + 'dist/cjs/' },
//           {
//             src: 'src/localization/locales',
//             dest: outputFolderRootPath + 'dist/esm/',
//           },
//         ],
//       }),
//       license({
//         banner: `
//         Webex Calling
//         Copyright (c) <%= new Date().toISOString() %> Cisco Systems, Inc and its affiliates.
//         This source code is licensed under the MIT license found in the
//          LICENSE file in the root directory of this source tree.
//         `,
//       }),
//       visualizer({
//         filename: 'coverage/bundle-analysis-esm.html',
//         title: 'Webex Calling Components ESM Bundle Analysis',
//       }),
//     ],
//   },
//   // /* Rollup Types */
//   // {
//   //   input: outputFolderRootPath + 'esm/src/index.d.ts',
//   //   output: [{ file: outputFolderRootPath + 'dist/esm/src/index.ts', format: 'esm' }],
//   //   external: [/\.css$/, /\.scss$/],
//   //   plugins: [dts()],
//   // },
// ];


import babel from 'rollup-plugin-babel';
import url from '@rollup/plugin-url';
import clear from 'rollup-plugin-clear';
import postcss from 'rollup-plugin-postcss';
import localResolve from 'rollup-plugin-local-resolve';
import {base64} from '@webex/common';

export default {
  plugins: [
    // Clears the destination directory before building
    clear({
      // required, point out which directories should be clear.
      targets: ['es']
    }),
    // Finds the index.js file when importing via folder
    localResolve(),
    // Convert css to css modules
    postcss({
      modules: {
        generateScopedName: (name, filename, css) => {
          const cssHash = base64.encode(css).substring(0, 8);
          const paths = filename.split('/');
          const index = paths.indexOf('widget-call-history');
          let componentName;

          if (index !== -1) {
            componentName = paths[index + 1];
          }
          else {
            componentName = filename;
          }

          return `${componentName}__${name}__${cssHash}`;
        }
      },
      // Don't use sass loader due to momentum-ui issues
      use: [],
      config: false
    }),
    // Inline images
    url({
      limit: 100 * 1024 // inline files < 100k, copy files > 100k
    }),
    // Audio files for ringtones
    url({
      limit: 0,
      include: ['**/*.mp3']
    }),
    babel({
      babelrc: false,
      exclude: 'node_modules/**',
      plugins: [
        [
          // Support for @autobind decorators
          '@babel/plugin-proposal-decorators',
          {
            legacy: true
          }
        ],
        '@babel/plugin-proposal-nullish-coalescing-operator',
        '@babel/plugin-proposal-optional-chaining'
      ],
      presets: [
        '@babel/preset-react'
      ]
    })
  ],
  input: 'src/index.ts',
  output: [{
    dir: 'es',
    format: 'esm',
    sourcemap: true
  }],
  external: ['react', 'react-dom', 'prop-types', 'classnames', '@momentum-ui/react', '@momentum-ui/react-collaboration']
};

