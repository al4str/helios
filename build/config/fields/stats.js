/**
 * @param {BuildParams} params
 * */
export async function configGetStats(params) {
  return params.production
    ? 'errors-warnings'
    : 'minimal';
}
