import { Extension } from '@tiptap/core'

export interface IndentOptions {
  types: string[]
  minIndent: number
  maxIndent: number
  indentUnit: string
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    indent: {
      /**
       * Indent the current block (or sink list item if inside a list)
       */
      indent: () => ReturnType
      /**
       * Outdent the current block (or lift list item if inside a list)
       */
      outdent: () => ReturnType
    }
  }
}

export const Indent = Extension.create<IndentOptions>({
  name: 'indent',

  addOptions() {
    return {
      types: ['paragraph', 'heading', 'blockquote'],
      minIndent: 0,
      maxIndent: 10,
      indentUnit: '2em',
    }
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          indent: {
            default: 0,
            parseHTML: (element) => {
              const marginLeft = element.style.marginLeft
              if (marginLeft) {
                const match = marginLeft.match(/^(\d+)/)
                if (match) {
                  return parseInt(match[1], 10) / 2 // Assuming 2em per level
                }
              }
              return 0
            },
            renderHTML: (attributes) => {
              if (!attributes.indent || attributes.indent === 0) {
                return {}
              }

              return {
                style: `margin-left: ${attributes.indent * 2}em`,
              }
            },
          },
        },
      },
    ]
  },

  addCommands() {
    return {
      indent:
        () =>
        ({ tr, state, dispatch, editor }) => {
          // If inside a list item, sink it to create a sub-list
          if (editor.isActive('listItem')) {
            return editor.chain().sinkListItem('listItem').run()
          }

          const { selection } = state
          const { from, to } = selection

          let changed = false

          state.doc.nodesBetween(from, to, (node, pos) => {
            if (this.options.types.includes(node.type.name)) {
              const currentIndent = node.attrs.indent || 0
              if (currentIndent < this.options.maxIndent) {
                if (dispatch) {
                  tr.setNodeMarkup(pos, undefined, {
                    ...node.attrs,
                    indent: currentIndent + 1,
                  })
                }
                changed = true
              }
            }
          })

          return changed
        },

      outdent:
        () =>
        ({ tr, state, dispatch, editor }) => {
          // If inside a list item, lift it out of a sub-list
          if (editor.isActive('listItem')) {
            return editor.chain().liftListItem('listItem').run()
          }

          const { selection } = state
          const { from, to } = selection

          let changed = false

          state.doc.nodesBetween(from, to, (node, pos) => {
            if (this.options.types.includes(node.type.name)) {
              const currentIndent = node.attrs.indent || 0
              if (currentIndent > this.options.minIndent) {
                if (dispatch) {
                  tr.setNodeMarkup(pos, undefined, {
                    ...node.attrs,
                    indent: currentIndent - 1,
                  })
                }
                changed = true
              }
            }
          })

          return changed
        },
    }
  },

  addKeyboardShortcuts() {
    return {
      Tab: () => {
        // If inside a list, sink the list item to create a sub-list
        if (this.editor.isActive('listItem')) {
          return this.editor.commands.sinkListItem('listItem')
        }
        return this.editor.commands.indent()
      },
      'Shift-Tab': () => {
        // If inside a list, lift the list item out of a sub-list
        if (this.editor.isActive('listItem')) {
          return this.editor.commands.liftListItem('listItem')
        }
        return this.editor.commands.outdent()
      },
    }
  },
})
