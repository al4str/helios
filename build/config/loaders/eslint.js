/**
 * @param {BuildParams} params
 * */
export async function configGetLoaderEslint(params) {
  if (params.production) {
    return null;
  }
  // eslint-disable-next-line import/no-extraneous-dependencies
  const { default: formatter } = await import('eslint-friendly-formatter');

  return {
    enforce: 'pre',
    test: /\.js$/,
    exclude: /node_modules/,
    use: [
      {
        loader: 'eslint-loader',
        options: {
          formatter,
        },
      },
    ],
  };
}
