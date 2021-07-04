import { targetsGetConfig } from '../../utils/targets.js';

export async function configGetLoaderPostcss() {
  return {
    loader: 'postcss-loader',
    options: {
      sourceMap: true,
      postcssOptions: {
        plugins: [
          ['postcss-preset-env', {
            browsers: targetsGetConfig(false),
          }],
          'autoprefixer',
          'cssnano',
        ],
      },
    },
  };
}
