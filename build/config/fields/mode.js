/**
 * @param {BuildParams} params
 * */
export async function configGetMode(params) {
  return params.production
    ? 'production'
    : 'development';
}
