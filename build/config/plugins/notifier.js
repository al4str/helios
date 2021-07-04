import { PACKAGE_NAME } from '../../constants.js';

/**
 * @param {BuildParams} params
 * */
export async function configGetPluginNotifier(params) {
  if (params.production) {
    return null;
  }
  // eslint-disable-next-line import/no-extraneous-dependencies
  const { default: WebpackNotifierPlugin } = await import('webpack-notifier');

  return new WebpackNotifierPlugin({
    title: PACKAGE_NAME,
    alwaysNotify: true,
  });
}
