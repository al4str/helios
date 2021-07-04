/**
 * @param {BuildParams} params
 * */
export async function configGetPluginStylelint(params) {
  if (params.production) {
    return null;
  }
  // eslint-disable-next-line import/no-extraneous-dependencies
  const { default: StylelintPlugin } = await import('stylelint-webpack-plugin');
  const cacheLocation = params.modern
    ? 'node_modules/.cache/stylelint/modern'
    : 'node_modules/.cache/stylelint/legacy';

  return new StylelintPlugin({
    cache: true,
    cacheLocation,
  });
}
