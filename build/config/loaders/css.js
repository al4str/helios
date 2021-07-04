import MiniCssExtractPlugin from 'mini-css-extract-plugin';

/**
 * @param {BuildParams} params
 * */
export async function configGetLoaderCSS(params) {
  return {
    loader: params.production
      ? MiniCssExtractPlugin.loader
      : 'style-loader',
  };
}
