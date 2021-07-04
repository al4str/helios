/**
 * @param {BuildParams} params
 * */
export async function configGetPluginBar(params) {
  if (params.production) {
    return null;
  }
  // eslint-disable-next-line import/no-extraneous-dependencies
  const { default: BarPlugin } = await import('webpackbar');

  return new BarPlugin({
    name: params.modern
      ? 'modern'
      : 'legacy',
  });
}
