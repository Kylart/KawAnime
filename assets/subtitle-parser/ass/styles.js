// For cue styling reference: https://developer.mozilla.org/en-US/docs/Web/CSS/::cue

import _ from 'lodash'

const vbToRGBA = (vb) => {
  // vb is like &HAABBGGRR
  vb = vb.slice(4)
  const b = vb.slice(0, 2)
  const g = vb.slice(2, 4)
  const r = vb.slice(4, 6)

  return `#${r}${g}${b}`
}

const generateStroke = (outline, outlineColor) => {
  const unit = `0 0 ${1.8 * outline || 4}px ${outlineColor}, `

  return `text-shadow: ${unit.repeat(8).slice(0, -2)};`
}

export default function (styles, name) {
  const styleTag = document.createElement('style')
  styleTag.type = 'text/css'
  styleTag.name = name

  _.each(styles, (style) => {
    const isItalic = +style.Italic ? 'italic' : 'none'
    const isUnderline = -+style.Underline ? 'underline' : null
    const bold = -+style.Bold ? 'font-weight: bold;' : ''
    const fontSize = +style.Fontsize
    const strikeOut = +style.Strikeout ? 'line-through' : null
    const primaryColor = vbToRGBA(style.PrimaryColour)
    const outlineColor = vbToRGBA(style.OutlineColour)
    const outline = generateStroke(+style.Outline, outlineColor)

    const defStyle = style.Name === 'Default' ? 'background-color: rgba(0, 0, 0, 0);\nfont-weight: 36px;' : ''

    styleTag.innerHTML += `
      .video-player > video::cue${style.Name === 'Default' ? '' : '(.' + style.Name.replace(/\s/g, '_') + ')'} {
        font-size: ${fontSize}px;
        font-style: ${isItalic};
        text-decoration: ${(isUnderline || strikeOut) || 'none'};
        color: ${primaryColor};
        text-shadow: 1px 1px 2px ${outlineColor}, 1px -1px 2px ${outlineColor}, -1px 1px 2px ${outlineColor}, -1px -1px 2px ${outlineColor};
        ${bold}
        ${outline}
        -webkit-font-smoothing: antialiased;
        ${defStyle}
      }
    `
  })

  document.head.appendChild(styleTag)
}
