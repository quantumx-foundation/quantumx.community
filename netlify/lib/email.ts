/**
 * The shell every form notification is rendered into.
 *
 * Email clients are not browsers: layout is tables, every style is inline, and
 * web fonts do not load. The site's pixel type falls back to a monospace stack,
 * which keeps the same squared-off feel. Colours are the tokens from
 * src/app/globals.css, hard-coded because the function cannot read the CSS.
 *
 * Everything interpolated here comes from a public form, so every value goes
 * through escapeHtml() before it reaches the markup.
 */

export const C = {
  bg: "#0c0a0f",
  panel: "#131018",
  fg: "#f4eef6",
  muted: "#958c9f",
  line: "#2a2331",
  pink: "#e485b0",
  soft: "#f0b3cf",
  ink: "#2d1b55",
} as const;

export const MONO = "'Geist Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
export const SANS = "'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif";

export type Submission = Record<string, string>;

export function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Escaped, with newlines from textareas kept as line breaks. */
export function escapeMultiline(value: string) {
  return escapeHtml(value).replace(/\r?\n/g, "<br />");
}

/**
 * A link only when the sender gave an http(s) URL, and the visible text is
 * always the URL itself: no anchor text that could disguise where it goes.
 */
export function renderLink(value: string) {
  const safe = escapeHtml(value);
  if (!/^https?:\/\//i.test(value.trim())) return safe;
  return `<a href="${safe}" style="color:${C.pink};text-decoration:underline;">${safe}</a>`;
}

export function mailtoLink(email: string) {
  return `<a href="mailto:${escapeHtml(email)}" style="color:${C.pink};text-decoration:underline;">${escapeHtml(email)}</a>`;
}

export const blank = `<span style="color:${C.muted};">(blank)</span>`;

/** Reads a submission field, trimmed, so callers never juggle undefined. */
export function reader(data: Submission) {
  return (key: string) => (data[key] ?? "").trim();
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

/** A label above its value. Pass pre-escaped HTML as the value. */
export type Entry = [label: string, value: string];

function row([label, value]: Entry, isLast: boolean) {
  const border = isLast ? "" : `border-bottom:1px solid ${C.line};`;
  return `<tr>
    <td style="padding:14px 20px;${border}">
      <div style="font-family:${MONO};font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:${C.muted};padding-bottom:5px;">${escapeHtml(label)}</div>
      <div style="font-family:${SANS};font-size:15px;line-height:1.55;color:${C.fg};">${value}</div>
    </td>
  </tr>`;
}

/** A line above the table, for anything that needs the reader's attention. */
export function notice(text: string) {
  return `<tr><td style="padding-bottom:20px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid ${C.pink};"><tbody><tr>
      <td style="padding:12px 20px;font-family:${MONO};font-size:12px;line-height:1.6;letter-spacing:0.5px;color:${C.pink};">${escapeHtml(text)}</td>
    </tr></tbody></table>
  </td></tr>`;
}

export type Email = {
  /** Small pink line above the headline. */
  eyebrow: string;
  /** One sentence, already escaped. */
  heading: string;
  /** Hidden line email clients show next to the subject. */
  preheader: string;
  entries: Entry[];
  /** Optional warning block between the headline and the table. */
  flag?: string;
  /** Reply button, when the sender left an address. */
  reply?: { email: string; label: string; subject: string };
  /** The page this came from, linked in the footer. */
  source: { label: string; url: string };
};

export function renderEmail(email: Email) {
  const rows = email.entries.map((entry, i) => row(entry, i === email.entries.length - 1)).join("");

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<meta name="color-scheme" content="dark" />
<meta name="supported-color-schemes" content="dark" />
<title>${escapeHtml(email.eyebrow)}</title>
</head>
<body style="margin:0;padding:0;background:${C.bg};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${escapeHtml(email.preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${C.bg}" style="background:${C.bg};margin:0;padding:0;">
<tbody><tr><td align="center" style="padding:32px 16px;">

<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;">
<tbody>

<tr><td style="padding-bottom:28px;">${wordmark()}</td></tr>

<tr><td style="padding-bottom:6px;font-family:${MONO};font-size:10px;letter-spacing:2px;text-transform:uppercase;color:${C.pink};">${escapeHtml(email.eyebrow)}</td></tr>

<tr><td style="padding-bottom:28px;font-family:${SANS};font-size:26px;line-height:1.3;color:${C.fg};">
  ${email.heading}
</td></tr>

${email.flag ? notice(email.flag) : ""}

<tr><td style="padding-bottom:28px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.panel};border:1px solid ${C.line};">
    <tbody>${rows}</tbody>
  </table>
</td></tr>

${
  email.reply
    ? `<tr><td style="padding-bottom:28px;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tbody><tr>
    <td style="border:1px solid ${C.pink};">
      <a href="mailto:${escapeHtml(email.reply.email)}?subject=${encodeURIComponent(email.reply.subject)}"
         style="display:inline-block;padding:14px 26px;font-family:${MONO};font-size:12px;letter-spacing:2px;text-transform:uppercase;color:${C.pink};text-decoration:none;">
        ${escapeHtml(email.reply.label)} &rarr;
      </a>
    </td>
  </tr></tbody></table>
</td></tr>`
    : ""
}

<tr><td style="border-top:1px solid ${C.line};padding-top:18px;font-family:${MONO};font-size:11px;line-height:1.7;letter-spacing:0.5px;color:${C.muted};">
  Sent by the ${escapeHtml(email.source.label)} on
  <a href="${escapeHtml(email.source.url)}" style="color:${C.muted};text-decoration:underline;">quantumx.community</a>.<br />
  Reply straight to this email to reach the sender.
</td></tr>

</tbody></table>

</td></tr></tbody></table>
</body>
</html>`;
}

/** Plain-text alternative, for clients that will not render the HTML. */
export function renderText(intro: string, data: Submission, keys: string[]) {
  const get = reader(data);
  const lines = keys.map((key) => `${key}: ${get(key) || "(blank)"}`).join("\n");
  return `${intro}\n\n${lines}\n`;
}
