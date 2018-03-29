export default function (tracks) {
  let current = 'script'
  let headers = []
  const styles = []
  const info = {}

  tracks[0].header.split('\n').forEach((elem, i) => {
    if (!elem.length) {
      current = ''
      return
    }

    // Getting script info
    if (current === 'script') {
      const line = elem.includes(':') && elem.split(':')

      const key = line && line[0].trim()
      const value = line && line[1].trim()

      info[key] = value
    }

    // Getting styles
    if (elem.includes('V4+')) current = 'V4'

    if (current === 'V4' && elem.includes('Format:')) {
      headers = elem.replace('Format: ', '').split(', ')
    }

    if (current === 'V4' && elem.includes('Style: ')) {
      const style = {}
      const values = elem.replace('Style: ', '').split(',')

      values.forEach((e, index) => {
        style[headers[index]] = e
      })

      styles.push(style)
    }
  })

  return {
    styles,
    info
  }
}
