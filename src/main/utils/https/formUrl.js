/**
 * Helper function to help
 *
 * @param {String} base Base URL
 * @param {[{ name: String, value: String }]} params List of parameter to use
 *
 * @returns {String} The correctly formatted URL
 */
export default function (base, params) {
  return [
    base,
    params
      .map(({ name, value }) => [encodeURIComponent(name), value].join('='))
      .join('&')
  ].join(params.length ? '?' : '')
}
