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

const getTextStroke = (style) => {
  const outlineColor = vbToRGBA(style.OutlineColour)
  const outlineThickness = +style.Outline

  const fontSize = +style.Fontsize

  // If stroke's thickness is more than 10% of the fontSize,
  // it surrounds the cue so much that it hides it.
  // So if the thickness is more than 10% of the font-size,
  // we'll simply set it at 1px. This shouldn't bother the user
  // that much.
  const limit = Math.round((outlineThickness / fontSize) * 100)
  const isTooThick = limit >= 10

  // Also, as the problem tends to happen with small sized texts,
  // we'll make it bolder than it should be.
  const bold = 'font-weight: 500;'

  return `-webkit-text-stroke: ${isTooThick ? 1 : outlineThickness}px ${outlineColor}; ${bold}`
}

const getShadow = (style) => {
  const color = vbToRGBA(style.BackColour)
  const depth = +style.Shadow

  // SSA specifies that if no outline is set, 1px outline must be forced.
  const outline = `-webkit-text-stroke: 1px ${color};`

  return depth
    ? `${outline} text-shadow: ${depth}px ${depth}px ${depth}px ${color};`
    : ''
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
    const outline = getTextStroke(style)

    styleTag.innerHTML += `
      .cues-container > .${style.Name.replace(/\s/g, '_')} {
        font-size: ${fontSize}px;
        font-style: ${isItalic};
        text-decoration: ${(isUnderline || strikeOut) || 'none'};
        color: ${primaryColor};
        ${shadow}
        ${outline}
        ${bold}
      }
    `
  })

  document.head.appendChild(styleTag)
}
