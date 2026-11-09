import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSettings } from "@/lib/data";
import { iconClass, lines, paragraphs, safeUrl } from "@/lib/utils";
import PageHeader from "@/components/site/PageHeader";
import CtaBanner from "@/components/site/CtaBanner";

type Props = { params: Promise<{ slug: string }> };

async function getProduct(slug: string) {
  return prisma.product.findFirst({ where: { slug, published: true } });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await getProduct((await params).slug);
  return p ? { title: p.name, description: p.tagline } : {};
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const [p, s] = await Promise.all([getProduct(slug), getSettings()]);
  if (!p) notFound();
  const features = lines(p.features);
  const site = safeUrl(p.websiteUrl);

  return (
    <>
      <PageHeader title={p.name} subtitle={p.tagline} crumbs={[{ href: "/products", label: "Products" }, { label: p.name }]} />
      <section className="section">
        <div className="container">
          <div className="row g-5 align-items-start">
            <div className="col-lg-5">
              <div className="product-card">
                <div className="product-cover" style={{ height: 300 }}>
                  {p.badge && <span className="product-badge">{p.badge}</span>}
                  {p.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.imageUrl} alt={p.name} />
                  ) : (
                    <i className={iconClass(p.icon, "bi-box-seam")} style={{ fontSize: "5rem" }} />
                  )}
                </div>
                <div className="product-body">
                  {p.priceLabel && (
                    <div className="mb-3">
                      <div className="small text-muted-2 fw-semibold">Pricing</div>
                      <div className="fs-4 price-tag">{p.priceLabel}</div>
                    </div>
                  )}
                  <div className="d-grid gap-2">
                    {site && (
                      <a href={site} target="_blank" rel="noopener noreferrer" className="btn btn-brand btn-lg">
                        Visit {p.name} <i className="bi bi-box-arrow-up-right ms-1" />
                      </a>
                    )}
                    <Link href="/contact" className="btn btn-outline-brand">Request a demo</Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-7">
              <span className="eyebrow">Product overview</span>
              <h2 className="section-title mb-4">{p.name}</h2>
              {paragraphs(p.description || p.tagline).map((t, i) => (
                <p key={i} className="fs-6 text-muted-2">{t}</p>
              ))}
              {features.length > 0 && (
                <>
                  <h3 className="h4 mt-5 mb-3">Key features</h3>
                  <div className="row g-3">
                    {features.map((f) => (
                      <div className="col-md-6" key={f}>
                        <div className="detail-box">
                          <i className="bi bi-check2-circle" />
                          <span>{f}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
      <CtaBanner s={s} />
      <div className="pb-5" />
    </>
  );
}
