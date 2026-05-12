import { Image } from '@tiptap/extension-image'

export const AlignableImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      textAlign: {
        default: null,
        parseHTML: (element) => {
          const el = element as HTMLElement
          if (el.style.textAlign) return el.style.textAlign
          const parent = el.parentElement
          if (
            parent &&
            (parent.tagName === 'P' || parent.tagName === 'DIV') &&
            parent.style.textAlign
          ) {
            return parent.style.textAlign
          }
          const ml = el.style.marginLeft
          const mr = el.style.marginRight
          if (ml === 'auto' && mr === 'auto') return 'center'
          if (ml === 'auto') return 'right'
          if (mr === 'auto') return 'left'
          return null
        },
        renderHTML: (attributes) => {
          const align = attributes.textAlign
          if (!align || align === 'left') return {}
          if (align === 'center') {
            return {
              style:
                'display: block; margin-left: auto; margin-right: auto;',
            }
          }
          if (align === 'right') {
            return {
              style:
                'display: block; margin-left: auto; margin-right: 0;',
            }
          }
          return {}
        },
      },
    }
  },
})
