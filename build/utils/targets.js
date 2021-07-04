import fs from 'fs';
import path from 'path';
import consola from 'consola';
import { ROOT_DIR } from '../constants.js';

const console = consola.withTag('utils/targets');

/**
 * @param {boolean} modern
 * @return {string}
 * */
export function targetsGetConfig(modern) {
  const section = modern
    ? 'modern'
    : 'legacy';
  const config = getConfig();

  return config[section].join(', ');
}

const defaultConfig = {
  modern: ['supports es6-module and not iOS < 11 and not Safari < 11 and not Edge <= 79'],
  legacy: ['defaults', 'iOS < 11', 'Safari < 11', 'Edge <= 79'],
};

/** @type {null|BuildTargetsConfig} */
let prevConfig = null;

/**
 * @return {Buffer}
 * */
function readConfig() {
  try {
    return fs.readFileSync(path.join(ROOT_DIR, '.browserslistrc'));
  }
  catch (err) {
    console.warn(err);
    return Buffer.alloc(0);
  }
}

/**
 * @param {Buffer} buffer
 * @return {BuildTargetsConfig}
 * */
function parseConfig(buffer) {
  const sectionRegExp = /^\s*\[(.+)]\s*$/;
  try {
    return buffer
      .toString('utf-8')
      .replace(/#[^\n]*/g, '')
      .split(/[\n,]/)
      .map((line) => line.trim())
      .filter((line) => line !== '')
      .reduce((result, line) => {
        if (sectionRegExp.test(line)) {
          const section = line
            .match(sectionRegExp)[1]
            .trim();
          result.push({ name: section, targets: [] });
        }
        else {
          const section = result[result.length - 1];
          section.targets.push(line);
        }
        return result;
      }, [])
      .reduce((result, section) => {
        result[section.name] = section.targets;
        return result;
      }, {});
  }
  catch (err) {
    console.warn(err);
    return defaultConfig;
  }
}

/**
 * @return {BuildTargetsConfig}
 * */
function getConfig() {
  if (prevConfig) {
    return prevConfig;
  }
  const buffer = readConfig();
  const config = parseConfig(buffer);
  prevConfig = config;
  return config;
}
