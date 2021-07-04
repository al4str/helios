#!/usr/bin/env node
import path from 'path';
import consola from 'consola';
import { fsMakeOrClearDir, fsWriteFile } from '../utils/fs.js';
import { templatesRender } from '../utils/templates.js';
import { compilersGet } from '../utils/compilers.js';
import { configGet } from '../config/index.js';
import { buildGetParams } from '../params.js';
import { DIST_DIR } from '../constants.js';

const console = consola.withTag('build');

async function build() {
  try {
    const { analyze } = buildGetParams();
    await fsMakeOrClearDir(DIST_DIR);
    const configs = await Promise.all([
      configGet({
        analyze,
        production: true,
        modern: true,
      }),
      configGet({
        analyze,
        production: true,
        modern: false,
      }),
    ]);
    const compilers = configs
      .map((config) => compilersGet(config));
    console.info('Compiling modern and legacy bundles...');
    /** @type {Array<BuildCompileResults>} */
    const results = await Promise.all(compilers.map((compiler) => {
      return compiler();
    }));
    results.forEach((result, index) => {
      const { err, stats } = result;
      const config = configs[index];
      const statsSettings = config.stats;
      if (err) {
        console.error(err);
      }
      if (stats) {
        console.log(stats.toString(statsSettings));
      }
    });
    const [modernBuildResult, legacyBuildResult] = results;
    if (!modernBuildResult.err && !legacyBuildResult.err) {
      console.info('Compiling templates...');
      const html = templatesRender({
        production: true,
        statsList: [
          modernBuildResult.stats,
          legacyBuildResult.stats,
        ],
      });
      const htmlPath = path.join(DIST_DIR, 'index.html');
      await fsWriteFile(htmlPath, html);
      console.success('Compiled successfully');
    }
    else {
      throw (modernBuildResult.err || legacyBuildResult.err);
    }
  }
  catch (err) {
    console.warn('Compilation failed');
    console.error(err);
  }
}

(async function() {
  await build();
}());
