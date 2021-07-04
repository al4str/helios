import path from 'path';

/**
 * @param {BuildParams} params
 * */
export async function configGetLoaderFont(params) {
  const fileName = params.production
    ? '[name].[contenthash:8][ext]'
    : '[name].[fullhash][ext]';

  return {
    test: /\.(ttf|woff2?)$/i,
    type: 'asset/resource',
    generator: {
      filename(pathData) {
        const dirPath = pathData.filename.replace(/\/?src\/static\/?/, '');
        const outDir = path.dirname(dirPath);

        return path.join(outDir, fileName);
      },
    },
  };
}
