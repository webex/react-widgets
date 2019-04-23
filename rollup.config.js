import babel from 'rollup-plugin-babel';
import url from 'rollup-plugin-url';
import clear from 'rollup-plugin-clear';
import postcss from 'rollup-plugin-postcss';
import localResolve from 'rollup-plugin-local-resolve';

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
      modules: true,
      // Don't use sass loader due to collab-ui issues
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
  external: ['react', 'react-dom', 'prop-types', 'classnames', '@collab-ui/react']
};
