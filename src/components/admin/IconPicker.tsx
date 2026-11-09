"use client";

import { useEffect, useRef, useState } from "react";

const ICONS = [
  "bi-code-slash", "bi-window-stack", "bi-phone", "bi-laptop", "bi-stars", "bi-robot", "bi-cpu", "bi-cloud-check",
  "bi-cloud-arrow-up", "bi-server", "bi-database", "bi-hdd-stack", "bi-palette", "bi-brush", "bi-bug", "bi-shield-check",
  "bi-shield-lock", "bi-headset", "bi-gear", "bi-tools", "bi-graph-up-arrow", "bi-bar-chart-line", "bi-pie-chart", "bi-receipt",
  "bi-cart3", "bi-bag", "bi-credit-card", "bi-cash-coin", "bi-currency-rupee", "bi-people", "bi-person-badge", "bi-briefcase",
  "bi-building", "bi-buildings", "bi-truck", "bi-heart-pulse", "bi-mortarboard", "bi-bank", "bi-airplane", "bi-house",
  "bi-globe2", "bi-lightning-charge", "bi-rocket-takeoff", "bi-puzzle", "bi-diagram-3", "bi-layers", "bi-boxes", "bi-box-seam",
  "bi-chat-dots", "bi-envelope", "bi-calendar-check", "bi-clock-history", "bi-lock", "bi-key", "bi-check2-circle", "bi-award",
  "bi-lightbulb", "bi-search", "bi-wifi", "bi-camera", "bi-geo-alt", "bi-megaphone", "bi-bullseye", "bi-hourglass-split",
];

const cls = (v: string) => (v.startsWith("bi-") ? v : `bi-${v}`);

export default function IconPicker({
  name,
  defaultValue = "",
  value: controlled,
  onChange,
  compact,
}: {
  name?: string;
  defaultValue?: string;
  value?: string;
  onChange?: (v: string) => void;
  compact?: boolean;
}) {
  const [inner, setInner] = useState(defaultValue);
  const value = controlled ?? inner;
  const setValue = (v: string) => {
    setInner(v);
    onChange?.(v);
  };
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && setOpen(false);
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div className="icon-picker" ref={ref}>
      <div className="input-group">
        <button type="button" className="input-group-text bg-white" onClick={() => setOpen((o) => !o)} aria-label="Choose icon" style={{ width: compact ? 42 : 52, justifyContent: "center" }}>
          <i className={`bi ${cls(value || "bi-stars")} text-brand ${compact ? "" : "fs-5"}`} />
        </button>
        <input id={name} name={name} className={`form-control ${compact ? "form-control-sm" : ""}`} value={value} onChange={(e) => setValue(e.target.value)} onFocus={() => setOpen(true)} placeholder="bi-code-slash" autoComplete="off" />
      </div>
      {open && (
        <div className="icon-grid">
          {ICONS.map((ic) => (
            <button type="button" key={ic} title={ic} className={cls(value) === ic ? "on" : ""} onClick={() => { setValue(ic); setOpen(false); }}>
              <i className={`bi ${ic}`} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
