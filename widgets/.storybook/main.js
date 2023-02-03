const path = require('path');

const stories = process.env.STORYBOOK_ONLY_WIDGETS
  ? ['../src/Webex*/**/*.stories.mdx', '../src/Webex*/**/*.stories.tsx']
  : ['../src/**/*.stories.mdx', '../src/**/*.stories.tsx'];

module.exports = {
  stories: stories,
  addons: [
    // '@storybook/preset-typescript',
    '@storybook/addon-a11y',
    '@storybook/addon-links',
    '@storybook/addon-docs',
    '@storybook/addon-actions',
    '@storybook/addon-essentials',
  ],
  framework: '@storybook/react',
  core: {
    //builder: '@storybook/builder-vite',
    builder: 'webpack5',
  },
  async webpackFinal(config, { configType }) {
    // Add SVGR Loader
    // ========================================================
    const assetRule = config.module.rules.find(({ test }) => test.test('.svg'));
    assetRule.exclude = /\.svg$/;

    // Merge our rule with existing assetLoader rules
    config.module.rules.unshift({
      test: /\.svg$/,
      use: ['@svgr/webpack', 'url-loader'],
    });
    config.module.rules.push({
      test: /\.scss$/,
      sideEffects: true,
      use: ['style-loader', 'css-loader', 'sass-loader'],
    });

    console.log('config.module.rules', config.module.rules);

    config.resolve.alias['@momentum-ui/core/images'] = path.resolve(
      path.resolve(
        __dirname,
        '../../node_modules/@momentum-ui/react-collaboration'
      ),
      'images'
    );

    // customize the config here
    const finalConfig = {
      ...config,
    };

    console.log('config', finalConfig);

    return finalConfig;
  },
};
