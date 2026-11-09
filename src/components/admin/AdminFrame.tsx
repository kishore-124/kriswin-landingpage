"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import BrandLogo from "@/components/BrandLogo";
import { initials } from "@/lib/utils";

const groups = [
  { label: "Overview", items: [{ href: "/admin", icon: "bi-grid-1x2", label: "Dashboard" }] },
  {
    label: "Website content",
    items: [
      { href: "/admin/settings", icon: "bi-sliders2", label: "Site Settings" },
      { href: "/admin/services", icon: "bi-briefcase", label: "Services" },
      { href: "/admin/products", icon: "bi-box-seam", label: "Products" },
      { href: "/admin/case-studies", icon: "bi-journal-richtext", label: "Case Studies" },
      { href: "/admin/team", icon: "bi-people", label: "Team" },
      { href: "/admin/testimonials", icon: "bi-chat-quote", label: "Testimonials" },
    ],
  },
  { label: "Inbox", items: [{ href: "/admin/messages", icon: "bi-inbox", label: "Messages" }] },
  { label: "Account", items: [{ href: "/admin/account", icon: "bi-person-gear", label: "My Account" }] },
];

const allItems = groups.flatMap((g) => g.items);

export default function AdminFrame({
  companyName,
  logoUrl,
  unread,
  user,
  logout,
  children,
}: {
  companyName: string;
  logoUrl: string;
  unread: number;
  user: { name: string; email: string };
  logout: () => Promise<void>;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setOpen(false);
    setMenu(false);
  }, [pathname]);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenu(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const active = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));
  const current = [...allItems].reverse().find((i) => active(i.href));
  const sub = pathname.endsWith("/new") ? "New" : /\/\d+$/.test(pathname) ? "Edit" : null;

  return (
    <div className="admin-shell">
      <aside className={`admin-sidebar ${open ? "open" : ""}`}>
        <Link href="/admin" className="brand">
          <BrandLogo companyName={companyName} src={logoUrl} height={38} />
        </Link>
        <nav className="admin-nav" aria-label="Admin navigation">
          {groups.map((g) => (
            <div key={g.label}>
              <div className="section-label">{g.label}</div>
              {g.items.map((it) => (
                <Link key={it.href} href={it.href} className={`nav-link ${active(it.href) ? "active" : ""}`}>
                  <i className={`bi ${it.icon}`} />
                  <span>{it.label}</span>
                  {it.href === "/admin/messages" && unread > 0 && <span className="count">{unread}</span>}
                </Link>
              ))}
            </div>
          ))}
        </nav>
        <div className="sidebar-promo">
          <div className="fw-bold">Your website</div>
          <small>See your changes live</small>
          <a href="/" target="_blank" rel="noopener" className="btn btn-sm btn-light w-100">
            <i className="bi bi-box-arrow-up-right me-1" /> Open website
          </a>
        </div>
      </aside>
      <div className={`sidebar-backdrop ${open ? "show" : ""}`} onClick={() => setOpen(false)} />

      <div className="admin-main">
        <header className="admin-topbar">
          <button className="icon-btn d-lg-none" onClick={() => setOpen(true)} aria-label="Open menu">
            <i className="bi bi-list" />
          </button>
          <div className="crumbs d-none d-sm-block">
            <span>Admin</span>
            {current && current.href !== "/admin" && <> <i className="bi bi-chevron-right mx-1 small" /> <Link href={current.href} className="text-reset text-decoration-none">{current.label}</Link></>}
            {current?.href === "/admin" && <> <i className="bi bi-chevron-right mx-1 small" /> <strong>Dashboard</strong></>}
            {sub && <> <i className="bi bi-chevron-right mx-1 small" /> <strong>{sub}</strong></>}
          </div>
          <div className="ms-auto d-flex align-items-center gap-2">
            <a href="/" target="_blank" rel="noopener" className="icon-btn" title="View website" aria-label="View website">
              <i className="bi bi-globe2" />
            </a>
            <Link href="/admin/messages" className="icon-btn" title="Messages" aria-label="Messages">
              <i className="bi bi-bell" />
              {unread > 0 && <span className="dot" />}
            </Link>
            <div className="user-menu" ref={menuRef}>
              <button className="user-btn" onClick={() => setMenu((m) => !m)} aria-expanded={menu}>
                <span className="avatar">{initials(user.name || user.email)}</span>
                <span className="d-none d-md-inline">{user.name || "Admin"}</span>
                <i className="bi bi-chevron-down small text-muted-2" />
              </button>
              {menu && (
                <div className="user-pop">
                  <div className="head">
                    <div className="fw-bold text-dark">{user.name || "Admin"}</div>
                    <div className="small text-muted-2 text-truncate">{user.email}</div>
                  </div>
                  <Link href="/admin/account"><i className="bi bi-person-gear" /> My account</Link>
                  <a href="/" target="_blank" rel="noopener"><i className="bi bi-globe2" /> View website</a>
                  <form action={logout}>
                    <button className="danger"><i className="bi bi-box-arrow-right" /> Log out</button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </header>
        <main className="admin-content">{children}</main>
      </div>
    </div>
  );
}
