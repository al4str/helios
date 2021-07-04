import rootConfig from '../../../webpack.config.cjs';

export async function configGetResolve() {
  return {
    alias: {
      ...(rootConfig.resolve.alias || {}),
      'react/jsx-dev-runtime': 'react/jsx-dev-runtime.js',
      'react/jsx-runtime': 'react/jsx-runtime.js',
    },
  };
}
