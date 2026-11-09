import Link from "next/link";
import type { SiteSetting, Service, Product } from "@/generated/prisma/client";
import { safeUrl } from "@/lib/utils";
import BrandLogo from "@/components/BrandLogo";

export default function Footer({
  s,
  services,
  products,
}: {
  s: SiteSetting;
  services: Pick<Service, "title" | "slug">[];
  products: Pick<Product, "name" | "slug">[];
}) {
  const socials = [
    { url: s.linkedin, icon: "bi-linkedin", label: "LinkedIn" },
    { url: s.facebook, icon: "bi-facebook", label: "Facebook" },
    { url: s.twitter, icon: "bi-twitter-x", label: "X" },
    { url: s.instagram, icon: "bi-instagram", label: "Instagram" },
    { url: s.youtube, icon: "bi-youtube", label: "YouTube" },
  ].filter((x) => x.url);

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-cta d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3">
          <div>
            <h3 className="h4 mb-1">Have a project in mind?</h3>
            <p className="mb-0">Let&apos;s talk — we reply within one business day.</p>
          </div>
          <div className="d-flex gap-2 flex-wrap">
            <Link href="/contact" className="btn btn-accent">Book a free call <i className="bi bi-arrow-right ms-1" /></Link>
            {s.email && <a href={`mailto:${s.email}`} className="btn btn-glass"><i className="bi bi-envelope me-1" />{s.email}</a>}
          </div>
        </div>

        <div className="row g-5">
          <div className="col-lg-4">
            <Link href="/" className="d-flex align-items-center gap-2 mb-3 text-decoration-none">
              <BrandLogo companyName={s.companyName} src={s.logoLightUrl} height={48} />
            </Link>
            <p className="pe-lg-4">{s.footerAbout || s.tagline}</p>
            {socials.length > 0 && (
              <div className="social mt-4">
                {socials.map((x) => (
                  <a key={x.icon} href={safeUrl(x.url)} target="_blank" rel="noopener noreferrer" aria-label={x.label}>
                    <i className={`bi ${x.icon}`} />
                  </a>
                ))}
              </div>
            )}
          </div>
          <div className="col-6 col-lg-3">
            <h5>Services</h5>
            <ul className="list-unstyled footer-links">
              {services.slice(0, 7).map((x) => (
                <li key={x.slug}><Link href={`/services/${x.slug}`}>{x.title}</Link></li>
              ))}
            </ul>
          </div>
          <div className="col-6 col-lg-2">
            <h5>Company</h5>
            <ul className="list-unstyled footer-links">
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/portfolio">Portfolio</Link></li>
              <li><Link href="/products">Products</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
            {products.length > 0 && (
              <>
                <h5 className="mt-4">Products</h5>
                <ul className="list-unstyled footer-links">
                  {products.map((p) => <li key={p.slug}><Link href={`/products/${p.slug}`}>{p.name}</Link></li>)}
                </ul>
              </>
            )}
          </div>
          <div className="col-lg-3">
            <h5>Contact</h5>
            <ul className="list-unstyled footer-links">
              {s.email && <li className="d-flex gap-2"><i className="bi bi-envelope" /><a href={`mailto:${s.email}`}>{s.email}</a></li>}
              {s.phone && <li className="d-flex gap-2"><i className="bi bi-telephone" /><a href={`tel:${s.phone.replace(/\s/g, "")}`}>{s.phone}</a></li>}
              {s.address && <li className="d-flex gap-2"><i className="bi bi-geo-alt" /><span>{s.address}</span></li>}
            </ul>
          </div>
        </div>
        <div className="footer-bottom d-flex flex-column flex-md-row justify-content-between gap-2">
          <span>© {new Date().getFullYear()} {s.companyName}. All rights reserved.</span>
          <span className="d-flex gap-3"><Link href="/contact">Privacy Policy</Link><Link href="/contact">Terms</Link></span>
        </div>
      </div>
    </footer>
  );
}
