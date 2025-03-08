module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      require.resolve('babel-plugin-module-resolver'),
      {
        root: ['./src'],
        extensions: [
          '.ios.js',
          '.android.js',
          '.js',
          '.ts',
          '.tsx',
          '.json',
          '.png',
        ],
        alias: {
          '*': 'src/*',
          '@components/*': './src/components/*',
          '@navigations/*': './src/navigator/*',
          '@images/*': './src/assets/images/*',
          '@utils/*': './src/utils/*',
          '@types/*': './src/types/*',
          '@redux/*': './src/redux/*',
          '@theme/*': './src/theme/*',
        },
      },
    ],
    'react-native-reanimated/plugin',
    [
      'module:react-native-dotenv',
      {
        moduleName: '@env',
        path: '.env',
      },
    ],
  ],
};
