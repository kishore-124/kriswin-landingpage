"use client";

import { useEffect, useState } from "react";

const tabs = [
  { id: "general", label: "General & Brand", hint: "Name, colours, SEO", icon: "bi-building" },
  { id: "contact", label: "Contact & Social", hint: "Phone, email, map, socials", icon: "bi-telephone" },
  { id: "home", label: "Home Page", hint: "Hero, stats, why us, CTA", icon: "bi-house" },
  { id: "sections", label: "Home Sections", hint: "Clients, tech, industries, FAQ", icon: "bi-grid-3x3-gap" },
  { id: "about", label: "About Page", hint: "Story, mission, values", icon: "bi-info-circle" },
];

/** Vertical tab navigation. Every pane stays inside the same form so one Save stores everything. */
export default function SettingsTabs({ initial }: { initial: string }) {
  const [tab, setTab] = useState(tabs.some((t) => t.id === initial) ? initial : "general");

  useEffect(() => {
    document.querySelectorAll<HTMLElement>(".settings-pane").forEach((el) => {
      el.style.display = el.dataset.pane === tab ? "" : "none";
    });
    const url = new URL(window.location.href);
    url.searchParams.set("tab", tab);
    window.history.replaceState(null, "", url.pathname + url.search);
  }, [tab]);

  // keep colour pickers and their text inputs in sync
  useEffect(() => {
    const cleanups: (() => void)[] = [];
    document.querySelectorAll<HTMLInputElement>("[data-sync]").forEach((picker) => {
      const text = document.getElementById(picker.dataset.sync!) as HTMLInputElement | null;
      if (!text) return;
      const a = () => (text.value = picker.value);
      const b = () => /^#[0-9a-f]{6}$/i.test(text.value) && (picker.value = text.value);
      picker.addEventListener("input", a);
      text.addEventListener("input", b);
      cleanups.push(() => {
        picker.removeEventListener("input", a);
        text.removeEventListener("input", b);
      });
    });
    return () => cleanups.forEach((c) => c());
  }, []);

  return (
    <div className="admin-card aside-sticky">
      <input type="hidden" name="_tab" value={tab} />
      <nav className="settings-nav">
        {tabs.map((t) => (
          <button type="button" key={t.id} className={tab === t.id ? "active" : ""} onClick={() => setTab(t.id)}>
            <span className="ic"><i className={`bi ${t.icon}`} /></span>
            <span>{t.label}<small>{t.hint}</small></span>
          </button>
        ))}
      </nav>
    </div>
  );
}
