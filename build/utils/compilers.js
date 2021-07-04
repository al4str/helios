import webpack from 'webpack';

/**
 * @param {WebpackConfig} config
 * @return {function(): Promise<BuildCompileResults>}
 * */
export function compilersGet(config) {
  const compiler = webpack(config);
  return () => new Promise((resolve) => {
    compiler.run((err, stats) => {
      resolve({ err, stats });
    });
  });
}
