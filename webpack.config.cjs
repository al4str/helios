// Webpack alias path resolving for IDE (e.g., Webstorm)
// Note: somehow `eslint-import-resolver-webpack` does not support `esm`
const path = require('path');

module.exports = {
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    }
  }
};
