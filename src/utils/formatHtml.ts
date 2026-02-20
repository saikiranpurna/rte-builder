/**
 * Lightweight HTML formatter for the code block source view.
 * Formats raw HTML into readable, indented markup.
 */

const VOID_ELEMENTS = new Set([
  "area", "base", "br", "col", "embed", "hr", "img", "input",
  "link", "meta", "param", "source", "track", "wbr",
]);

const BLOCK_ELEMENTS = new Set([
  "address", "article", "aside", "blockquote", "body", "details", "dialog",
  "dd", "div", "dl", "dt", "fieldset", "figcaption", "figure", "footer",
  "form", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup",
  "hr", "html", "li", "main", "nav", "ol", "p", "pre", "section",
  "table", "tbody", "td", "tfoot", "th", "thead", "tr", "ul",
]);

interface Token {
  type: "open" | "close" | "self-close" | "text" | "comment" | "doctype";
  tag?: string;
  raw: string;
}

function tokenize(html: string): Token[] {
  const tokens: Token[] = [];
  const re = /<!--[\s\S]*?-->|<!DOCTYPE[^>]*>|<\/([a-zA-Z][a-zA-Z0-9]*)\s*>|<([a-zA-Z][a-zA-Z0-9]*)(\s[^>]*)?\s*\/?>|[^<]+/gi;
  let match: RegExpExecArray | null;

  while ((match = re.exec(html)) !== null) {
    const raw = match[0];

    if (raw.startsWith("<!--")) {
      tokens.push({ type: "comment", raw });
    } else if (raw.startsWith("<!")) {
      tokens.push({ type: "doctype", raw });
    } else if (match[1]) {
      // Closing tag
      tokens.push({ type: "close", tag: match[1].toLowerCase(), raw });
    } else if (match[2]) {
      // Opening tag
      const tag = match[2].toLowerCase();
      const isVoid = VOID_ELEMENTS.has(tag) || raw.endsWith("/>");
      tokens.push({
        type: isVoid ? "self-close" : "open",
        tag,
        raw,
      });
    } else {
      // Text node
      const text = raw;
      if (text.trim()) {
        tokens.push({ type: "text", raw: text });
      }
    }
  }

  return tokens;
}

export function formatHtml(html: string, indentStr: string = "  "): string {
  if (!html || !html.trim()) return html;

  const tokens = tokenize(html.trim());
  const lines: string[] = [];
  let depth = 0;

  for (const token of tokens) {
    const indent = indentStr.repeat(depth);

    switch (token.type) {
      case "open": {
        const isBlock = BLOCK_ELEMENTS.has(token.tag!);
        if (isBlock) {
          lines.push(`${indent}${token.raw}`);
          depth++;
        } else {
          // Inline elements: check if the content until closing tag is short
          lines.push(`${indent}${token.raw}`);
          depth++;
        }
        break;
      }
      case "close": {
        depth = Math.max(0, depth - 1);
        const closeIndent = indentStr.repeat(depth);
        lines.push(`${closeIndent}${token.raw}`);
        break;
      }
      case "self-close":
      case "comment":
      case "doctype":
        lines.push(`${indent}${token.raw}`);
        break;
      case "text":
        lines.push(`${indent}${token.raw.trim()}`);
        break;
    }
  }

  // Collapse inline elements onto one line when the content is simple text
  // e.g., <strong>\n  text\n</strong> → <strong>text</strong>
  return collapseInlineTags(lines.join("\n"));
}

/**
 * Collapse simple inline patterns like:
 *   <span>
 *     text
 *   </span>
 * into: <span>text</span>
 */
function collapseInlineTags(formatted: string): string {
  // Match: opening inline tag, newline + indent + text-only content, newline + indent + closing tag
  return formatted.replace(
    /^(\s*)<((?!\/)[a-zA-Z][a-zA-Z0-9]*)([^>]*)>\n\s+([^<\n]+)\n\s*<\/\2>/gm,
    (match, indent, tag, attrs, text) => {
      if (BLOCK_ELEMENTS.has(tag.toLowerCase())) return match;
      return `${indent}<${tag}${attrs}>${text.trim()}</${tag}>`;
    },
  );
}
