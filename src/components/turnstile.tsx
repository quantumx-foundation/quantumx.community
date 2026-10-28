"use client";

import { useEffect, useRef } from "react";

/** Public by design: Cloudflare puts it in the page. The secret half lives only in the Netlify function. */
const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
const SCRIPT_URL = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

type TurnstileApi = {
  render: (container: HTMLElement, options: Record<string, unknown>) => string;
  remove: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

let loading: Promise<TurnstileApi> | undefined;

/** Loads Cloudflare's script once per page, however many forms ask for it. */
function loadTurnstile() {
  loading ??= new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = SCRIPT_URL;
    script.async = true;
    script.onload = () => (window.turnstile ? resolve(window.turnstile) : reject(new Error("Turnstile did not load")));
    script.onerror = () => {
      loading = undefined;
      reject(new Error("Turnstile did not load"));
    };
    document.head.appendChild(script);
  });
  return loading;
}

/**
 * Cloudflare's bot check. Drop it inside a form: it adds a hidden
 * cf-turnstile-response field that netlify/functions/on-form.mts verifies
 * before sending any email. Invisible unless Cloudflare wants a click.
 * Renders nothing until NEXT_PUBLIC_TURNSTILE_SITE_KEY is set.
 *
 * A token works once, so remount it (change its key) after a failed send.
 */
export function Turnstile() {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!SITE_KEY || !container.current) return;
    const node = container.current;
    let widget: string | undefined;
    let cancelled = false;
    loadTurnstile()
      .then((turnstile) => {
        if (cancelled) return;
        widget = turnstile.render(node, {
          sitekey: SITE_KEY,
          appearance: "interaction-only",
          theme: "light",
          "refresh-expired": "auto",
        });
      })
      .catch(() => {
        // Blocked by an extension or offline: the form still sends, the function decides.
      });
    return () => {
      cancelled = true;
      if (widget) window.turnstile?.remove(widget);
    };
  }, []);

  if (!SITE_KEY) return null;
  return <div ref={container} className="sm:col-span-2" />;
}
