import _ from 'lodash'

const vbToRGBA = (vb) => {
  // vb is like &HAABBGGRR
  vb = vb.slice(4)
  const b = vb.slice(0, 2)
  const g = vb.slice(2, 4)
  const r = vb.slice(4, 6)

  return `#${r}${g}${b}`
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

    const outline = getTextStroke(style)

    styleTag.innerHTML += `
      .cues-container > .${style.Name.replace(/\s/g, '_')} {
        font-size: ${fontSize}px;
        font-style: ${isItalic};
        text-decoration: ${(isUnderline || strikeOut) || 'none'};
        color: ${primaryColor};
        ${outline}
        ${bold}
      }
    `
  })

  document.head.appendChild(styleTag)
}
