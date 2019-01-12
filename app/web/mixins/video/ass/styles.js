import { vbToRGBA } from './utils.js'
import _ from 'lodash'

export default function (styles, name, info) {
  const styleTag = document.createElement('style')
  styleTag.type = 'text/css'
  styleTag.name = name

  _.each(styles, (style) => {
    const isItalic = +style.Italic ? 'italic' : 'unset'
    const isUnderline = -+style.Underline ? 'underline' : null
    const bold = -+style.Bold ? 'font-weight: bold;' : ''
    const strikeOut = +style.Strikeout ? 'line-through' : null
    const primaryColor = vbToRGBA(style.PrimaryColour)
    const spacing = +style.Spacing ? `letter-spacing: ${style.Spacing}px;` : ''

    styleTag.innerHTML += `
      .cues-container .${style.Name.replace(/\s/g, '_')} {
        font-style: ${isItalic};
        text-decoration: ${(isUnderline || strikeOut) || 'none'};
        color: ${primaryColor};
        ${bold}
        ${spacing}
      }
    `
  })

  document.head.appendChild(styleTag)
}
