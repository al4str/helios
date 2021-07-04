/**
 * @param {BuildParams} params
 * */
export async function configGetPluginAnalyze(params) {
  if (params.analyze) {
    // eslint-disable-next-line import/no-extraneous-dependencies
    const { BundleAnalyzerPlugin } = await import('webpack-bundle-analyzer');

    return new BundleAnalyzerPlugin({
      openAnalyzer: true,
      analyzerPort: params.modern
        ? 8888
        : 8887,
      reportTitle: params.modern
        ? 'Modern bundle'
        : 'Legacy bundle',
    });
  }
  return null;
}
