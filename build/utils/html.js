import { minify } from 'html-minifier';

/**
 * @param {string} html
 * @return {string}
 * */
export function htmlMinify(html) {
  return minify(html, {
    collapseBooleanAttributes: true,
    collapseInlineTagWhitespace: true,
    collapseWhitespace: true,
    minifyCSS: true,
    minifyJS: true,
    removeComments: true,
  });
}
