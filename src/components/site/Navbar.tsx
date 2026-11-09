"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { iconClass } from "@/lib/utils";
import BrandLogo from "@/components/BrandLogo";

type NavService = { title: string; slug: string; icon: string; summary: string };
type NavProduct = { name: string; slug: string; icon: string; tagline: string };

export default function Navbar({
  companyName,
  logoUrl,
  email,
  phone,
  services,
  products,
}: {
  companyName: string;
  logoUrl: string;
  email: string;
  phone: string;
  services: NavService[];
  products: NavProduct[];
}) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setMenu(null);
  }, [pathname]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const toggle = (m: string) => (e: React.MouseEvent) => {
    // On mobile the dropdown opens on tap; on desktop it opens on hover (CSS)
    if (window.innerWidth < 992) {
      e.preventDefault();
      setMenu((cur) => (cur === m ? null : m));
    }
  };

  return (
    <header className="site-header">
      <div className="topbar d-none d-md-block">
        <div className="container d-flex justify-content-between align-items-center">
          <span><i className="bi bi-patch-check-fill text-warning me-1" /> Free consultation &amp; estimate within 48 hours</span>
          <span className="d-flex gap-4">
            {email && <a href={`mailto:${email}`}><i className="bi bi-envelope me-1" />{email}</a>}
            {phone && <a href={`tel:${phone.replace(/\s/g, "")}`}><i className="bi bi-telephone me-1" />{phone}</a>}
          </span>
        </div>
      </div>

      <nav className={`navbar navbar-expand-lg site-nav position-relative ${scrolled ? "scrolled" : ""}`}>
        <div className="container">
          <Link className="navbar-brand" href="/">
            <BrandLogo companyName={companyName} src={logoUrl} height={46} />
          </Link>
          <button className="navbar-toggler border-0 shadow-none" type="button" aria-label="Toggle navigation" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
            <i className={`bi ${open ? "bi-x-lg" : "bi-list"} fs-2 text-dark`} />
          </button>

          <div className={`collapse navbar-collapse ${open ? "show" : ""}`}>
            <ul className="navbar-nav mx-auto">
              <li className="nav-item">
                <Link className={`nav-link ${isActive("/") ? "active" : ""}`} href="/">Home</Link>
              </li>

              {/* Services mega menu */}
              <li className={`nav-item has-mega ${menu === "services" ? "open" : ""}`}>
                <Link className={`nav-link ${isActive("/services") ? "active" : ""}`} href="/services" onClick={toggle("services")}>
                  Services <i className="bi bi-chevron-down" />
                </Link>
                <div className="mega">
                  <div className="container py-lg-4">
                    <div className="row g-3">
                      <div className="col-lg-9">
                        <div className="row g-1">
                          {services.map((s) => (
                            <div className="col-lg-6" key={s.slug}>
                              <Link href={`/services/${s.slug}`} className="mega-item">
                                <span className="icon-box"><i className={iconClass(s.icon)} /></span>
                                <span>
                                  <strong>{s.title}</strong>
                                  <small className="d-none d-lg-block">{s.summary.length > 80 ? s.summary.slice(0, 78) + "…" : s.summary}</small>
                                </span>
                              </Link>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="col-lg-3">
                        <div className="mega-promo d-flex flex-column">
                          <i className="bi bi-chat-square-heart fs-2 text-warning mb-2" />
                          <h5>Not sure where to start?</h5>
                          <p>Get a free 30-minute consultation with our experts.</p>
                          <Link href="/contact" className="btn btn-accent btn-sm mt-auto align-self-start">Get a free quote</Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>

              {/* Products dropdown */}
              {products.length > 0 && (
                <li className={`nav-item has-mega rel ${menu === "products" ? "open" : ""}`}>
                  <Link className={`nav-link ${isActive("/products") ? "active" : ""}`} href="/products" onClick={toggle("products")}>
                    Products <i className="bi bi-chevron-down" />
                  </Link>
                  <div className="mega narrow">
                    <div className="p-lg-3">
                      {products.map((p) => (
                        <Link key={p.slug} href={`/products/${p.slug}`} className="mega-item">
                          <span className="icon-box"><i className={iconClass(p.icon, "bi-box-seam")} /></span>
                          <span><strong>{p.name}</strong><small>{p.tagline}</small></span>
                        </Link>
                      ))}
                      <Link href="/products" className="card-link ms-3 mb-2">All products <i className="bi bi-arrow-right" /></Link>
                    </div>
                  </div>
                </li>
              )}

              {[
                { href: "/portfolio", label: "Portfolio" },
                { href: "/about", label: "About Us" },
                { href: "/contact", label: "Contact" },
              ].map((l) => (
                <li className="nav-item" key={l.href}>
                  <Link className={`nav-link ${isActive(l.href) ? "active" : ""}`} href={l.href}>{l.label}</Link>
                </li>
              ))}
            </ul>
            <Link href="/contact" className="btn btn-brand mt-2 mt-lg-0">
              Talk to an expert <i className="bi bi-arrow-up-right ms-1" />
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
