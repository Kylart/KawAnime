export default function (base, params) {
  return [
    base,
    params
      .map(({ name, value }) => [encodeURIComponent(name), value].join('='))
      .join('&')
  ].join(params.length ? '?' : '')
}
