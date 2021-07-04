import webpack from 'webpack';

/**
 * @param {BuildParams} params
 * */
export async function configGetPluginHMR(params) {
  return params.production
    ? null
    : new webpack.HotModuleReplacementPlugin();
}
