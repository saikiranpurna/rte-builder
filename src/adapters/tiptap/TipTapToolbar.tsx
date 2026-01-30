/**
 * TipTap Toolbar Component
 *
 * Toolbar implementation specific to TipTap editor.
 */

import React, { useState, useRef, useEffect } from "react";
import type { Editor } from "@tiptap/react";
import type { ToolbarButtonType } from "../../core/types";
import { EMOJI_CATEGORIES } from "../../extensions/Emoji";
import { CodeXml } from "lucide-react";

interface TipTapToolbarProps {
  editor: Editor | null;
  buttons: ToolbarButtonType[];
  onMediaPickerImage?: () => void;
  onMediaPickerVideo?: () => void;
}

const FONT_FAMILIES = [
  { value: "Arial", label: "Arial" },
  { value: "Georgia", label: "Georgia" },
  { value: "Times New Roman", label: "Times New Roman" },
  { value: "Courier New", label: "Courier New" },
  { value: "Verdana", label: "Verdana" },
  { value: "Roboto", label: "Roboto" },
  { value: "Open Sans", label: "Open Sans" },
  { value: "Lato", label: "Lato" },
  { value: "Montserrat", label: "Montserrat" },
  { value: "Poppins", label: "Poppins" },
];

const FONT_SIZES = [
  "8px",
  "10px",
  "12px",
  "14px",
  "16px",
  "18px",
  "20px",
  "24px",
  "30px",
  "36px",
  "48px",
  "60px",
  "72px",
];

const LINE_HEIGHTS = [
  { value: "1", label: "Single" },
  { value: "1.15", label: "1.15" },
  { value: "1.5", label: "1.5" },
  { value: "1.75", label: "1.75" },
  { value: "2", label: "Double" },
  { value: "2.5", label: "2.5" },
  { value: "3", label: "Triple" },
];

// Emoji Picker Component
const EmojiPicker: React.FC<{
  onSelect: (emoji: string) => void;
  onClose: () => void;
}> = ({ onSelect, onClose }) => {
  const [activeCategory, setActiveCategory] =
    useState<keyof typeof EMOJI_CATEGORIES>("smileys");
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div ref={popoverRef} className="rte-builder-emoji-picker">
      <div className="rte-builder-emoji-categories">
        {Object.entries(EMOJI_CATEGORIES).map(([key, category]) => (
          <button
            key={key}
            type="button"
            className={`rte-builder-emoji-category-btn ${activeCategory === key ? "active" : ""}`}
            onClick={() =>
              setActiveCategory(key as keyof typeof EMOJI_CATEGORIES)
            }
            title={category.label}
          >
            {category.emojis[0]}
          </button>
        ))}
      </div>
      <div className="rte-builder-emoji-grid">
        {EMOJI_CATEGORIES[activeCategory].emojis.map((emoji, i) => (
          <button
            key={`${emoji}-${i}`}
            type="button"
            className="rte-builder-emoji-btn"
            onClick={() => {
              onSelect(emoji);
              onClose();
            }}
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
};

export const TipTapToolbar: React.FC<TipTapToolbarProps> = ({
  editor,
  buttons,
  onMediaPickerImage,
  onMediaPickerVideo,
}) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiButtonRef = useRef<HTMLButtonElement>(null);

  if (!editor) return null;

  const ToolbarButton = ({
    onClick,
    active = false,
    disabled = false,
    children,
    title,
    buttonRef,
  }: {
    onClick: () => void;
    active?: boolean;
    disabled?: boolean;
    children: React.ReactNode;
    title?: string;
    buttonRef?: React.RefObject<HTMLButtonElement>;
  }) => (
    <button
      ref={buttonRef}
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`rte-builder-toolbar-btn ${active ? "active" : ""} ${disabled ? "disabled" : ""}`}
    >
      {children}
    </button>
  );

  const renderButton = (button: ToolbarButtonType, index: number) => {
    switch (button) {
      case "bold":
        return (
          <ToolbarButton
            key="bold"
            onClick={() => editor.chain().focus().toggleBold().run()}
            active={editor.isActive("bold")}
            title="Bold (Ctrl+B)"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z" />
            </svg>
          </ToolbarButton>
        );

      case "italic":
        return (
          <ToolbarButton
            key="italic"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            active={editor.isActive("italic")}
            title="Italic (Ctrl+I)"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4z" />
            </svg>
          </ToolbarButton>
        );

      case "underline":
        return (
          <ToolbarButton
            key="underline"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            active={editor.isActive("underline")}
            title="Underline (Ctrl+U)"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 17c3.31 0 6-2.69 6-6V3h-2.5v8c0 1.93-1.57 3.5-3.5 3.5S8.5 12.93 8.5 11V3H6v8c0 3.31 2.69 6 6 6zm-7 2v2h14v-2H5z" />
            </svg>
          </ToolbarButton>
        );

      case "strike":
        return (
          <ToolbarButton
            key="strike"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            active={editor.isActive("strike")}
            title="Strikethrough"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10 19h4v-3h-4v3zM5 4v3h5v3h4V7h5V4H5zM3 14h18v-2H3v2z" />
            </svg>
          </ToolbarButton>
        );

      case "code":
        return (
          <ToolbarButton
            key="code"
            onClick={() => editor.chain().focus().toggleCode().run()}
            active={editor.isActive("code")}
            title="Inline Code"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="16 18 22 12 16 6"></polyline>
              <polyline points="8 6 2 12 8 18"></polyline>
            </svg>
          </ToolbarButton>
        );

      case "codeBlock":
        return (
          <ToolbarButton
            key="codeBlock"
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            active={editor.isActive("codeBlock")}
            title="Code Block"
          >
            <CodeXml size={18} />
          </ToolbarButton>
        );

      case "subscript":
        return (
          <ToolbarButton
            key="subscript"
            onClick={() => editor.chain().focus().toggleSubscript().run()}
            active={editor.isActive("subscript")}
            title="Subscript"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22 18h-2v1h3v1h-4v-2.5a.5.5 0 01.5-.5h2a.5.5 0 00.5-.5v-.5H18v-1h4v2.5a.5.5 0 01-.5.5h-2a.5.5 0 00-.5.5v.5zM5.88 5h2.66l3.4 5.42h.12L15.5 5h2.62l-4.87 7.38L18.22 20h-2.66l-3.62-5.63h-.12l-3.62 5.63H5.56l4.92-7.62L5.88 5z" />
            </svg>
          </ToolbarButton>
        );

      case "superscript":
        return (
          <ToolbarButton
            key="superscript"
            onClick={() => editor.chain().focus().toggleSuperscript().run()}
            active={editor.isActive("superscript")}
            title="Superscript"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22 7h-2v1h3v1h-4V6.5a.5.5 0 01.5-.5h2a.5.5 0 00.5-.5v-.5H18V4h4v2.5a.5.5 0 01-.5.5h-2a.5.5 0 00-.5.5v.5zM5.88 5h2.66l3.4 5.42h.12L15.5 5h2.62l-4.87 7.38L18.22 20h-2.66l-3.62-5.63h-.12l-3.62 5.63H5.56l4.92-7.62L5.88 5z" />
            </svg>
          </ToolbarButton>
        );

      case "clearFormatting":
        return (
          <ToolbarButton
            key="clearFormatting"
            onClick={() =>
              editor.chain().focus().clearNodes().unsetAllMarks().run()
            }
            title="Clear Formatting"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3.27 5L2 6.27l6.97 6.97L6.5 19h3l1.57-3.66L16.73 21 18 19.73 3.55 5.27 3.27 5zM6 5v.18L8.82 8h2.4l-.72 1.68 2.1 2.1L14.21 8H20V5H6z" />
            </svg>
          </ToolbarButton>
        );

      case "fontFamily":
        return (
          <select
            key="fontFamily"
            className="rte-builder-toolbar-select"
            onChange={(e) => {
              if (e.target.value === "default") {
                editor.chain().focus().unsetFontFamily().run();
              } else {
                editor.chain().focus().setFontFamily(e.target.value).run();
              }
            }}
            value={editor.getAttributes("textStyle").fontFamily || "default"}
          >
            <option value="default">Font Family</option>
            {FONT_FAMILIES.map((font) => (
              <option key={font.value} value={font.value}>
                {font.label}
              </option>
            ))}
          </select>
        );

      case "fontSize":
        return (
          <select
            key="fontSize"
            className="rte-builder-toolbar-select"
            onChange={(e) => {
              if (e.target.value === "default") {
                editor.chain().focus().unsetFontSize().run();
              } else {
                editor.chain().focus().setFontSize(e.target.value).run();
              }
            }}
            value={editor.getAttributes("textStyle").fontSize || "default"}
          >
            <option value="default">Font Size</option>
            {FONT_SIZES.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        );

      case "lineHeight":
        return (
          <select
            key="lineHeight"
            className="rte-builder-toolbar-select rte-builder-toolbar-select-sm"
            onChange={(e) => {
              if (e.target.value === "default") {
                editor.chain().focus().unsetLineHeight().run();
              } else {
                editor.chain().focus().setLineHeight(e.target.value).run();
              }
            }}
            value={
              editor.getAttributes("paragraph").lineHeight ||
              editor.getAttributes("heading").lineHeight ||
              "default"
            }
            title="Line Height"
          >
            <option value="default">Line Height</option>
            {LINE_HEIGHTS.map((lh) => (
              <option key={lh.value} value={lh.value}>
                {lh.label}
              </option>
            ))}
          </select>
        );

      case "textColor":
        const textPresetColors = ["#11a161", "#85144b", "#ff851b", "#b10dc9"];
        return (
          <span key="textColor" className="rte-builder-toolbar-color-group">
            {textPresetColors.map((color) => (
              <button
                key={`text-${color}`}
                className="rte-builder-color-preset"
                style={{ backgroundColor: color }}
                onClick={() => editor.chain().focus().setColor(color).run()}
                title={`Text Color: ${color}`}
                type="button"
              />
            ))}
            <span className="rte-builder-toolbar-color">
              <label title="Custom Text Color">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
                </svg>
                <input
                  type="color"
                  onChange={(e) =>
                    editor.chain().focus().setColor(e.target.value).run()
                  }
                  value={editor.getAttributes("textStyle").color || "#000000"}
                />
              </label>
            </span>
          </span>
        );

      case "backgroundColor":
        const bgPresetColors = ["#11a161", "#85144b", "#ff851b", "#b10dc9"];
        return (
          <span
            key="backgroundColor"
            className="rte-builder-toolbar-color-group"
          >
            {bgPresetColors.map((color) => (
              <button
                key={`bg-${color}`}
                className="rte-builder-color-preset rte-builder-color-preset-bg"
                style={{ backgroundColor: color }}
                onClick={() =>
                  editor.chain().focus().toggleHighlight({ color }).run()
                }
                title={`Highlight Color: ${color}`}
                type="button"
              />
            ))}
            <span className="rte-builder-toolbar-color">
              <label title="Custom Background Color">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M16.56 8.94L7.62 0 6.21 1.41l2.38 2.38-5.15 5.15c-.59.59-.59 1.54 0 2.12l5.5 5.5c.29.29.68.44 1.06.44s.77-.15 1.06-.44l5.5-5.5c.59-.58.59-1.53 0-2.12zM5.21 10L10 5.21 14.79 10H5.21zM19 11.5s-2 2.17-2 3.5c0 1.1.9 2 2 2s2-.9 2-2c0-1.33-2-3.5-2-3.5z" />
                  <path d="M2 20h20v4H2z" fillOpacity=".36" />
                </svg>
                <input
                  type="color"
                  onChange={(e) =>
                    editor
                      .chain()
                      .focus()
                      .toggleHighlight({ color: e.target.value })
                      .run()
                  }
                  value={editor.getAttributes("highlight").color || "#ffff00"}
                />
              </label>
            </span>
          </span>
        );

      case "alignLeft":
        return (
          <ToolbarButton
            key="alignLeft"
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            active={editor.isActive({ textAlign: "left" })}
            title="Align Left"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15 15H3v2h12v-2zm0-8H3v2h12V7zM3 13h18v-2H3v2zm0 8h18v-2H3v2zM3 3v2h18V3H3z" />
            </svg>
          </ToolbarButton>
        );

      case "alignCenter":
        return (
          <ToolbarButton
            key="alignCenter"
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            active={editor.isActive({ textAlign: "center" })}
            title="Align Center"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7 15v2h10v-2H7zm-4 6h18v-2H3v2zm0-8h18v-2H3v2zm4-6v2h10V7H7zM3 3v2h18V3H3z" />
            </svg>
          </ToolbarButton>
        );

      case "alignRight":
        return (
          <ToolbarButton
            key="alignRight"
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            active={editor.isActive({ textAlign: "right" })}
            title="Align Right"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 21h18v-2H3v2zm6-4h12v-2H9v2zm-6-4h18v-2H3v2zm6-4h12V7H9v2zM3 3v2h18V3H3z" />
            </svg>
          </ToolbarButton>
        );

      case "alignJustify":
        return (
          <ToolbarButton
            key="alignJustify"
            onClick={() => editor.chain().focus().setTextAlign("justify").run()}
            active={editor.isActive({ textAlign: "justify" })}
            title="Justify"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 21h18v-2H3v2zm0-4h18v-2H3v2zm0-4h18v-2H3v2zm0-4h18V7H3v2zM3 3v2h18V3H3z" />
            </svg>
          </ToolbarButton>
        );

      case "indent":
        return (
          <ToolbarButton
            key="indent"
            onClick={() => editor.chain().focus().indent().run()}
            title="Indent (Tab)"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 21h18v-2H3v2zM3 8v8l4-4-4-4zm8 9h10v-2H11v2zM3 3v2h18V3H3zm8 6h10V7H11v2zm0 4h10v-2H11v2z" />
            </svg>
          </ToolbarButton>
        );

      case "outdent":
        return (
          <ToolbarButton
            key="outdent"
            onClick={() => editor.chain().focus().outdent().run()}
            title="Outdent (Shift+Tab)"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11 17h10v-2H11v2zm-8-5l4 4V8l-4 4zm0 9h18v-2H3v2zM3 3v2h18V3H3zm8 6h10V7H11v2zm0 4h10v-2H11v2z" />
            </svg>
          </ToolbarButton>
        );

      case "bulletList":
        return (
          <ToolbarButton
            key="bulletList"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            active={editor.isActive("bulletList")}
            title="Bullet List"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-6c-.83 0-1.5.67-1.5 1.5S3.17 7.5 4 7.5 5.5 6.83 5.5 6 4.83 4.5 4 4.5zm0 12c-.83 0-1.5.68-1.5 1.5s.68 1.5 1.5 1.5 1.5-.68 1.5-1.5-.67-1.5-1.5-1.5zM7 19h14v-2H7v2zm0-6h14v-2H7v2zm0-8v2h14V5H7z" />
            </svg>
          </ToolbarButton>
        );

      case "orderedList":
        return (
          <ToolbarButton
            key="orderedList"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            active={editor.isActive("orderedList")}
            title="Numbered List"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2 17h2v.5H3v1h1v.5H2v1h3v-4H2v1zm1-9h1V4H2v1h1v3zm-1 3h1.8L2 13.1v.9h3v-1H3.2L5 10.9V10H2v1zm5-6v2h14V5H7zm0 14h14v-2H7v2zm0-6h14v-2H7v2z" />
            </svg>
          </ToolbarButton>
        );

      case "heading1":
      case "heading2":
      case "heading3":
      case "heading4":
      case "heading5":
      case "heading6":
        const level = parseInt(button.replace("heading", "")) as
          | 1
          | 2
          | 3
          | 4
          | 5
          | 6;
        const headingIcons: Record<number, JSX.Element> = {
          1: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14h-2V9h-2V7h4v10z" />
            </svg>
          ),
          2: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-4 8c0 1.1-.9 2-2 2h-2v2h4v2H9v-4c0-1.1.9-2 2-2h2V9H9V7h4c1.1 0 2 .9 2 2v2z" />
            </svg>
          ),
          3: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-4 8c0 1.1-.9 2-2 2v0c1.1 0 2 .9 2 2v0c0 1.1-.9 2-2 2H9v-2h4v-2h-2v-2h2V9H9V7h4c1.1 0 2 .9 2 2v2z" />
            </svg>
          ),
          4: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-4 14h-2v-4H9V7h2v4h2V7h2v10z" />
            </svg>
          ),
          5: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-4 6h-4v2h2c1.1 0 2 .9 2 2v2c0 1.1-.9 2-2 2H9v-2h4v-2H9V7h6v2z" />
            </svg>
          ),
          6: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-4 8c0 1.1-.9 2-2 2h-2v-2h2V9H9v6h4c1.1 0 2-.9 2-2v-2c0-1.1-.9-2-2-2h-2V7h2c1.1 0 2 .9 2 2v2z" />
            </svg>
          ),
        };
        return (
          <ToolbarButton
            key={button}
            onClick={() =>
              editor.chain().focus().toggleHeading({ level }).run()
            }
            active={editor.isActive("heading", { level })}
            title={`Heading ${level}`}
          >
            {headingIcons[level]}
          </ToolbarButton>
        );

      case "blockquote":
        return (
          <ToolbarButton
            key="blockquote"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            active={editor.isActive("blockquote")}
            title="Blockquote"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" />
            </svg>
          </ToolbarButton>
        );

      case "horizontalRule":
        return (
          <ToolbarButton
            key="horizontalRule"
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            title="Horizontal Rule"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M4 11h16v2H4z" />
            </svg>
          </ToolbarButton>
        );

      case "link":
        return (
          <ToolbarButton
            key="link"
            onClick={() => {
              const url = window.prompt("Enter URL:");
              if (url) {
                editor.chain().focus().setLink({ href: url }).run();
              }
            }}
            active={editor.isActive("link")}
            title="Insert Link"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z" />
            </svg>
          </ToolbarButton>
        );

      case "unlink":
        return (
          <ToolbarButton
            key="unlink"
            onClick={() => editor.chain().focus().unsetLink().run()}
            disabled={!editor.isActive("link")}
            title="Remove Link"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17 7h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1 0 1.43-.98 2.63-2.31 2.98l1.46 1.46C20.88 15.61 22 13.95 22 12c0-2.76-2.24-5-5-5zm-1 4h-2.19l2 2H16v-2zM2 4.27l3.11 3.11C3.29 8.12 2 9.91 2 12c0 2.76 2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1 0-1.59 1.21-2.9 2.76-3.07L8.73 11H8v2h2.73L13 15.27V17h1.73l4.01 4L20 19.74 3.27 3 2 4.27z" />
            </svg>
          </ToolbarButton>
        );

      case "image":
        return (
          <ToolbarButton
            key="image"
            onClick={() => {
              if (onMediaPickerImage) {
                onMediaPickerImage();
              } else {
                const url = window.prompt("Enter image URL:");
                if (url) {
                  editor.chain().focus().setImage({ src: url }).run();
                }
              }
            }}
            title="Insert Image"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
            </svg>
          </ToolbarButton>
        );

      case "video":
        return (
          <ToolbarButton
            key="video"
            onClick={() => {
              if (onMediaPickerVideo) {
                onMediaPickerVideo();
              } else {
                const url = window.prompt("Enter video URL:");
                if (url) {
                  editor.chain().focus().setVideo({ src: url }).run();
                }
              }
            }}
            title="Insert Video"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
            </svg>
          </ToolbarButton>
        );

      case "table":
        return (
          <ToolbarButton
            key="table"
            onClick={() =>
              editor
                .chain()
                .focus()
                .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                .run()
            }
            title="Insert Table"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 2v4H5V5h14zm0 6v4h-6v-4h6zM5 15v-4h6v4H5zm0 2h6v2H5v-2zm8 2v-2h6v2h-6z" />
            </svg>
          </ToolbarButton>
        );

      case "emoji":
        return (
          <span key="emoji" style={{ position: "relative" }}>
            <ToolbarButton
              buttonRef={emojiButtonRef}
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              active={showEmojiPicker}
              title="Insert Emoji"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
              </svg>
            </ToolbarButton>
            {showEmojiPicker && (
              <EmojiPicker
                onSelect={(emoji) =>
                  editor.chain().focus().insertEmoji(emoji).run()
                }
                onClose={() => setShowEmojiPicker(false)}
              />
            )}
          </span>
        );

      case "fullscreen":
        const isFullscreen = editor.storage.fullscreen?.isFullscreen || false;
        return (
          <ToolbarButton
            key="fullscreen"
            onClick={() => editor.chain().focus().toggleFullscreen().run()}
            active={isFullscreen}
            title={
              isFullscreen
                ? "Exit Fullscreen (Esc)"
                : "Fullscreen (Ctrl+Shift+F)"
            }
          >
            {isFullscreen ? (
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" />
              </svg>
            ) : (
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
              </svg>
            )}
          </ToolbarButton>
        );

      case "print":
        return (
          <ToolbarButton
            key="print"
            onClick={() => editor.chain().focus().print().run()}
            title="Print (Ctrl+P)"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z" />
            </svg>
          </ToolbarButton>
        );

      case "undo":
        return (
          <ToolbarButton
            key="undo"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            title="Undo (Ctrl+Z)"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z" />
            </svg>
          </ToolbarButton>
        );

      case "redo":
        return (
          <ToolbarButton
            key="redo"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            title="Redo (Ctrl+Y)"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.4 10.6C16.55 8.99 14.15 8 11.5 8c-4.65 0-8.58 3.03-9.96 7.22L3.9 16c1.05-3.19 4.05-5.5 7.6-5.5 1.95 0 3.73.72 5.12 1.88L13 16h9V7l-3.6 3.6z" />
            </svg>
          </ToolbarButton>
        );

      case "separator":
        return (
          <div key={`sep-${index}`} className="rte-builder-toolbar-separator" />
        );

      default:
        return null;
    }
  };

  return <div className="rte-builder-toolbar">{buttons.map(renderButton)}</div>;
};

export default TipTapToolbar;
