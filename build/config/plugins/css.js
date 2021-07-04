import MiniCssExtractPlugin from 'mini-css-extract-plugin';

/**
 * @param {BuildParams} params
 * */
export async function configGetPluginCSS(params) {
  return new MiniCssExtractPlugin({
    filename: params.production
      ? 'styles/[name].[contenthash:8].css'
      : 'styles/[name].[fullhash].css',
    chunkFilename: params.production
      ? 'styles/[id].[contenthash:8].css'
      : 'styles/[id].[fullhash].css',
    ignoreOrder: true,
    linkType: false,
  });
}
