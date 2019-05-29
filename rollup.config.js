import babel from 'rollup-plugin-babel';
import url from 'rollup-plugin-url';
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
          let componentName;
          const cssHash = base64.encode(css).substring(0, 8);
          const paths = filename.split('/');
          let index = paths.indexOf('@ciscospark');

          if (index === -1) {
            index = paths.indexOf('@webex');
          }

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
        // Support for @autobind decorators
        'transform-decorators-legacy',
        // Support for ...props
        'transform-object-rest-spread',
        'external-helpers'
      ],
      presets: [
        ['env', {modules: false}],
        'react'
      ]
    })
  ],
  input: 'src/index.js',
  output: [{
    dir: 'es',
    format: 'esm',
    sourcemap: true
  }],
  external: ['react', 'react-dom', 'prop-types', 'classnames', '@momentum-ui/react']
};
