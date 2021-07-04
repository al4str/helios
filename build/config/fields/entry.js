import { MAIN_CHUNK_GROUP } from '../../constants.js';

/**
 * @param {BuildParams} params
 * */
export async function configGetEntry(params) {
  const mainEntry = params.modern
    ? ['./src/entries/common.js']
    : ['./src/entries/common.js'];

  return {
    [MAIN_CHUNK_GROUP]: mainEntry,
  };
}
