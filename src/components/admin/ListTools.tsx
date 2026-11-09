"use client";

import { useState } from "react";

/** Filters the rows of the table with the given id as you type. */
export function TableSearch({ target, placeholder = "Search…" }: { target: string; placeholder?: string }) {
  const [q, setQ] = useState("");
  const filter = (v: string) => {
    setQ(v);
    const needle = v.trim().toLowerCase();
    document.querySelectorAll<HTMLTableRowElement>(`#${target} tbody tr[data-row]`).forEach((tr) => {
      tr.style.display = !needle || tr.textContent?.toLowerCase().includes(needle) ? "" : "none";
    });
  };
  return (
    <div className="search-box">
      <i className="bi bi-search" />
      <input className="form-control" value={q} onChange={(e) => filter(e.target.value)} placeholder={placeholder} aria-label="Search" />
    </div>
  );
}

/** A switch that instantly saves a boolean field (published / featured) via a server action. */
export function QuickToggle({
  action,
  model,
  id,
  field = "published",
  checked,
  title,
}: {
  action: (fd: FormData) => Promise<void>;
  model: string;
  id: number;
  field?: string;
  checked: boolean;
  title?: string;
}) {
  const [on, setOn] = useState(checked);
  return (
    <form action={action} className="form-check form-switch switch-sm m-0 d-inline-block" title={title}>
      <input type="hidden" name="model" value={model} />
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="field" value={field} />
      <input
        className="form-check-input" type="checkbox" role="switch" checked={on} aria-label={title}
        onChange={(e) => {
          setOn(e.target.checked);
          e.currentTarget.form?.requestSubmit();
        }}
      />
    </form>
  );
}
