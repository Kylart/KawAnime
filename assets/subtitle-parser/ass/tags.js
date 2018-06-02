import { alignment, alignDir, generateAnimation } from './utils.js'

const re = {
  delimiter: /((\{|\}))/g,
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
  fade: /\\fad\(\d*,\d*\)/,
  pos: /\\pos\(\d*,\d*\)/,
  rot: /\\fr(x|y|z)?\d{1,3}/,
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
      style.innerHTML += `.video-player .${fontClass} {
        font-${type === 'name' ? 'family' : 'size'}:${value};
      }`
    }

    string = string.replace(re.font[type], `<p class="${fontClass}" style="display: inline;">`) + '</c>'
  }

  return string.replace(re.font[type], '')
}

const setColorStyle = (type, colorTag, string, style) => {
  const color = colorTag.replace(/\\\d?c/g, '').slice(2, 8)
  const r = color.slice(4, 6)
  const g = color.slice(2, 4)
  const b = color.slice(0, 2)
  const hexColor = `#${r}${g}${b}`

  const colorClass = `${type}${color}`

  const typeToProperty = {
    'c': {
      property: 'color',
      rule: hexColor
    },
    'b': {
      property: '-webkit-text-stroke',
      rule: `1.5px ${hexColor},`
    }
  }

  // Check if class is in style. If not, includes it.
  let current = style.innerHTML
  if (!current.includes(`.${colorClass}`)) {
    style.innerHTML += `.video-player p.${colorClass} {${typeToProperty[type].property}:${typeToProperty[type].rule};}`
  }

  return string.replace(re.color, `<p class="${colorClass}" style="display: inline;">`)
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
          string = string.slice(0, index) + '</p>' + string.slice(index)
        } else {
          string += '</p>'
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

const handleFade = (cue, style) => {
  let string = cue.text

  if (re.fade.test(string)) {
    const fadeTag = string.match(re.fade)[0]

    // We can handle only appearing fade animation atm.
    // The time is in ms, we need it in seconds.
    const inDuration = +fadeTag.split(',')[0].replace('\\fad(', '') / 1000

    // There is a need for a css class.
    const fadeInClass = `fade_in_${inDuration}`.replace('.', '')

    cue.style.push(fadeInClass)
    cue.text = string.replace(fadeTag, '')

    // Check if class is in style. If not, includes it.
    let current = style.innerHTML
    if (!current.includes(`.${fadeInClass}`)) {
      const animationName = `fade${inDuration}`.replace('.', '')
      const types = [
        { type: 'in', duration: inDuration, cls: fadeInClass, name: `fade_in_${inDuration}`.replace('.', '') }
      ]

      types.forEach(({type, duration, cls}) => {
        style.innerHTML += `.video-player .${cls} ${generateAnimation(type, animationName, duration)}`
      })
    }
  }

  return cue
}

const handlePos = (cue, info) => {
  const string = cue.text
  const { PlayResX: resX, PlayResY: resY } = info

  if (re.pos.test(string)) {
    const posTag = string

    const xy = string.replace('\\pos(', '').replace(')', '').split(',')
    const x = Math.round((xy[0] / resX) * 100)
    const y = Math.round((xy[1] / resY) * 100)

    cue.position = x
    cue.line = y

    cue.text = string.replace(posTag, '')
  }

  return cue
}

const handleRotation = (cue) => {
  const string = cue.text

  if (re.rot.test(string)) {
    const rotateTag = string.match(re.rot)
    let axis = rotateTag.replace('\\fr', '').slice(0, 1)

    if (!isNaN(+axis)) {
      // According to the specs, if no axis is specified,
      // the fallback axis should be z.
      axis = 'z'
    }

    const degrees = rotateTag.replace(`\\fr${axis}`, '')

    cue.rotate = ` rotate${axis.toUpperCase}(${degrees}deg)`

    cue.text = string.replace(rotateTag, '')
  }

  return cue
}

const handleAlignment = (string, cue, style) => {
  const alignmentTag = re.alignment.test(string) && string.match(re.alignment)[0] // Only he first tag matters

  if (alignmentTag) {
    const isNumpad = alignmentTag[2] === 'n'

    const align = isNumpad
      ? +alignmentTag[3] // tag === '\an<number>, 1 <= number <= 9
      : +alignmentTag.slice(2, 4) // tag === '\a<number>, 1 <= number <= 11

    cue.position = isNumpad ? alignment.numpad[align][1] : alignment.ssa[align][1]
    cue.line = isNumpad ? alignment.numpad[align][0] : alignment.ssa[align][0]

    if (isNumpad) {
      cue.align = alignDir.left.includes(alignment)
        ? -0
        : alignDir.right.includes(alignment)
          ? -100
          : -50

      cue.textAlign = alignDir.left.includes(alignment)
        ? 'left'
        : alignDir.right.includes(alignment)
          ? 'right'
          : 'center'
    }

    cue.text = string.replace(re.alignment, '')
  }

  return cue
}

export default function (cues, info) {
  const cssStyle = document.head.children[document.head.childElementCount - 1]

  cues.forEach((cue) => {
    let string = cue.text

    if (/\{/g.test(string)) {
      string = handleCommon('bold', string)
      string = handleCommon('italic', string)
      string = handleCommon('underline', string)

      string = handleFont('name', string, cssStyle)
      string = handleFont('size', string, cssStyle)

      string = handleColor(string, cssStyle)

      cue.text = clean(string)

      cue = handlePos(cue, info)
      cue = handleRotation(cue)
      cue = handleAlignment(string, cue, cssStyle)
      cue = handleFade(cue, cssStyle)
    }
  })

  return cues
}
