import { useState } from "react";

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
}

export function CodeBlock({
  code,
  language = "tsx",
  filename,
  showLineNumbers = true,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = code.trim().split("\n");

  return (
    <div className="code-block">
      <div className="code-block-header">
        <div className="code-block-info">
          {filename && <span className="code-block-filename">{filename}</span>}
          {!filename && language && (
            <span className="code-block-lang">{language}</span>
          )}
        </div>
        <button
          className={`code-block-copy ${copied ? "copied" : ""}`}
          onClick={handleCopy}
          aria-label="Copy code"
        >
          {copied ? (
            <>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>Copied!</span>
            </>
          ) : (
            <>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      <div className="code-block-content">
        <pre>
          {showLineNumbers ? (
            <div className="code-with-lines">
              <div className="line-numbers-column" aria-hidden="true">
                {lines.map((_, i) => (
                  <span key={i} className="line-num">
                    {i + 1}
                  </span>
                ))}
              </div>
              <code className="code-content-column">{code.trim()}</code>
            </div>
          ) : (
            <code>{code.trim()}</code>
          )}
        </pre>
      </div>
    </div>
  );
}
