import { alignment } from './utils.js'

const re = {
  delimiter: /(\{.+\})/g,
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
  color: /\\\d?c&H[0-9A-Za-z]{2,6}&/,
  alignment: /\\an?\d{1,2}/g,
  karaoke: /\\k(f|o)?\d{1,5}/ig
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
    const fontClass = 'font_' + font.replace(/\s/g, '_')

    const value = font + (type === 'size' ? 'px' : '')

    // Check if class is in style. If not, includes it.
    let current = style.innerHTML
    if (!current.includes(`.${fontClass}`)) {
      style.innerHTML += `.video-player > video::cue(.${fontClass}) {
        font-${type === 'name' ? 'family' : 'size'}:${value};
      }`
    }

    string = string.replace(re.font[type], `<c.${fontClass}>`) + '</c>'
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
  let current = style.innerHTML
  if (!current.includes(`.${colorClass}`)) {
    style.innerHTML += `.video-player > ::cue(${colorClass}){${typeToProperty[type].property}:${typeToProperty[type].rule};}`
  }

  return string.replace(re.color, `<c${colorClass}>`)
}

const handleColor = (string, style) => {
  if (re.color.test(string)) {
    const globalRe = new RegExp(re.color, ['g'])

    for (let i = 0, l = string.match(globalRe).length; i < l; ++i) {
      const colorTag = string.match(re.color)[0]
      const isPrimary = colorTag[1] === 'c' || colorTag[1] === '1'

      if (isPrimary) {
        string = setColorStyle('c', colorTag, string, style)

        if (re.color.test(string)) {
          // Meaning there is another color tag in the string so the closing tag should be
          // before the next color tag
          const match = string.match(re.color)[0]
          const index = string.indexOf(match)
          string = string.slice(0, index) + '</c>' + string.slice(index)
        } else {
          string += '</c>'
        }
      } else {
        // Hopefully temporary
        // Support only for border color
        if (colorTag[1] === '3') {
          string = setColorStyle('b', colorTag, string, style)
        }
      }
    }
  }

  return string
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

    if (isNumpad) {
      const leftAligned = [1, 4, 7]
      const rightAligned = [3, 6, 9]

      cue.align = leftAligned.includes(align)
        ? 'start'
        : rightAligned.includes(align)
          ? 'end'
          : 'center'
    }
  }

  cue.text = string.replace(re.alignment, '')
  return cue
}

// const handleKaraoke = (string, cue) => {
//   const karaokeTag = re.karaoke.test(string) && string.match(re.karaoke)
//   // console.log(cue)

//   if (karaokeTag.length) {
//     const durations = []

//     karaokeTag.forEach((tag) => {
//       const tag_ = tag.replace(/f/g, '').replace(/o/g, '')

//       const { startTime } = cue // Format is mm:ss.xx
//       durations.push(tag_.slice(2))

//       const completeDuration = durations.reduce((a, elem) => a + elem)

//       const shouldStartAt = startTime + completeDuration
//     })
//   }

//   return string.replace(karaokeTag, '')
// }

export default function (string, cue) {
  const cssStyle = document.head.children[document.head.childElementCount - 1]

  if (/\{/g.test(string)) {
    string = handleCommon('bold', string)
    string = handleCommon('italic', string)
    string = handleCommon('underline', string)

    // string = handleKaraoke(string, cue)

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
