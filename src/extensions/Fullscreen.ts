import { Extension } from '@tiptap/core'

export interface FullscreenOptions {
  className: string
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    fullscreen: {
      /**
       * Toggle fullscreen mode
       */
      toggleFullscreen: () => ReturnType
      /**
       * Enter fullscreen mode
       */
      enterFullscreen: () => ReturnType
      /**
       * Exit fullscreen mode
       */
      exitFullscreen: () => ReturnType
    }
  }
}

export const Fullscreen = Extension.create<FullscreenOptions>({
  name: 'fullscreen',

  addOptions() {
    return {
      className: 'rte-builder-fullscreen',
    }
  },

  addStorage() {
    return {
      isFullscreen: false,
    }
  },

  addCommands() {
    return {
      toggleFullscreen:
        () =>
        ({ editor }) => {
          const wrapper = editor.view.dom.closest('.rte-builder-wrapper') as HTMLElement
          if (!wrapper) return false

          this.storage.isFullscreen = !this.storage.isFullscreen

          if (this.storage.isFullscreen) {
            wrapper.classList.add(this.options.className)
            document.body.style.overflow = 'hidden'
          } else {
            wrapper.classList.remove(this.options.className)
            document.body.style.overflow = ''
          }

          // Trigger re-render to update button state
          editor.view.dispatch(editor.state.tr)

          return true
        },
      enterFullscreen:
        () =>
        ({ editor }) => {
          const wrapper = editor.view.dom.closest('.rte-builder-wrapper') as HTMLElement
          if (!wrapper) return false

          this.storage.isFullscreen = true
          wrapper.classList.add(this.options.className)
          document.body.style.overflow = 'hidden'
          editor.view.dispatch(editor.state.tr)

          return true
        },
      exitFullscreen:
        () =>
        ({ editor }) => {
          const wrapper = editor.view.dom.closest('.rte-builder-wrapper') as HTMLElement
          if (!wrapper) return false

          this.storage.isFullscreen = false
          wrapper.classList.remove(this.options.className)
          document.body.style.overflow = ''
          editor.view.dispatch(editor.state.tr)

          return true
        },
    }
  },

  addKeyboardShortcuts() {
    return {
      Escape: () => {
        if (this.storage.isFullscreen) {
          return this.editor.commands.exitFullscreen()
        }
        return false
      },
      'Mod-Shift-f': () => {
        return this.editor.commands.toggleFullscreen()
      },
    }
  },
})
