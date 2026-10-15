"use client";

import { useState } from "react";

const LANGUAGE_NAMES: Record<string, string> = {
  js: "JavaScript", javascript: "JavaScript", ts: "TypeScript", typescript: "TypeScript", jsx: "JSX", tsx: "TSX",
  html: "HTML", css: "CSS", json: "JSON", py: "Python", python: "Python", java: "Java", sh: "Bash", bash: "Bash", sql: "SQL", text: "Text",
};

function highlight(code: string) {
  const parts = code.split(/(\/\/[^\n]*|#[^\n]*|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|\b(?:const|let|var|function|return|if|else|import|from|export|default|class|new|async|await|true|false|null|undefined|def|print|SELECT|FROM|WHERE|CREATE|TABLE)\b|\b\d+(?:\.\d+)?\b)/g);
  return parts.map((part, i) => {
    const kind = /^(\/\/|#)/.test(part) ? "comment" : /^("|'|`)/.test(part) ? "string" : /^(const|let|var|function|return|if|else|import|from|export|default|class|new|async|await|true|false|null|undefined|def|print|SELECT|FROM|WHERE|CREATE|TABLE)$/.test(part) ? "keyword" : /^\d/.test(part) ? "number" : "";
    return kind ? <span className={`code-token code-token--${kind}`} key={i}>{part}</span> : part;
  });
}

export default function CopyCode({ code, language }: { code: string; language: string }) {
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true); setFailed(false);
      window.setTimeout(() => setCopied(false), 1800);
    } catch { setFailed(true); setCopied(false); }
  };
  return <figure className="article-code">
    <figcaption><span>{LANGUAGE_NAMES[language.toLowerCase()] ?? language.toUpperCase()}</span><button type="button" onClick={copy} aria-label={`Copy ${LANGUAGE_NAMES[language.toLowerCase()] ?? language} code`}>{copied ? "Copied!" : failed ? "Copy failed" : "Copy"}</button></figcaption>
    <pre><code>{highlight(code)}</code></pre>
  </figure>;
}
