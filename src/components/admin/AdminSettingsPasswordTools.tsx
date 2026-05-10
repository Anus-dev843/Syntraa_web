"use client";

import React, { useCallback, useState } from "react";

function generateReadablePassword(length = 22) {
  const alphabet =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*_-+.";
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  let out = "";
  for (let i = 0; i < length; i += 1) {
    out += alphabet[bytes[i]! % alphabet.length];
  }
  return out;
}

export function AdminSettingsPasswordTools() {
  const [generated, setGenerated] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const generate = useCallback(() => {
    setGenerated(generateReadablePassword());
    setCopied(false);
  }, []);

  const copy = useCallback(async () => {
    if (!generated) return;
    try {
      await navigator.clipboard.writeText(generated);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }, [generated]);

  return (
    <div className="mt-8 rounded-2xl border border-white/10 bg-black/25 p-6">
      <p className="text-[11px] uppercase tracking-[0.3em] text-luxury-muted">Strong password</p>
      <p className="mt-3 text-sm leading-relaxed text-luxury-muted">
        Generate a random password here, save it in a password manager, then run{" "}
        <code className="rounded bg-black/40 px-1.5 py-0.5 font-mono text-xs text-luxury-snow">
          npm run admin:hash-password
        </code>{" "}
        locally and put{" "}
        <code className="rounded bg-black/40 px-1 font-mono text-xs">ADMIN_PASSWORD_HASH</code> and{" "}
        <code className="rounded bg-black/40 px-1 font-mono text-xs">ADMIN_SESSION_SECRET</code> on
        Render. Production ignores plain passwords unless you only use a bcrypt hash.
      </p>
      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={generate}
          className="rounded-full border border-white/20 px-5 py-2 text-[11px] uppercase tracking-[0.28em] text-luxury-snow transition hover:border-white/40"
        >
          Generate random password
        </button>
        {generated ? (
          <button
            type="button"
            onClick={() => void copy()}
            className="rounded-full bg-luxury-snow px-5 py-2 text-[11px] uppercase tracking-[0.28em] text-black transition hover:bg-white"
          >
            {copied ? "Copied" : "Copy"}
          </button>
        ) : null}
      </div>
      {generated ? (
        <p className="mt-4 break-all font-mono text-sm text-emerald-200/95">{generated}</p>
      ) : null}
    </div>
  );
}
