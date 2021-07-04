import Sass from 'sass';

export async function configGetLoaderSCSS() {
  return {
    loader: 'sass-loader',
    options: {
      sourceMap: true,
      implementation: Sass,
    },
  };
}
