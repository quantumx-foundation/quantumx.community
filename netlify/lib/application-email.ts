/**
 * Renders a chapter application as an HTML email.
 *
 * Email clients are not browsers: layout is tables, every style is inline, and
 * web fonts do not load. The site's pixel type falls back to a monospace stack,
 * which keeps the same squared-off feel. Colours are the tokens from
 * src/app/globals.css, hard-coded because the function cannot read the CSS.
 *
 * Everything interpolated here comes from a public form, so every value goes
 * through escapeHtml() before it reaches the markup.
 */

const C = {
  bg: "#0c0a0f",
  panel: "#131018",
  fg: "#f4eef6",
  muted: "#958c9f",
  line: "#2a2331",
  pink: "#e485b0",
  soft: "#f0b3cf",
  ink: "#2d1b55",
} as const;

const MONO = "'Geist Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
const SANS = "'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif";

export function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Escaped, with newlines from textareas kept as line breaks. */
function escapeMultiline(value: string) {
  return escapeHtml(value).replace(/\r?\n/g, "<br />");
}

/**
 * A link only when the applicant gave an http(s) URL, and the visible text is
 * always the URL itself: no anchor text that could disguise where it goes.
 */
function renderLink(value: string) {
  const safe = escapeHtml(value);
  if (!/^https?:\/\//i.test(value.trim())) return safe;
  return `<a href="${safe}" style="color:${C.pink};text-decoration:underline;">${safe}</a>`;
}

/**
 * Stacked colour blocks echoing the hero lockup on the site. Each word gets its
 * own table so the block hugs its text: rows of one table would all stretch to
 * the width of the longest word.
 */
function wordmark() {
  const block = (text: string, bg: string) =>
    `<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tbody><tr>
      <td style="background:${bg};color:${C.ink};font-family:${MONO};font-size:15px;font-weight:700;letter-spacing:3px;padding:5px 10px;line-height:1.1;">${text}</td>
    </tr></tbody></table>`;
  return `${block("QUANTUMX", C.pink)}${block("COMMUNITY", C.soft)}`;
}

function row(label: string, value: string, isLast: boolean) {
  const border = isLast ? "" : `border-bottom:1px solid ${C.line};`;
  return `<tr>
    <td style="padding:14px 20px;${border}">
      <div style="font-family:${MONO};font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:${C.muted};padding-bottom:5px;">${escapeHtml(label)}</div>
      <div style="font-family:${SANS};font-size:15px;line-height:1.55;color:${C.fg};">${value}</div>
    </td>
  </tr>`;
}

export type Application = Record<string, string>;

export function renderApplicationEmail(data: Application) {
  const get = (key: string) => (data[key] ?? "").trim();
  const blank = `<span style="color:${C.muted};">(blank)</span>`;

  const name = get("name") || "Someone";
  const where = [get("city"), get("country")].filter(Boolean).join(", ") || "a new city";
  const email = get("email");

  const entries: Array<[string, string]> = [
    ["Name", escapeHtml(name)],
    ["Email", email ? `<a href="mailto:${escapeHtml(email)}" style="color:${C.pink};text-decoration:underline;">${escapeHtml(email)}</a>` : blank],
    ["City", escapeHtml(get("city")) || blank],
    ["Country", escapeHtml(get("country")) || blank],
    ["What they do", escapeMultiline(get("background")) || blank],
    ["Who is with them", escapeMultiline(get("coleads")) || blank],
    ["Why this city, and what they would run first", escapeMultiline(get("plan")) || blank],
    ["A link to them", get("links") ? renderLink(get("links")) : blank],
    ["Code of conduct", get("conduct") ? "Accepted" : `<span style="color:${C.muted};">Not confirmed</span>`],
  ];

  const rows = entries.map(([label, value], i) => row(label, value, i === entries.length - 1)).join("");

  const preheader = `${name} wants to start a QuantumX chapter in ${where}.`;

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<meta name="color-scheme" content="dark" />
<meta name="supported-color-schemes" content="dark" />
<title>Chapter application</title>
</head>
<body style="margin:0;padding:0;background:${C.bg};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${escapeHtml(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${C.bg}" style="background:${C.bg};margin:0;padding:0;">
<tbody><tr><td align="center" style="padding:32px 16px;">

<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;">
<tbody>

<tr><td style="padding-bottom:28px;">${wordmark()}</td></tr>

<tr><td style="padding-bottom:6px;font-family:${MONO};font-size:10px;letter-spacing:2px;text-transform:uppercase;color:${C.pink};">New chapter application</td></tr>

<tr><td style="padding-bottom:28px;font-family:${SANS};font-size:26px;line-height:1.3;color:${C.fg};">
  ${escapeHtml(name)} wants to start a chapter in ${escapeHtml(where)}.
</td></tr>

<tr><td style="padding-bottom:28px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.panel};border:1px solid ${C.line};">
    <tbody>${rows}</tbody>
  </table>
</td></tr>

${
  email
    ? `<tr><td style="padding-bottom:28px;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tbody><tr>
    <td style="border:1px solid ${C.pink};">
      <a href="mailto:${escapeHtml(email)}?subject=${encodeURIComponent(`Your QuantumX chapter application (${where})`)}"
         style="display:inline-block;padding:14px 26px;font-family:${MONO};font-size:12px;letter-spacing:2px;text-transform:uppercase;color:${C.pink};text-decoration:none;">
        Reply to ${escapeHtml(name.split(" ")[0] || name)} &rarr;
      </a>
    </td>
  </tr></tbody></table>
</td></tr>`
    : ""
}

<tr><td style="border-top:1px solid ${C.line};padding-top:18px;font-family:${MONO};font-size:11px;line-height:1.7;letter-spacing:0.5px;color:${C.muted};">
  Sent by the chapter application form on
  <a href="https://quantumx.community/chapters/apply" style="color:${C.muted};text-decoration:underline;">quantumx.community</a>.<br />
  Reply straight to this email to reach the applicant.
</td></tr>

</tbody></table>

</td></tr></tbody></table>
</body>
</html>`;
}

/** Plain-text alternative, for clients that will not render the HTML. */
export function renderApplicationText(data: Application) {
  const get = (key: string) => (data[key] ?? "").trim();
  const name = get("name") || "Someone";
  const where = [get("city"), get("country")].filter(Boolean).join(", ") || "a new city";
  const lines = ["name", "email", "city", "country", "background", "coleads", "plan", "links"]
    .map((field) => `${field}: ${get(field) || "(blank)"}`)
    .join("\n");
  return `${name} wants to start a QuantumX chapter in ${where}.\n\n${lines}\n`;
}
