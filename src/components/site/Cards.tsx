import Link from "next/link";
import type { CaseStudy, Product, Service, Testimonial } from "@/generated/prisma/client";
import { iconClass, initials, lines, safeUrl } from "@/lib/utils";

export function ServiceCard({ s, index }: { s: Service; index?: number }) {
  return (
    <div className="service-card">
      {index !== undefined && <span className="num">{String(index + 1).padStart(2, "0")}</span>}
      <div className="icon-box"><i className={iconClass(s.icon, "bi-code-slash")} /></div>
      <h3>{s.title}</h3>
      <p>{s.summary}</p>
      <Link href={`/services/${s.slug}`} className="card-link stretched-link">
        Learn more <i className="bi bi-arrow-right" />
      </Link>
    </div>
  );
}

export function CaseCard({ c }: { c: CaseStudy }) {
  const results = lines(c.results).slice(0, 2);
  return (
    <Link href={`/portfolio/${c.slug}`} className="case-card">
      <div className="case-cover">
        {c.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={c.imageUrl} alt={c.title} />
        )}
        {!c.imageUrl && <span className="client">{c.client}</span>}
      </div>
      <div className="case-body">
        <div className="case-meta">
          {c.industry && <span className="tag brand">{c.industry}</span>}
          {c.readTime && <span className="tag"><i className="bi bi-clock me-1" />{c.readTime} read</span>}
        </div>
        <h3>{c.title}</h3>
        {results.length > 0 && (
          <ul className="check-list mt-2 mb-3">
            {results.map((r) => <li key={r}>{r}</li>)}
          </ul>
        )}
        <span className="card-link mt-auto">Read case study <i className="bi bi-arrow-right" /></span>
      </div>
    </Link>
  );
}

export function ProductCard({ p, maxFeatures = 4 }: { p: Product; maxFeatures?: number }) {
  const feats = lines(p.features).slice(0, maxFeatures);
  const site = safeUrl(p.websiteUrl);
  return (
    <div className="product-card">
      <div className="product-cover">
        {p.badge && <span className="product-badge">{p.badge}</span>}
        {p.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.imageUrl} alt={p.name} />
        ) : (
          <span className="big-ic"><i className={iconClass(p.icon, "bi-box-seam")} /></span>
        )}
      </div>
      <div className="product-body">
        <h3>{p.name}</h3>
        <p className="text-muted-2">{p.tagline}</p>
        {feats.length > 0 && (
          <ul className="check-list mb-4">
            {feats.map((f) => <li key={f}>{f}</li>)}
          </ul>
        )}
        <div className="mt-auto d-flex align-items-center justify-content-between gap-2 flex-wrap pt-3 border-top">
          {p.priceLabel ? <span className="price-tag">{p.priceLabel}</span> : <span />}
          <div className="d-flex gap-2">
            <Link href={`/products/${p.slug}`} className="btn btn-sm btn-outline-brand">Details</Link>
            {site && (
              <a href={site} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-brand">
                Visit <i className="bi bi-box-arrow-up-right ms-1" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function TestimonialCard({ t }: { t: Testimonial }) {
  const rating = Math.max(0, Math.min(5, t.rating));
  return (
    <div className="testimonial-card">
      <i className="bi bi-quote quote-ic" />
      <div className="stars mb-3">
        {"★".repeat(rating)}
        <span className="text-body-tertiary">{"★".repeat(5 - rating)}</span>
      </div>
      <p className="mb-4">“{t.quote}”</p>
      <div className="d-flex align-items-center gap-3">
        <span className="avatar">{initials(t.name)}</span>
        <div>
          <div className="fw-bold text-dark">{t.name}</div>
          {t.company && <div className="small text-muted-2">{t.company}</div>}
        </div>
      </div>
    </div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  lead,
  center = true,
}: {
  eyebrow: string;
  title: React.ReactNode;
  lead?: string;
  center?: boolean;
}) {
  return (
    <div className={`mb-5 reveal ${center ? "text-center" : ""}`}>
      <span className="eyebrow">{eyebrow}</span>
      <h2 className="section-title">{title}</h2>
      {lead && <p className={`section-lead mt-3 mb-0 ${center ? "mx-auto" : ""}`}>{lead}</p>}
    </div>
  );
}
