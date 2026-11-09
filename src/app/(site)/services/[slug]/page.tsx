import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getServices, getSettings } from "@/lib/data";
import { iconClass, lines, paragraphs } from "@/lib/utils";
import PageHeader from "@/components/site/PageHeader";
import CtaBanner from "@/components/site/CtaBanner";

type Props = { params: Promise<{ slug: string }> };

async function getService(slug: string) {
  return prisma.service.findFirst({ where: { slug, published: true } });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const service = await getService((await params).slug);
  return service ? { title: service.title, description: service.summary } : {};
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const [service, all, s] = await Promise.all([getService(slug), getServices(), getSettings()]);
  if (!service) notFound();
  const features = lines(service.features);

  return (
    <>
      <PageHeader
        title={service.title}
        subtitle={service.summary}
        crumbs={[{ href: "/services", label: "Services" }, { label: service.title }]}
      />
      <section className="section">
        <div className="container">
          <div className="row g-5">
            <div className="col-lg-8">
              <div className="d-flex align-items-center gap-3 mb-4">
                <div className="icon-box"><i className={iconClass(service.icon)} /></div>
                <h2 className="h3 mb-0">Overview</h2>
              </div>
              {paragraphs(service.description || service.summary).map((p, i) => (
                <p key={i} className="fs-6 text-muted-2">{p}</p>
              ))}
              {features.length > 0 && (
                <>
                  <h3 className="h4 mt-5 mb-3">What&apos;s included</h3>
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
            <div className="col-lg-4">
              <div className="side-card mb-4 sticky-lg-top" style={{ top: "7rem" }}>
                <h3 className="h5 mb-3">All services</h3>
                <div className="list-group list-group-flush">
                  {all.map((x) => (
                    <Link
                      key={x.id}
                      href={`/services/${x.slug}`}
                      className={`list-group-item list-group-item-action d-flex align-items-center gap-2 border-0 rounded-3 ${x.slug === slug ? "active bg-brand border-0" : ""}`}
                    >
                      <i className={iconClass(x.icon)} /> {x.title}
                    </Link>
                  ))}
                </div>
                <hr />
                <p className="small text-muted-2 mb-3">Need help choosing the right solution?</p>
                <Link href="/contact" className="btn btn-brand w-100">Talk to an expert</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      <CtaBanner s={s} />
      <div className="pb-5" />
    </>
  );
}
