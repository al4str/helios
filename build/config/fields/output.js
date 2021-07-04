import { DIST_DIR, PUBLIC_PATH } from '../../constants.js';

/**
 * @param {BuildParams} params
 * */
export async function configGetOutput(params) {
  const type = params.modern
    ? 'modern'
    : 'legacy';

  return {
    filename: params.production
      ? `${type}/[name].${type}.[contenthash:8].js`
      : `${type}/[name].${type}.[fullhash].js`,
    chunkFilename: params.production
      ? `${type}/[name].${type}.[contenthash:8].js`
      : `${type}/[name].${type}.[fullhash].js`,
    assetModuleFilename: params.production
      ? '[name].[contenthash:8][ext]'
      : '[name].[fullhash][ext]',
    path: DIST_DIR,
    publicPath: PUBLIC_PATH,
    scriptType: params.modern
      ? 'module'
      : 'text/javascript',
  };
}
