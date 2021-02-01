module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: [
          'last 2 Chrome major versions',
          'last 1 ChromeAndroid major versions',
          'last 2 Firefox major versions',
          'last 1 FirefoxAndroid major versions',
          'last 2 Safari major versions',
          'last 3 iOS major versions',
          'last 2 Edge major versions',
          'last 1 Samsung versions',
          'ie >= 11'
        ]
      }
    ],
    '@babel/preset-react'
  ],
  plugins: [
    [
      '@babel/plugin-transform-runtime',
      {
        corejs: 2
      }
    ],
    [
      '@babel/plugin-proposal-decorators',
      {
        legacy: true
      }
    ],
    '@babel/plugin-proposal-export-default-from',
    '@babel/plugin-proposal-export-namespace-from',
    '@babel/plugin-proposal-nullish-coalescing-operator',
    '@babel/plugin-proposal-optional-chaining',
    'lodash'
  ],
  env: {
    development: {
      plugins: [
        [
          './scripts/utils/babel7-plugin-react-transform',
          {
            transforms: [
              {
                transform: 'react-transform-hmr',
                imports: ['react'],
                locals: ['module']
              }
            ]
          }
        ]
      ]
    },
    test: {
      retainLines: true,
      sourceMaps: 'inline'
    }
  }
};
