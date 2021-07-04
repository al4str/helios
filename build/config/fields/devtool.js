/**
 * @param {BuildParams} params
 * */
export async function configGetDevtool(params) {
  return params.production
    ? 'source-map'
    : 'eval-source-map';
}
