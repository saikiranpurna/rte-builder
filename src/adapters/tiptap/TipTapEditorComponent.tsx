/**
 * TipTap Editor Component
 *
 * This is the actual TipTap editor implementation that conforms
 * to the adapter interface.
 */

import { useEffect, useImperativeHandle, forwardRef, useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import { Document } from "@tiptap/extension-document";
import { Paragraph } from "@tiptap/extension-paragraph";
import { Text } from "@tiptap/extension-text";
import { Bold } from "@tiptap/extension-bold";
import { Italic } from "@tiptap/extension-italic";
import { Underline } from "@tiptap/extension-underline";
import { Strike } from "@tiptap/extension-strike";
import { Code } from "@tiptap/extension-code";
import { CodeBlockLowlight } from "@tiptap/extension-code-block-lowlight";
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";
import { TextStyle } from "@tiptap/extension-text-style";
import { FontFamily } from "@tiptap/extension-font-family";
import { Color } from "@tiptap/extension-color";
import { Highlight } from "@tiptap/extension-highlight";
import { TextAlign } from "@tiptap/extension-text-align";
import { Heading } from "@tiptap/extension-heading";
import { BulletList } from "@tiptap/extension-bullet-list";
import { OrderedList } from "@tiptap/extension-ordered-list";
import { ListItem } from "@tiptap/extension-list-item";
import { Blockquote } from "@tiptap/extension-blockquote";
import { HorizontalRule } from "@tiptap/extension-horizontal-rule";
import { Link } from "@tiptap/extension-link";
import { Image } from "@tiptap/extension-image";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import { History } from "@tiptap/extension-history";
import { Placeholder } from "@tiptap/extension-placeholder";
import { CharacterCount } from "@tiptap/extension-character-count";
import { Gapcursor } from "@tiptap/extension-gapcursor";
import { Dropcursor } from "@tiptap/extension-dropcursor";
import { HardBreak } from "@tiptap/extension-hard-break";
import { common, createLowlight } from "lowlight";

// Custom extensions
import { FontSize } from "../../extensions/FontSize";
import { LineHeight } from "../../extensions/LineHeight";
import { Video } from "../../extensions/Video";
import { Emoji } from "../../extensions/Emoji";
import { Fullscreen } from "../../extensions/Fullscreen";
import { Print } from "../../extensions/Print";
import { Indent } from "../../extensions/Indent";

// Toolbar
import { TipTapToolbar } from "./TipTapToolbar";

// Types
import type { AdapterComponentProps, AdapterEditorRef } from "../../core/types";

// Create lowlight instance
const lowlight = createLowlight(common);

interface TipTapEditorComponentProps extends AdapterComponentProps {}

export const TipTapEditorComponent = forwardRef<
  AdapterEditorRef,
  TipTapEditorComponentProps
>(
  (
    {
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
      toolbarButtons,
      className = "",
      onMediaPickerImage,
      onMediaPickerVideo,
      enableCodeHighlight = true,
      defaultCodeLanguage = "javascript",
      editorConfig = {},
    },
    ref,
  ) => {
    // Initialize editor
    const editor = useEditor({
      extensions: [
        Document,
        Paragraph,
        Text,
        Bold,
        Italic,
        Underline,
        Strike,
        Code,
        enableCodeHighlight
          ? CodeBlockLowlight.configure({
              lowlight,
              defaultLanguage: defaultCodeLanguage,
            })
          : CodeBlockLowlight.configure({
              lowlight: null as any,
            }),
        Subscript,
        Superscript,
        TextStyle,
        FontFamily,
        FontSize,
        Color,
        Highlight.configure({ multicolor: true }),
        LineHeight,
        TextAlign.configure({
          types: ["heading", "paragraph"],
        }),
        Heading.configure({
          levels: [1, 2, 3, 4, 5, 6],
        }),
        BulletList,
        OrderedList,
        ListItem,
        Blockquote,
        HorizontalRule,
        Link.configure({
          openOnClick: false,
          HTMLAttributes: {
            target: "_blank",
            rel: "noopener noreferrer",
          },
        }),
        Image.configure({
          inline: false,
          allowBase64: true,
        }),
        Video,
        Table.configure({
          resizable: true,
        }),
        TableRow,
        TableCell,
        TableHeader,
        History,
        Placeholder.configure({
          placeholder,
        }),
        CharacterCount.configure({
          limit: charCounterMax > 0 ? charCounterMax : undefined,
        }),
        Gapcursor,
        Dropcursor,
        HardBreak,
        Emoji,
        Fullscreen,
        Print,
        Indent,
      ],
      content: value,
      editable: !disabled && !readOnly,
      onUpdate: ({ editor }) => {
        const html = editor.getHTML();
        onChange?.(html);
      },
      onBlur: () => {
        onBlur?.();
      },
      onFocus: () => {
        onFocus?.();
      },
      editorProps: {
        attributes: {
          class: "rte-builder-content",
          style: `min-height: ${minHeight}px; ${maxHeight ? `max-height: ${maxHeight}px;` : ""}`,
        },
        transformPastedHTML(html) {
          return html
            // Remove excessive line breaks (3+ consecutive <br>)
            .replace(/(<br\s*\/?>\s*){3,}/gi, "<br><br>")
            // Collapse multiple blank paragraphs into one
            .replace(/(<p>\s*<\/p>\s*){2,}/gi, "<p></p>")
            // Remove excessive whitespace between tags
            .replace(/>\s{2,}</g, "> <")
            // Normalize multiple &nbsp; sequences to single space
            .replace(/(&nbsp;\s*){2,}/g, "&nbsp;")
            // Remove zero-width spaces and other invisible chars
            .replace(/[\u200B\u200C\u200D\uFEFF]/g, "")
            // Clean up pasted inline styles that cause spacing issues
            .replace(
              /style="[^"]*"/gi,
              (match) =>
                match
                  .replace(/margin(-top|-bottom):\s*[\d.]+(px|em|rem|pt)\s*;?/gi, "")
                  .replace(/padding(-top|-bottom):\s*[\d.]+(px|em|rem|pt)\s*;?/gi, "")
                  .replace(/line-height:\s*[\d.]+(px|em|rem|pt|%)?\s*;?/gi, "")
                  .replace(/style="\s*"/gi, ""),
            );
        },
      },
      ...editorConfig,
    });

    // Update content when value prop changes
    useEffect(() => {
      if (editor && value !== editor.getHTML()) {
        editor.commands.setContent(value);
      }
    }, [value, editor]);

    // Update editable state
    useEffect(() => {
      if (editor) {
        editor.setEditable(!disabled && !readOnly);
      }
    }, [disabled, readOnly, editor]);

    // Handle media picker for images
    const handleMediaPickerImage = useCallback(async () => {
      if (onMediaPickerImage && editor) {
        const file = await onMediaPickerImage();
        if (file) {
          editor
            .chain()
            .focus()
            .setImage({ src: file.url, alt: file.alt || file.name })
            .run();
        }
      }
    }, [onMediaPickerImage, editor]);

    // Handle media picker for videos
    const handleMediaPickerVideo = useCallback(async () => {
      if (onMediaPickerVideo && editor) {
        const file = await onMediaPickerVideo();
        if (file) {
          editor
            .chain()
            .focus()
            .setVideo({ src: file.url, alt: file.alt || file.name })
            .run();
        }
      }
    }, [onMediaPickerVideo, editor]);

    // Expose methods via ref
    useImperativeHandle(ref, () => ({
      getContent: () => {
        return editor?.getHTML() || "";
      },
      getText: () => {
        return editor?.getText() || "";
      },
      getJSON: () => {
        return editor?.getJSON();
      },
      setContent: (html: string) => {
        editor?.commands.setContent(html);
      },
      focus: () => {
        editor?.commands.focus();
      },
      blur: () => {
        editor?.commands.blur();
      },
      insertHTML: (html: string) => {
        editor?.commands.insertContent(html);
      },
      insertText: (text: string) => {
        editor?.commands.insertContent(text);
      },
      clear: () => {
        editor?.commands.clearContent();
      },
      isEmpty: () => {
        return editor?.isEmpty ?? true;
      },
      getCharacterCount: () => {
        return editor?.storage.characterCount?.characters() || 0;
      },
      getWordCount: () => {
        return editor?.storage.characterCount?.words() || 0;
      },
      isFullscreen: () => {
        return editor?.storage.fullscreen?.isFullscreen || false;
      },
      toggleFullscreen: () => {
        editor?.commands.toggleFullscreen();
      },
      print: () => {
        editor?.commands.print();
      },
      undo: () => {
        editor?.commands.undo();
      },
      redo: () => {
        editor?.commands.redo();
      },
      canUndo: () => {
        return editor?.can().undo() ?? false;
      },
      canRedo: () => {
        return editor?.can().redo() ?? false;
      },
      getNativeEditor: () => {
        return editor;
      },
    }));

    if (!editor) {
      return null;
    }

    const characterCount = editor.storage.characterCount?.characters() || 0;
    const characterLimit = charCounterMax > 0 ? charCounterMax : null;

    return (
      <div
        className={`rte-builder-wrapper ${disabled ? "disabled" : ""} ${readOnly ? "readonly" : ""} ${className}`}
      >
        <TipTapToolbar
          editor={editor}
          buttons={toolbarButtons}
          onMediaPickerImage={
            onMediaPickerImage ? handleMediaPickerImage : undefined
          }
          onMediaPickerVideo={
            onMediaPickerVideo ? handleMediaPickerVideo : undefined
          }
        />
        <div
          className="rte-builder-container"
          style={{ height: `${height}px` }}
        >
          <EditorContent editor={editor} />
        </div>
        {showCharCounter && (
          <div className="rte-builder-footer">
            <div className="rte-builder-char-counter">
              {characterCount}
              {characterLimit && ` / ${characterLimit}`}
              {characterLimit && characterCount > characterLimit && (
                <span className="rte-builder-char-counter-exceeded">
                  {" "}
                  (limit exceeded)
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    );
  },
);

TipTapEditorComponent.displayName = "TipTapEditorComponent";

export default TipTapEditorComponent;
