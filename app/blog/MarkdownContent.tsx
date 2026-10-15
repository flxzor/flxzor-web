import CopyCode from "./CopyCode";
import Image from "next/image";
import type { ReactNode } from "react";

type RichNode = { type?: string; text?: string; url?: string; children?: RichNode[]; [key: string]: unknown };

function safeHref(value: string): string | null {
  const trimmed = value.trim();
  if (/^(https?:|mailto:|\/|#)/i.test(trimmed) && !/^\/\//.test(trimmed)) return trimmed;
  return null;
}

function safeImageSrc(value: string): string | null {
  const trimmed = value.trim();
  const safeUrl = safeHref(trimmed);
  if (safeUrl) return safeUrl;
  if (!trimmed || /^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(trimmed)) return null;
  try {
    const resolved = new URL(trimmed.replace(/\\/g, "/"), "https://markdown-image.invalid/");
    return resolved.origin === "https://markdown-image.invalid" ? `${resolved.pathname}${resolved.search}${resolved.hash}` : null;
  } catch {
    return null;
  }
}

function headingSlug(value: string): string {
  return value
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!?\[([^\]]+)\]\([^)]+\)/g, "$1")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s_-]/gu, "")
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-") || "section";
}

function uniqueHeadingId(value: string, counts: Map<string, number>): string {
  const slug = headingSlug(value);
  const count = counts.get(slug) ?? 0;
  counts.set(slug, count + 1);
  return count === 0 ? slug : `${slug}-${count}`;
}

function richText(nodes: RichNode[]): string {
  return nodes.map((node) => node.text ?? (node.children ? richText(node.children) : "")).join("");
}

function inline(text: string, keyPrefix: string): ReactNode[] {
  const output: ReactNode[] = [];
  let plain = "";
  let index = 0;
  let tokenIndex = 0;
  const flush = () => {
    if (plain) output.push(plain);
    plain = "";
  };
  const add = (node: ReactNode) => {
    flush();
    output.push(node);
    tokenIndex++;
  };
  const findClose = (from: number, marker: string) => {
    let close = from + marker.length;
    while ((close = text.indexOf(marker, close)) !== -1) {
      if (text[close - 1] === "\\") { close += marker.length; continue; }
      if (marker.length === 1 && text[close + 1] === marker) { close += 2; continue; }
      if (marker === "_" && /\w/.test(text[close + 1] ?? "")) { close += 1; continue; }
      return close;
    }
    return -1;
  };

  while (index < text.length) {
    const rest = text.slice(index);
    const linkedImageMatch = rest.match(/^\[!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)/);
    const imageMatch = rest.match(/^!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)/);
    const linkMatch = rest.match(/^\[([^\]]+)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)/);
    if (linkedImageMatch) {
      const src = safeImageSrc(linkedImageMatch[2]);
      const href = safeHref(linkedImageMatch[4]);
      if (src && href) {
        add(<a className="article-content__image-link" href={href} key={`${keyPrefix}-${tokenIndex}`} rel={href.startsWith("http") ? "noreferrer" : undefined} title={linkedImageMatch[5]}>
          <Image className="article-content__badge" src={src} alt={linkedImageMatch[1]} title={linkedImageMatch[3]} width={480} height={100} unoptimized />
        </a>);
      } else plain += linkedImageMatch[0];
      index += linkedImageMatch[0].length;
      continue;
    }
    if (imageMatch) {
      const src = safeImageSrc(imageMatch[2]);
      if (src) add(<Image className="article-content__image" src={src} alt={imageMatch[1]} title={imageMatch[3]} width={1600} height={1000} unoptimized key={`${keyPrefix}-${tokenIndex}`} />);
      else plain += imageMatch[0];
      index += imageMatch[0].length;
      continue;
    }
    if (linkMatch) {
      const href = safeHref(linkMatch[2]);
      if (href) {
        const isFigmaButton = /figma\.com/i.test(href) || /view on figma/i.test(linkMatch[1]);
        add(<a className={isFigmaButton ? "article-content__button" : undefined} href={href} key={`${keyPrefix}-${tokenIndex}`} rel={href.startsWith("http") ? "noreferrer" : undefined} title={linkMatch[3]}>{inline(linkMatch[1], `${keyPrefix}-link-${tokenIndex}`)}</a>);
      } else plain += linkMatch[0];
      index += linkMatch[0].length;
      continue;
    }
    const codeMatch = rest.match(/^(`+)(.+?)\1(?!`)/);
    if (codeMatch) {
      add(<code key={`${keyPrefix}-${tokenIndex}`}>{codeMatch[2].replace(/^ | $/g, "")}</code>);
      index += codeMatch[0].length;
      continue;
    }
    const breakMatch = rest.match(/^<br\s*\/?>/i);
    if (breakMatch) {
      add(<br key={`${keyPrefix}-${tokenIndex}`} />);
      index += breakMatch[0].length;
      continue;
    }
    const urlMatch = rest.match(/^https?:\/\/[^\s<]+/i);
    if (urlMatch) {
      const url = urlMatch[0].replace(/[.,!?;:]+$/, "");
      if (url) {
        add(<a href={url} key={`${keyPrefix}-${tokenIndex}`} rel="noreferrer">{url}</a>);
        plain += urlMatch[0].slice(url.length);
      } else plain += urlMatch[0];
      index += urlMatch[0].length;
      continue;
    }

    const marker = rest.startsWith("**") ? "**"
      : rest.startsWith("__") && !/\w/.test(text[index - 1] ?? "") ? "__"
      : rest.startsWith("~~") ? "~~"
      : rest.startsWith("*") && !/^\*\s/.test(rest) && rest[1] !== "*" ? "*"
      : rest.startsWith("_") && !/\w/.test(text[index - 1] ?? "") && !/^_\s/.test(rest) ? "_"
      : "";
    if (marker) {
      const close = findClose(index, marker);
      if (close > index + marker.length) {
        const content = text.slice(index + marker.length, close);
        const children = inline(content, `${keyPrefix}-format-${tokenIndex}`);
        if (marker === "~~") add(<del key={`${keyPrefix}-${tokenIndex}`}>{children}</del>);
        else if (marker.length === 2) add(<strong key={`${keyPrefix}-${tokenIndex}`}>{children}</strong>);
        else add(<em key={`${keyPrefix}-${tokenIndex}`}>{children}</em>);
        index = close + marker.length;
        continue;
      }
    }

    plain += text[index];
    index++;
  }
  flush();
  return output;
}

function renderQuoteContent(lines: string[], keyPrefix: string): ReactNode[] {
  const output: ReactNode[] = [];
  let index = 0;
  while (index < lines.length) {
    if (!lines[index].trim()) { index++; continue; }
    if (/^ {0,3}>\s?/.test(lines[index])) {
      const nested: string[] = [];
      while (index < lines.length) {
        if (/^ {0,3}>\s?/.test(lines[index])) nested.push(lines[index++].replace(/^ {0,3}>\s?/, ""));
        else if (!lines[index].trim() && /^ {0,3}>\s?/.test(lines[index + 1] ?? "")) { nested.push(""); index++; }
        else break;
      }
      output.push(<blockquote key={`${keyPrefix}-nested-${index}`}>{renderQuoteContent(nested, `${keyPrefix}-nested-${index}`)}</blockquote>);
      continue;
    }
    const paragraph = [lines[index++]];
    while (index < lines.length && lines[index].trim() && !/^ {0,3}>\s?/.test(lines[index])) paragraph.push(lines[index++]);
    output.push(<p key={`${keyPrefix}-paragraph-${index}`}>
      {paragraph.flatMap((text, lineIndex) => lineIndex
        ? [<br key={`${keyPrefix}-br-${index}-${lineIndex}`} />, ...inline(text, `${keyPrefix}-${index}-${lineIndex}`)]
        : inline(text, `${keyPrefix}-${index}-${lineIndex}`))}
    </p>);
  }
  return output;
}

type ListItem = { text: string; task?: boolean; checked?: boolean; children: ReactNode[] };

function parseList(lines: string[], start: number, keyPrefix: string): { node: ReactNode; next: number } {
  const first = lines[start].match(/^([ \t]*)([-+*]|\d+[.)])\s+(.*)$/)!;
  const baseIndent = first[1].replace(/\t/g, "    ").length;
  const ordered = /^\d/.test(first[2]);
  const items: ListItem[] = [];
  let index = start;

  while (index < lines.length) {
    if (!lines[index].trim()) {
      let next = index;
      while (next < lines.length && !lines[next].trim()) next++;
      const nextItem = lines[next]?.match(/^([ \t]*)([-+*]|\d+[.)])\s+(.*)$/);
      if (!nextItem) break;
      const nextIndent = nextItem[1].replace(/\t/g, "    ").length;
      if (nextIndent < baseIndent || (nextIndent === baseIndent && /^\d/.test(nextItem[2]) !== ordered)) break;
      index = next;
      continue;
    }

    const match = lines[index].match(/^([ \t]*)([-+*]|\d+[.)])\s+(.*)$/);
    if (!match) break;
    const indent = match[1].replace(/\t/g, "    ").length;
    const itemOrdered = /^\d/.test(match[2]);
    if (indent < baseIndent || (indent === baseIndent && itemOrdered !== ordered)) break;
    if (indent > baseIndent) {
      if (!items.length) break;
      const nested = parseList(lines, index, `${keyPrefix}-nested-${index}`);
      items[items.length - 1].children.push(nested.node);
      index = nested.next;
      continue;
    }

    const taskMatch = match[3].match(/^\[([ xX])\]\s+(.*)$/);
    const item: ListItem = {
      text: taskMatch ? taskMatch[2] : match[3],
      task: !!taskMatch,
      checked: taskMatch ? taskMatch[1].toLowerCase() === "x" : false,
      children: [],
    };
    items.push(item);
    index++;

    while (index < lines.length && lines[index].trim()) {
      const continuation = lines[index].match(/^([ \t]+)(.*)$/);
      if (!continuation) break;
      const continuationIndent = continuation[1].replace(/\t/g, "    ").length;
      if (continuationIndent <= baseIndent) break;
      if (/^([-+*]|\d+[.)])\s+/.test(continuation[2])) break;
      item.text += `\n${continuation[2]}`;
      index++;
    }
  }

  const allTasks = items.length > 0 && items.every((item) => item.task);
  const renderedItems = items.map((item, itemIndex) => <li className={item.task ? "article-task-item" : undefined} key={itemIndex}>
      {item.task && <input aria-label={item.checked ? "Completed task" : "Incomplete task"} checked={item.checked} readOnly tabIndex={-1} type="checkbox" />}
      <span>{inline(item.text, `${keyPrefix}-${itemIndex}`)}</span>
      {item.children}
    </li>);
  const node = ordered
    ? <ol className={allTasks ? "article-task-list" : undefined} key={keyPrefix} start={Number.parseInt(first[2], 10)}>{renderedItems}</ol>
    : <ul className={allTasks ? "article-task-list" : undefined} key={keyPrefix}>{renderedItems}</ul>;
  return { node, next: index };
}

function renderRich(nodes: RichNode[], prefix = "rich", headingCounts = new Map<string, number>()): ReactNode[] {
  return nodes.map((node, index) => {
    const key = `${prefix}-${index}`;
    const children = node.children ? renderRich(node.children, key, headingCounts) : node.text ?? "";
    switch (node.type?.toLowerCase()) {
      case "paragraph": return <p key={key}>{children}</p>;
      case "heading-one": case "h1": return <h2 id={uniqueHeadingId(richText(node.children ?? []), headingCounts)} key={key}>{children}</h2>;
      case "heading-two": case "h2": return <h2 id={uniqueHeadingId(richText(node.children ?? []), headingCounts)} key={key}>{children}</h2>;
      case "heading-three": case "h3": return <h3 id={uniqueHeadingId(richText(node.children ?? []), headingCounts)} key={key}>{children}</h3>;
      case "bulleted-list": case "unordered-list": return <ul key={key}>{children}</ul>;
      case "numbered-list": case "ordered-list": return <ol key={key}>{children}</ol>;
      case "list-item": return <li key={key}>{children}</li>;
      case "blockquote": return <blockquote key={key}>{children}</blockquote>;
      case "code-block": case "preformatted": {
        const code = richText(node.children ?? []);
        const language = typeof node.language === "string" ? node.language : "text";
        return <CopyCode code={code} language={language} key={key} />;
      }
      case "link": {
        const href = typeof node.url === "string" ? safeHref(node.url) : null;
        return href ? <a className={/figma\.com/i.test(href) ? "article-content__button" : undefined} href={href} key={key} rel={href.startsWith("http") ? "noreferrer" : undefined}>{children}</a> : <span key={key}>{children}</span>;
      }
      case "bold": case "strong": return <strong key={key}>{children}</strong>;
      case "italic": case "em": return <em key={key}>{children}</em>;
      case "code": return <code key={key}>{children}</code>;
      default: return <span key={key}>{children}</span>;
    }
  });
}

export default function MarkdownContent({ content }: { content: unknown }) {
  if (content && typeof content === "object") {
    const value = content as { raw?: unknown; markdown?: unknown; children?: RichNode[] };
    if (typeof value.markdown === "string") return <MarkdownContent content={value.markdown} />;
    const raw = value.raw;
    const nodes = Array.isArray(raw) ? raw : raw && typeof raw === "object" && Array.isArray((raw as { children?: unknown }).children) ? (raw as { children: RichNode[] }).children : value.children;
    if (nodes) return <>{renderRich(nodes)}</>;
    return <p>Article content is unavailable.</p>;
  }
  if (typeof content !== "string" || !content.trim()) return <p>Article content is unavailable.</p>;

  const normalized = content.replace(/\r\n?/g, "\n");
  const lines = normalized.split("\n");
  const blocks: ReactNode[] = [];
  const headingCounts = new Map<string, number>();
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) { i++; continue; }
    const fence = line.match(/^ {0,3}(`{3,}|~{3,})\s*([\w.+-]*)?.*$/);
    if (fence) {
      const code: string[] = [];
      const closingFence = new RegExp(`^ {0,3}${fence[1][0]}{${fence[1].length},}\\s*$`);
      i++;
      while (i < lines.length && !closingFence.test(lines[i])) code.push(lines[i++]);
      if (i < lines.length) i++;
      blocks.push(<CopyCode key={`code-${i}`} code={code.join("\n")} language={fence[2] || "text"} />);
      continue;
    }
    const heading = line.match(/^ {0,3}(#{1,6})\s+(.+?)\s*#*\s*$/);
    if (heading) {
      const Tag = `h${heading[1].length}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
      blocks.push(<Tag id={uniqueHeadingId(heading[2], headingCounts)} key={`heading-${i}`}>{inline(heading[2], `heading-${i}`)}</Tag>); i++; continue;
    }
    if (/^ {0,3}>\s?/.test(line)) {
      const quote: string[] = [];
      while (i < lines.length) {
        if (/^ {0,3}>\s?/.test(lines[i])) quote.push(lines[i++].replace(/^ {0,3}>\s?/, ""));
        else if (!lines[i].trim() && /^ {0,3}>\s?/.test(lines[i + 1] ?? "")) { quote.push(""); i++; }
        else break;
      }
      blocks.push(<blockquote key={`quote-${i}`}>{renderQuoteContent(quote, `quote-${i}`)}</blockquote>); continue;
    }
    if (/^\s*[-*+]\s+/.test(line) || /^\s*\d+[.)]\s+/.test(line)) {
      const list = parseList(lines, i, `list-${i}`);
      blocks.push(list.node);
      i = list.next;
      continue;
    }
    if (line.includes("|") && i + 1 < lines.length && /^\s*\|?\s*:?-{3,}/.test(lines[i + 1])) {
      const cells = (row: string) => row.trim().replace(/^\||\|$/g, "").split("|").map((cell) => cell.trim());
      const headers = cells(line); i += 2;
      const rows: string[][] = [];
      while (i < lines.length && lines[i].includes("|")) rows.push(cells(lines[i++]));
      blocks.push(<div className="article-table-scroll" key={`table-${i}`}><table><thead><tr>{headers.map((cell, n) => <th key={n}>{inline(cell, `th-${n}`)}</th>)}</tr></thead><tbody>{rows.map((row, n) => <tr key={n}>{headers.map((_, c) => <td key={c}>{inline(row[c] ?? "", `td-${n}-${c}`)}</td>)}</tr>)}</tbody></table></div>); continue;
    }
    if (/^\s*(?:(?:\*\s*){3,}|(?:-\s*){3,}|(?:_\s*){3,})$/.test(line)) { blocks.push(<hr key={`rule-${i}`} />); i++; continue; }
    const paragraph = [line]; i++;
    while (i < lines.length && lines[i].trim() && !/^( {0,3}#{1,6}\s| {0,3}`{3,}| {0,3}~{3,}| {0,3}>\s?|\s*[-*+]\s+|\s*\d+[.)]\s+)/.test(lines[i])) paragraph.push(lines[i++]);
    const paragraphContent: ReactNode[] = [];
    paragraph.forEach((text, index) => {
      const cleanText = text.replace(/\\$/, "").replace(/ {2,}$/, "");
      paragraphContent.push(...inline(cleanText, `p-${i}-${index}`));
      if (index < paragraph.length - 1) paragraphContent.push(<br key={`br-${i}-${index}`} />);
    });
    blocks.push(<p key={`p-${i}`}>{paragraphContent}</p>);
  }
  return <>{blocks}</>;
}
