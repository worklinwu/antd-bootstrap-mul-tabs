module.exports = {
  vite: true,
  store: false,
  outputDir: 'dist',
  alias: {
    '@': './src/',
  },
  router: {
    lazy: true,
    configPath: 'configs/routes/index.ts',
  },
  tsChecker: true,
  plugins: [
    'build-plugin-jsx-plus',
    [
      'build-plugin-antd',
      {
        disableModularImport: true,
        themeConfig: {
          'primary-color': '#FFA22D',
          'form-item-margin-bottom': '24px',
          'card-radius': '4px',
          'card-head-padding': '12px',
          'modal-body-padding': '12px',
          'layout-header-background': '#1E1E1E',
          'layout-header-height': '56px',
          'brand-primary': '#FFA22D',
          'brand-primary-tap': '#FFA22D',
        },
      },
    ],
    [
      'build-plugin-moment-locales',
      {
        locales: ['zh-cn'],
      },
    ],
  ],
  webpackPlugins: {
    'webpack.ProvidePlugin': {
      options: {
        'window.store': 'store2',
      },
    },
  },
  modeConfig: {
    dev: {
      // proxy: {
      //   '/api': {
      //     target: '',
      //     changeOrigin: true,
      //   },
      // },
    },
    prod: {},
  },
};
