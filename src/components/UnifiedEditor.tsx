/**
 * Unified Rich Text Editor Component
 *
 * This is the main entry point for the rte-builder library.
 * It provides a unified interface that works with any registered editor adapter.
 */

import { forwardRef, useImperativeHandle, useRef, useMemo, useState } from "react";
import type {
  UnifiedEditorProps,
  UnifiedEditorRef,
  EditorType,
  ToolbarButtonType,
  AdapterEditorRef,
} from "../core/types";
import {
  getAdapter,
  getBestAvailableEditor,
  getAvailableAdapters,
  registerAdapter,
} from "../core/registry";
import { getToolbarPreset, toolbarPresets } from "../core/presets";

// Import and register all adapters
import { TipTapAdapter } from "../adapters/tiptap";
import { SlateAdapter } from "../adapters/slate/SlateAdapter";
import { LexicalAdapter } from "../adapters/lexical/LexicalAdapter";

// Register adapters on module load (only if available)
registerAdapter(TipTapAdapter);
if (SlateAdapter.isAvailable()) {
  registerAdapter(SlateAdapter);
}
if (LexicalAdapter.isAvailable()) {
  registerAdapter(LexicalAdapter);
}

export const UnifiedEditor = forwardRef<UnifiedEditorRef, UnifiedEditorProps>(
  (
    {
      editor: editorType,
      showEditorSwitcher = false,
      onEditorChange,
      value = "",
      onChange,
      onBlur,
      onFocus,
      placeholder = "Start typing...",
      height = 400,
      minHeight = 300,
      maxHeight,
      disabled = false,
      readOnly = false,
      charCounterMax = -1,
      showCharCounter = false,
      toolbar = "full",
      toolbarButtons: customToolbarButtons,
      className = "",
      onMediaPickerImage,
      onMediaPickerVideo,
      enableCodeHighlight = true,
      defaultCodeLanguage = "javascript",
      editorConfig,
    },
    ref,
  ) => {
    const adapterRef = useRef<AdapterEditorRef>(null);
    const [internalEditorType, setInternalEditorType] = useState<EditorType | undefined>(editorType);

    // Get available adapters for the switcher
    const availableAdapters = useMemo(() => getAvailableAdapters(), []);

    // Determine which editor to use (controlled or internal state)
    const currentEditorType = editorType !== undefined ? editorType : internalEditorType;

    // Determine which editor to use
    const selectedAdapter = useMemo(() => {
      if (currentEditorType) {
        const adapter = getAdapter(currentEditorType);
        if (adapter?.isAvailable()) {
          return adapter;
        }
        console.warn(
          `Editor "${currentEditorType}" is not available. Falling back to best available.`,
        );
      }
      return getBestAvailableEditor();
    }, [currentEditorType]);

    // Handle editor switch
    const handleEditorSwitch = (newEditorType: EditorType) => {
      if (onEditorChange) {
        onEditorChange(newEditorType);
      } else {
        setInternalEditorType(newEditorType);
      }
    };

    // Determine toolbar buttons
    const toolbarButtons = useMemo((): ToolbarButtonType[] => {
      if (customToolbarButtons) {
        return customToolbarButtons;
      }

      if (typeof toolbar === "string") {
        return getToolbarPreset(toolbar as keyof typeof toolbarPresets);
      }

      if (toolbar.buttons) {
        return toolbar.buttons;
      }

      if (toolbar.preset) {
        return getToolbarPreset(toolbar.preset as keyof typeof toolbarPresets);
      }

      return getToolbarPreset("full");
    }, [toolbar, customToolbarButtons]);

    // Expose unified methods via ref
    useImperativeHandle(ref, () => ({
      getContent: () => adapterRef.current?.getContent() || "",
      getText: () => adapterRef.current?.getText() || "",
      getJSON: () => adapterRef.current?.getJSON(),
      setContent: (content: string) => adapterRef.current?.setContent(content),
      focus: () => adapterRef.current?.focus(),
      blur: () => adapterRef.current?.blur(),
      insertHTML: (html: string) => adapterRef.current?.insertHTML(html),
      insertText: (text: string) => adapterRef.current?.insertText(text),
      clear: () => adapterRef.current?.clear(),
      isEmpty: () => adapterRef.current?.isEmpty() ?? true,
      getCharacterCount: () => adapterRef.current?.getCharacterCount() || 0,
      getWordCount: () => adapterRef.current?.getWordCount() || 0,
      isFullscreen: () => adapterRef.current?.isFullscreen() || false,
      toggleFullscreen: () => adapterRef.current?.toggleFullscreen(),
      print: () => adapterRef.current?.print(),
      undo: () => adapterRef.current?.undo(),
      redo: () => adapterRef.current?.redo(),
      canUndo: () => adapterRef.current?.canUndo() ?? false,
      canRedo: () => adapterRef.current?.canRedo() ?? false,
      getNativeEditor: () => adapterRef.current?.getNativeEditor(),
      getEditorType: () => selectedAdapter?.type || ("tiptap" as EditorType),
    }));

    // Handle case where no editor is available
    if (!selectedAdapter) {
      return (
        <div className={`rte-builder-wrapper rte-builder-error ${className}`}>
          <div className="rte-builder-error-message">
            No editor available. Please install an editor package:
            <br />
            <code>npm install @tiptap/react @tiptap/starter-kit</code>
          </div>
        </div>
      );
    }

    // Get the editor component from the adapter
    const EditorComponent = selectedAdapter.getComponent();

    // Handle onChange to ensure it's always called
    const handleChange = (content: string) => {
      onChange?.(content);
    };

    return (
      <div className={`rte-builder-unified-wrapper ${className}`}>
        {showEditorSwitcher && availableAdapters.length > 1 && (
          <div className="rte-builder-editor-switcher">
            <label className="rte-builder-editor-switcher-label">Editor:</label>
            <select
              className="rte-builder-editor-switcher-select"
              value={selectedAdapter.type}
              onChange={(e) => handleEditorSwitch(e.target.value as EditorType)}
              disabled={disabled}
            >
              {availableAdapters.map((adapter) => (
                <option key={adapter.type} value={adapter.type}>
                  {adapter.name}
                </option>
              ))}
            </select>
          </div>
        )}
        <EditorComponent
          key={selectedAdapter.type}
          editorRef={adapterRef}
          value={value}
          onChange={handleChange}
          onBlur={onBlur}
          onFocus={onFocus}
          placeholder={placeholder}
          height={height}
          minHeight={minHeight}
          maxHeight={maxHeight}
          disabled={disabled}
          readOnly={readOnly}
          charCounterMax={charCounterMax}
          showCharCounter={showCharCounter}
          toolbarButtons={toolbarButtons}
          onMediaPickerImage={onMediaPickerImage}
          onMediaPickerVideo={onMediaPickerVideo}
          enableCodeHighlight={enableCodeHighlight}
          defaultCodeLanguage={defaultCodeLanguage}
          editorConfig={editorConfig}
        />
      </div>
    );
  },
);

UnifiedEditor.displayName = "UnifiedEditor";

export default UnifiedEditor;
