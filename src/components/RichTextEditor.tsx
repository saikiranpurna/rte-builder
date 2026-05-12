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
import { AlignableImage } from "../extensions/AlignableImage";
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

// Lowlight for syntax highlighting
import { common, createLowlight } from "lowlight";

// Custom extensions
import { FontSize } from "../extensions/FontSize";
import { LineHeight } from "../extensions/LineHeight";
import { Video } from "../extensions/Video";
import { Emoji } from "../extensions/Emoji";
import { Fullscreen } from "../extensions/Fullscreen";
import { Print } from "../extensions/Print";
import { Indent } from "../extensions/Indent";

// Components
import { Toolbar } from "./Toolbar";

// Types
import type { EditorProps, EditorRef, ToolbarButton } from "../types";

// Create lowlight instance
const lowlight = createLowlight(common);

// Toolbar presets
const toolbarPresets: Record<"full" | "medium" | "simple", ToolbarButton[]> = {
  full: [
    "bold",
    "italic",
    "underline",
    "strike",
    "code",
    "separator",
    "subscript",
    "superscript",
    "clearFormatting",
    "separator",
    "fontFamily",
    "fontSize",
    "lineHeight",
    "textColor",
    "backgroundColor",
    "separator",
    "alignLeft",
    "alignCenter",
    "alignRight",
    "alignJustify",
    "separator",
    "indent",
    "outdent",
    "separator",
    "bulletList",
    "orderedList",
    "separator",
    "heading1",
    "heading2",
    "heading3",
    "blockquote",
    "separator",
    "link",
    "unlink",
    "image",
    "video",
    "table",
    "emoji",
    "separator",
    "codeBlock",
    "horizontalRule",
    "separator",
    "undo",
    "redo",
    "separator",
    "fullscreen",
    "print",
  ],
  medium: [
    "bold",
    "italic",
    "underline",
    "strike",
    "separator",
    "fontFamily",
    "fontSize",
    "textColor",
    "backgroundColor",
    "separator",
    "alignLeft",
    "alignCenter",
    "alignRight",
    "separator",
    "bulletList",
    "orderedList",
    "separator",
    "heading1",
    "heading2",
    "heading3",
    "separator",
    "link",
    "image",
    "table",
    "emoji",
    "separator",
    "undo",
    "redo",
    "fullscreen",
  ],
  simple: [
    "bold",
    "italic",
    "underline",
    "separator",
    "bulletList",
    "orderedList",
    "separator",
    "link",
    "image",
    "separator",
    "undo",
    "redo",
  ],
};

export const RichTextEditor = forwardRef<EditorRef, EditorProps>(
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
      toolbarPreset = "full",
      toolbarButtons,
      className = "",
      config = {},
      onMediaPickerImage,
      onMediaPickerVideo,
      enableCodeHighlight = true,
      defaultCodeLanguage = "javascript",
    },
    ref,
  ) => {
    // Determine which toolbar buttons to use
    const activeToolbarButtons =
      toolbarButtons || toolbarPresets[toolbarPreset];

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
        AlignableImage.configure({
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
        // New extensions
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
      },
      ...config,
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
      setContent: (html: string) => {
        editor?.commands.setContent(html);
      },
      focus: () => {
        editor?.commands.focus();
      },
      getEditor: () => {
        return editor;
      },
      insertHTML: (html: string) => {
        editor?.commands.insertContent(html);
      },
      clear: () => {
        editor?.commands.clearContent();
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
    }));

    if (!editor) {
      return null;
    }

    const characterCount = editor.storage.characterCount.characters();
    const characterLimit = charCounterMax > 0 ? charCounterMax : null;

    return (
      <div
        className={`rte-builder-wrapper ${disabled ? "disabled" : ""} ${readOnly ? "readonly" : ""} ${className}`}
      >
        <Toolbar
          editor={editor}
          buttons={activeToolbarButtons}
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

RichTextEditor.displayName = "RichTextEditor";
