"use client";

import { useMemo, useState } from "react";
import IconPicker from "./IconPicker";

type Col = { key: string; label: string; type?: "text" | "icon" | "textarea"; placeholder?: string; width?: string };

/**
 * Friendly editor for list-style settings stored as lines of "a | b | c".
 * Renders one row per item with add / remove / reorder, and keeps a hidden
 * input (same `name`) in the original text format so the server action is unchanged.
 */
export default function RowsEditor({
  name,
  label,
  help,
  columns,
  defaultValue,
  addLabel = "Add item",
}: {
  name: string;
  label: string;
  help?: string;
  columns: Col[];
  defaultValue: string;
  addLabel?: string;
}) {
  const initial = useMemo(
    () =>
      defaultValue
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter(Boolean)
        .map((l) => {
          const parts = columns.length === 1 ? [l] : l.split("|").map((p) => p.trim());
          // join any overflow back into the last column
          if (parts.length > columns.length) parts.splice(columns.length - 1, parts.length, parts.slice(columns.length - 1).join(" | "));
          return columns.map((_, i) => parts[i] ?? "");
        }),
    [defaultValue, columns]
  );
  const [rows, setRows] = useState<string[][]>(initial);

  const serialized = rows
    .filter((r) => r.some((c) => c.trim()))
    .map((r) => r.map((c) => c.replace(/\|/g, "/").replace(/\r?\n/g, " ").trim()).join(" | "))
    .join("\n");

  const update = (ri: number, ci: number, v: string) => setRows((rs) => rs.map((r, i) => (i === ri ? r.map((c, j) => (j === ci ? v : c)) : r)));
  const move = (ri: number, d: number) =>
    setRows((rs) => {
      const to = ri + d;
      if (to < 0 || to >= rs.length) return rs;
      const copy = [...rs];
      [copy[ri], copy[to]] = [copy[to], copy[ri]];
      return copy;
    });

  return (
    <div className="col-12">
      <div className="d-flex justify-content-between align-items-end mb-2">
        <div>
          <label className="form-label mb-0">{label}</label>
          {help && <div className="form-text mt-0">{help}</div>}
        </div>
        <span className="small text-muted-2">{rows.length} item{rows.length === 1 ? "" : "s"}</span>
      </div>
      <input type="hidden" name={name} value={serialized} />
      <div className="rows-editor">
        {rows.map((r, ri) => (
          <div className="rows-item" key={ri}>
            <span className="rows-num">{ri + 1}</span>
            <div className="row g-2 flex-grow-1">
              {columns.map((c, ci) => (
                <div className={c.width || (c.type === "icon" ? "col-md-3" : c.type === "textarea" ? "col-12" : "col")} key={c.key}>
                  {c.type === "icon" ? (
                    <IconPicker value={r[ci]} onChange={(v) => update(ri, ci, v)} compact />
                  ) : c.type === "textarea" ? (
                    <textarea className="form-control form-control-sm" rows={2} value={r[ci]} placeholder={c.placeholder || c.label} onChange={(e) => update(ri, ci, e.target.value)} aria-label={c.label} />
                  ) : (
                    <input className="form-control form-control-sm" value={r[ci]} placeholder={c.placeholder || c.label} onChange={(e) => update(ri, ci, e.target.value)} aria-label={c.label} />
                  )}
                </div>
              ))}
            </div>
            <div className="rows-actions">
              <button type="button" onClick={() => move(ri, -1)} disabled={ri === 0} title="Move up"><i className="bi bi-chevron-up" /></button>
              <button type="button" onClick={() => move(ri, 1)} disabled={ri === rows.length - 1} title="Move down"><i className="bi bi-chevron-down" /></button>
              <button type="button" className="del" onClick={() => setRows((rs) => rs.filter((_, i) => i !== ri))} title="Remove"><i className="bi bi-x-lg" /></button>
            </div>
          </div>
        ))}
        <button type="button" className="rows-add" onClick={() => setRows((rs) => [...rs, columns.map(() => "")])}>
          <i className="bi bi-plus-lg me-1" /> {addLabel}
        </button>
      </div>
    </div>
  );
}
