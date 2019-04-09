import { vbToRGBA } from './utils.js'
import { each } from 'lodash'

export default function (styles, name) {
  const styleTag = document.createElement('style')
  styleTag.setAttribute('type', 'text/css')
  styleTag.setAttribute('name', name)

  each(styles, (style) => {
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
