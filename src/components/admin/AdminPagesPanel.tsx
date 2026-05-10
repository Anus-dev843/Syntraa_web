"use client";

import React, { startTransition, useEffect, useState } from "react";

import type { AdminStore, CustomPage } from "../../lib/types";
import { PageForm } from "./PageForm";
import { PageList } from "./PageList";

type AdminPagesPanelProps = {
  initialStore: AdminStore;
};

function createPageId() {
  try {
    return `page-${crypto.randomUUID()}`;
  } catch {
    return `page-${Date.now().toString(36)}`;
  }
}

function emptyPage(): CustomPage {
  return {
    id: "",
    title: "",
    slug: "",
    content: "",
    updatedAt: "",
  };
}

export function AdminPagesPanel({ initialStore }: AdminPagesPanelProps) {
  const [store, setStore] = useState<AdminStore>(initialStore);
  const [editor, setEditor] = useState<CustomPage | null>(null);
  const [draft, setDraft] = useState<CustomPage>(emptyPage());
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    startTransition(() => {
      setStore(initialStore);
    });
  }, [initialStore]);

  useEffect(() => {
    if (!status) return;
    const timer = window.setTimeout(() => setStatus(null), 3000);
    return () => window.clearTimeout(timer);
  }, [status]);

  async function persist(next: AdminStore): Promise<boolean> {
    setError(null);
    const res = await fetch("/api/admin/store", {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(next),
    });
    const data = (await res.json().catch(() => ({}))) as { error?: string };
    if (!res.ok) {
      setError(data.error ?? "Save failed.");
      return false;
    }
    setStore(next);
    setStatus("Page updates saved.");
    return true;
  }

  function createNew() {
    setEditor(null);
    setDraft({
      ...emptyPage(),
      id: createPageId(),
      updatedAt: new Date().toISOString().slice(0, 10),
    });
  }

  function editPage(page: CustomPage) {
    setEditor(page);
    setDraft(page);
  }

  function clear() {
    setEditor(null);
    setDraft(emptyPage());
  }

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const today = new Date().toISOString().slice(0, 10);
    const next: CustomPage = {
      id: draft.id.trim() || createPageId(),
      title: draft.title.trim(),
      slug: draft.slug.trim().toLowerCase(),
      content: draft.content.trim(),
      updatedAt: editor ? today : draft.updatedAt || today,
    };
    const pages = editor
      ? store.pages.map((page) => (page.id === editor.id ? next : page))
      : [...store.pages, next];
    const ok = await persist({ ...store, pages });
    if (ok) clear();
  }

  async function remove(id: string) {
    if (!window.confirm("Delete this page?")) return;
    const pages = store.pages.filter((page) => page.id !== id);
    const ok = await persist({ ...store, pages });
    if (ok && editor?.id === id) clear();
  }

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl md:p-8">
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={createNew}
            className="rounded-full bg-luxury-snow px-5 py-2.5 text-[11px] uppercase tracking-[0.3em] text-black transition hover:bg-white"
          >
            Add page
          </button>
          {status ? <p className="text-sm text-emerald-300">{status}</p> : null}
          {error ? <p className="text-sm text-rose-300">{error}</p> : null}
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1fr_1.15fr]">
        <aside className="rounded-3xl border border-white/10 bg-black/35 p-6">
          <PageList items={store.pages} onEdit={editPage} onRemove={remove} />
        </aside>
        <section className="rounded-3xl border border-white/10 bg-black/35 p-6 md:p-8">
          <PageForm
            mode={editor ? "edit" : "create"}
            draft={draft}
            onChange={setDraft}
            onSubmit={save}
            onClear={clear}
          />
        </section>
      </div>
    </div>
  );
}
