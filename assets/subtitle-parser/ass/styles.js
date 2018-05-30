import _ from 'lodash'

const vbToRGBA = (vb) => {
  // vb is like &HAABBGGRR
  vb = vb.slice(2)
  const a = 1 - (parseInt(vb.slice(0, 2), 16) / 256)
  const b = parseInt(vb.slice(2, 4), 16)
  const g = parseInt(vb.slice(4, 6), 16)
  const r = parseInt(vb.slice(6, 8), 16)

  return `rgba(${r}, ${g}, ${b}, ${a})`
}

const getShadow = (style) => {
  let result = ''

  const color = vbToRGBA(style.BackColour)
  const depth = +style.Shadow * 1.5

  const outlineColor = vbToRGBA(style.OutlineColour)
  const outlineThickness = +style.Outline

  // First, outline
  result = `0 0 ${1.8 * outlineThickness}px ${outlineColor}, `.repeat(6).slice(0, -2)

  if (depth) {
    if (!outlineThickness) {
      // SSA specifies that if no outline is set, 1px outline must be forced.
      result = `0 0 1px ${color}, `.repeat(6).slice(0, -2)
    }

    result = `${depth}px ${depth}px ${depth}px ${color}, ${result}`
  }

  return `text-shadow: ${result};`
}

export default function (styles, name, info) {
  const styleTag = document.createElement('style')
  styleTag.type = 'text/css'
  styleTag.name = name

  _.each(styles, (style) => {
    const isItalic = +style.Italic ? 'italic' : 'unset'
    const isUnderline = -+style.Underline ? 'underline' : null
    const bold = -+style.Bold ? 'font-weight: bolder;' : ''
    const fontSize = +style.Fontsize
    const strikeOut = +style.Strikeout ? 'line-through' : null
    const primaryColor = vbToRGBA(style.PrimaryColour)

    const shadow = getShadow(style)

    styleTag.innerHTML += `
      .cues-container > .${style.Name.replace(/\s/g, '_')} {
        font-size: ${fontSize}px;
        font-style: ${isItalic};
        text-decoration: ${(isUnderline || strikeOut) || 'none'};
        color: ${primaryColor};
        ${shadow}
        ${bold}
      }
    `
  })

  document.head.appendChild(styleTag)
}
