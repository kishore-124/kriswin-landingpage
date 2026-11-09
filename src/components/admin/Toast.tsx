"use client";

import { useEffect, useState } from "react";

/** Shows a toast for ?saved=1 / ?deleted=1 and then removes the flag from the URL. */
export default function Toast({ saved, deleted }: { saved?: boolean; deleted?: boolean }) {
  const [show, setShow] = useState(Boolean(saved || deleted));

  useEffect(() => {
    if (!saved && !deleted) return;
    setShow(true);
    const url = new URL(window.location.href);
    url.searchParams.delete("saved");
    url.searchParams.delete("deleted");
    window.history.replaceState(null, "", url.pathname + (url.search || ""));
    const t = setTimeout(() => setShow(false), 3500);
    return () => clearTimeout(t);
  }, [saved, deleted]);

  if (!show) return null;
  return (
    <div className="toast-wrap" role="status" aria-live="polite">
      <div className={`admin-toast ${deleted ? "warn" : "ok"}`}>
        <span className="ic"><i className={`bi ${deleted ? "bi-trash3" : "bi-check-lg"}`} /></span>
        {deleted ? "Item deleted" : "Changes saved — your website is updated"}
        <button onClick={() => setShow(false)} aria-label="Close"><i className="bi bi-x-lg" /></button>
      </div>
    </div>
  );
}
