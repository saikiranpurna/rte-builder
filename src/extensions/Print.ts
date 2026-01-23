import { Extension } from '@tiptap/core'

export interface PrintOptions {
  title?: string
  styles?: string
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    print: {
      /**
       * Print the editor content
       */
      print: () => ReturnType
    }
  }
}

const defaultPrintStyles = `
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    font-size: 14px;
    line-height: 1.6;
    color: #1f2937;
    padding: 20px;
    max-width: 800px;
    margin: 0 auto;
  }

  h1 { font-size: 2em; font-weight: 700; margin: 1em 0 0.5em; }
  h2 { font-size: 1.5em; font-weight: 700; margin: 0.83em 0 0.5em; }
  h3 { font-size: 1.25em; font-weight: 600; margin: 1em 0 0.5em; }
  h4 { font-size: 1.1em; font-weight: 600; margin: 1.33em 0 0.5em; }
  h5 { font-size: 1em; font-weight: 600; margin: 1.67em 0 0.5em; }
  h6 { font-size: 0.875em; font-weight: 600; margin: 2.33em 0 0.5em; }

  p { margin: 0 0 1em; }

  ul, ol { padding-left: 2em; margin: 0 0 1em; }
  ul { list-style-type: disc; }
  ol { list-style-type: decimal; }
  li { margin: 0.25em 0; }

  blockquote {
    border-left: 4px solid #3b82f6;
    padding-left: 1em;
    margin: 1em 0;
    color: #6b7280;
    font-style: italic;
  }

  code {
    background: #f3f4f6;
    color: #e11d48;
    padding: 2px 6px;
    border-radius: 3px;
    font-family: 'Courier New', Courier, monospace;
    font-size: 0.9em;
  }

  pre {
    background: #1f2937;
    color: #f9fafb;
    padding: 1em;
    border-radius: 6px;
    overflow-x: auto;
    margin: 1em 0;
  }

  pre code {
    background: transparent;
    color: inherit;
    padding: 0;
  }

  a { color: #3b82f6; text-decoration: underline; }

  img, video {
    max-width: 100%;
    height: auto;
    border-radius: 4px;
    display: block;
    margin: 1em 0;
  }

  hr {
    border: none;
    border-top: 2px solid #e5e7eb;
    margin: 2em 0;
  }

  table {
    border-collapse: collapse;
    width: 100%;
    margin: 1em 0;
  }

  th, td {
    border: 1px solid #d1d5db;
    padding: 8px 12px;
    text-align: left;
  }

  th {
    background: #f3f4f6;
    font-weight: 600;
  }

  mark {
    background-color: #fef08a;
    padding: 2px 0;
  }

  @media print {
    body {
      padding: 0;
      margin: 0;
    }

    pre {
      white-space: pre-wrap;
      word-wrap: break-word;
    }

    img, video {
      page-break-inside: avoid;
    }

    h1, h2, h3, h4, h5, h6 {
      page-break-after: avoid;
    }
  }
`

export const Print = Extension.create<PrintOptions>({
  name: 'print',

  addOptions() {
    return {
      title: 'Print Document',
      styles: defaultPrintStyles,
    }
  },

  addCommands() {
    return {
      print:
        () =>
        ({ editor }) => {
          const content = editor.getHTML()
          const printWindow = window.open('', '_blank')

          if (!printWindow) {
            console.error('Failed to open print window. Please allow popups.')
            return false
          }

          const title = this.options.title || 'Print Document'
          const styles = this.options.styles || defaultPrintStyles

          printWindow.document.write(`
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <title>${title}</title>
                <style>${styles}</style>
              </head>
              <body>
                ${content}
              </body>
            </html>
          `)

          printWindow.document.close()

          // Wait for content to load, then print
          printWindow.onload = () => {
            printWindow.focus()
            printWindow.print()
            // Close window after printing (optional - some browsers close automatically)
            // printWindow.close()
          }

          // Fallback for browsers that don't trigger onload
          setTimeout(() => {
            printWindow.focus()
            printWindow.print()
          }, 500)

          return true
        },
    }
  },

  addKeyboardShortcuts() {
    return {
      'Mod-p': () => {
        return this.editor.commands.print()
      },
    }
  },
})
