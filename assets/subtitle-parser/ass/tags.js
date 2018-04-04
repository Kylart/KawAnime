import { alignment } from './utils.js'

const re = {
  delimiter: /(\{|\})/g,
  newline: /\\N/g,
  bold: {
    start: {
      from: /\\b1/g,
      to: '<b>'
    },
    end: {
      from: /\\b0/g,
      to: '</b>'
    }
  },
  italic: {
    start: {
      from: /\\i1/g,
      to: '<i>'
    },
    end: {
      from: /\\i0/g,
      to: '</i>'
    }
  },
  underline: {
    start: {
      from: /\\u1/g,
      to: '<u>'
    },
    end: {
      from: /\\u0/g,
      to: '</u>'
    }
  },
  font: {
    name: /(\\fn.+(?=\\)|\\fn.+(?=}))/g,
    size: /\\fs[0-9]{1,3}/g
  },
  color: /\\\d?c&H[0-9A-Za-z]{2,6}&/g,
  alignment: /\\an?\d{1,2}/g,
  notSupported: [
    /\\s(0|1)/g, // Strikeout
    /\\(bord|shad|be)[0-9]{1,5}/g, // Border, shadow and blur
    /\\fsc(x|y)\d{1,3}/g, // Scaling
    /\\fsp\d{1,3}/g, // letter-spacing is not supported in cue
    /fr(x|y|z)?\d{1,3}/g, // Cannot rotate text in cue
    /\\b\d{1,3}/g, // Custom bold is a pain to handle
    /\\fe\d{1,3}/g, // Encoding
    /\\(\d?a|alpha)&H[0-9A-Za-z]{2}&/g, // Alpha
    /\\fad\(\d{1,3},\d{1,3}\)/g // fade animation
  ]
}

// Need to clean up {}s after
const clean = (string) => {
  return string.replace(re.delimiter, '')
}

const handleCommon = (type, string) => {
  // Handles bold, italic and underline
  const re_ = re[type]

  if (re_.start.from.test(string)) {
    string = string.replace(re_.start.from, re_.start.to)

    re_.end.from.test(string)
      ? string = string.replace(re_.end.from, re_.end.to)
      : string += re_.end.to
  }

  return string.replace(re_.start.from, '').replace(re_.end.from, '')
}

const handleFont = (type, string, style) => {
  const fontType = re.font[type].test(string) && string.match(re.font[type])[0]

  if (fontType) {
    const font = fontType.slice(3)
    const fontClass = font.replace(/\s/g, '_')

    const value = font + (type === 'size' ? 'px' : '')

    // Check if class is in style. If not, includes it.
    let current = style.innerHTML
    if (!current.includes(`.${fontClass}`)) {
      current += `.video-player > ::cue(.${fontClass}){font-${type === 'name' ? 'family' : 'size'}:${value};}`
    }

    string = `<c.${fontClass}>${string}</c>`
  }

  return string.replace(re.font[type], '')
}

const setColorStyle = (type, colorTag, string, style) => {
  const color = colorTag.replace(/\\\d?c/g, '').slice(2, 8)
  const r = color.slice(4, 6)
  const g = color.slice(2, 4)
  const b = color.slice(0, 2)
  const hexColor = `#${r}${g}${b}`

  const colorClass = `.${type}${color}`

  const typeToProperty = {
    'c': {
      property: 'color',
      rule: hexColor
    },
    'b': {
      property: 'text-shadow',
      rule: `0 0 ${1.8 * 4}px ${hexColor},`.repeat(8).slice(-2)
    }
  }

  // Check if class is in style. If not, includes it.
  const current = style.innerHTML
  if (!current.includes(`.${color}`)) {
    current.append(
      `.video-player > ::cue(${colorClass}){${typeToProperty[type].property}:${typeToProperty[type].rule};}`
    )
  }

  return `<c${colorClass}>${string}</c>`
}

const handleColor = (string, style) => {
  const colorTag = re.color.test(string) && string.match(re.color)[0]

  if (colorTag) {
    // matching type can either be \c&H<color>H or \<number>c&H<>color&
    const isPrimary = colorTag[1] === 'c' || colorTag[1] === '1'

    if (isPrimary) {
      string = setColorStyle('c', colorTag, string, style)
    } else {
      // Hopefully temporary
      // Support only for border color
      if (colorTag[1] === '3') {
        string = setColorStyle('b', colorTag, string, style)
      }
    }
  }

  return string.replace(re.color, '')
}

const handleAlignment = (string, cue) => {
  const alignmentTag = re.alignment.test(string) && string.match(re.alignment)[0] // Only he first tag matters

  if (alignmentTag) {
    const isNumpad = alignmentTag[2] === 'n'

    const align = isNumpad
      ? +alignmentTag[3] // tag === '\an<number>, 1 <= number <= 9
      : +alignmentTag.slice(2, 4) // tag === '\a<number>, 1 <= number <= 11

    cue.position = isNumpad ? alignment.numpad[align][1] : alignment.ssa[align][1]
    cue.line = isNumpad ? alignment.numpad[align][0] : alignment.ssa[align][0]

    const leftAligned = [1, 4, 7]
    const rightAligned = [3, 6, 9]

    cue.align = leftAligned.includes(align)
      ? 'start'
      : rightAligned.includes(align)
        ? 'end'
        : 'center'
  }

  cue.text = string.replace(re.alignment, '')
  return cue
}

const handleNotSupported = (string) => {
  re.notSupported.forEach((tag) => { string = string.replace(tag, '') })

  return string
}

export default function (string, cue) {
  const cssStyle = document.head.children[document.head.childElementCount - 1]

  if (/\{/g.test(string)) {
    string = handleNotSupported(string)

    string = handleCommon('bold', string)
    string = handleCommon('italic', string)
    string = handleCommon('underline', string)

    string = handleFont('name', string, cssStyle)
    string = handleFont('size', string, cssStyle)

    string = handleColor(string, cssStyle)

    cue = handleAlignment(string, cue)
    string = cue.text
  }

  string = string.replace(re.newline, '\n')

  cue.text = clean(string)

  return cue
}
