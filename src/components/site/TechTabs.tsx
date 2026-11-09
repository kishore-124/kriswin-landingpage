"use client";

import { useState } from "react";

export default function TechTabs({ groups }: { groups: { name: string; items: string[] }[] }) {
  const [active, setActive] = useState(0);
  if (groups.length === 0) return null;
  const current = groups[Math.min(active, groups.length - 1)];
  return (
    <>
      <div className="tech-tabs" role="tablist">
        {groups.map((g, i) => (
          <button key={g.name} role="tab" aria-selected={i === active} className={i === active ? "active" : ""} onClick={() => setActive(i)}>
            {g.name}
          </button>
        ))}
      </div>
      <div className="row g-3 row-cols-2 row-cols-md-3 row-cols-lg-6 justify-content-center" key={current.name}>
        {current.items.map((t) => (
          <div className="col" key={t}>
            <div className="tech-chip">
              <span className="ini">{t.replace(/[^A-Za-z0-9]/g, "").slice(0, 2)}</span>
              <span>{t}</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
