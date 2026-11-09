"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** Loads Bootstrap's JS bundle (collapse, dropdowns, modals) and wires scroll-reveal animations. */
export default function BootstrapClient() {
  const pathname = usePathname();

  useEffect(() => {
    // @ts-expect-error - bootstrap bundle has no type declarations for this path
    import("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);

  useEffect(() => {
    const els = document.querySelectorAll(".reveal:not(.in)");
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  return null;
}
