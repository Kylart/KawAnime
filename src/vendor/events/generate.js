export default function (name) {
  return {
    main: name,
    error: `${name}-error`,
    success: `${name}-success`
  }
}
