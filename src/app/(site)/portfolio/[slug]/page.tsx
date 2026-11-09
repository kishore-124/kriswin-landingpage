import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCaseStudies, getSettings } from "@/lib/data";
import { lines, paragraphs } from "@/lib/utils";
import PageHeader from "@/components/site/PageHeader";
import CtaBanner from "@/components/site/CtaBanner";
import { CaseCard } from "@/components/site/Cards";

type Props = { params: Promise<{ slug: string }> };

const getCase = (slug: string) => prisma.caseStudy.findFirst({ where: { slug, published: true } });

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const c = await getCase((await params).slug);
  return c ? { title: c.title, description: c.summary } : {};
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const [c, all, s] = await Promise.all([getCase(slug), getCaseStudies(), getSettings()]);
  if (!c) notFound();
  const results = lines(c.results);
  const tech = c.techStack.split(",").map((t) => t.trim()).filter(Boolean);
  const more = all.filter((x) => x.id !== c.id).slice(0, 3);

  return (
    <>
      <PageHeader title={c.title} subtitle={c.summary} crumbs={[{ href: "/portfolio", label: "Portfolio" }, { label: c.client || "Case study" }]} />
      <section className="section">
        <div className="container">
          <div className="row g-5">
            <div className="col-lg-8">
              {c.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={c.imageUrl} alt={c.title} className="w-100 rounded-4 border mb-5" />
              )}
              {c.challenge && (
                <div className="mb-5">
                  <span className="eyebrow">The challenge</span>
                  {paragraphs(c.challenge).map((p, i) => <p key={i} className="fs-6">{p}</p>)}
                </div>
              )}
              {c.solution && (
                <div className="mb-5">
                  <span className="eyebrow">Our solution</span>
                  {paragraphs(c.solution).map((p, i) => <p key={i} className="fs-6">{p}</p>)}
                </div>
              )}
              {results.length > 0 && (
                <div>
                  <span className="eyebrow">The results</span>
                  <div className="row g-3">
                    {results.map((r) => (
                      <div className="col-md-6" key={r}>
                        <div className="detail-box"><i className="bi bi-graph-up-arrow" /><span>{r}</span></div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="col-lg-4">
              <div className="side-card sticky-lg-top" style={{ top: "7rem" }}>
                <h3 className="h5 mb-3">Project snapshot</h3>
                <dl className="mb-0">
                  {c.client && <><dt className="small text-muted-2">Client</dt><dd className="fw-semibold">{c.client}</dd></>}
                  {c.industry && <><dt className="small text-muted-2">Industry</dt><dd className="fw-semibold">{c.industry}</dd></>}
                  {tech.length > 0 && (
                    <>
                      <dt className="small text-muted-2 mb-2">Technologies</dt>
                      <dd className="d-flex flex-wrap gap-2">{tech.map((t) => <span className="tag" key={t}>{t}</span>)}</dd>
                    </>
                  )}
                </dl>
                <hr />
                <p className="small text-muted-2">Want similar results for your business?</p>
                <Link href="/contact" className="btn btn-brand w-100">Start your project</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {more.length > 0 && (
        <section className="section bg-surface">
          <div className="container">
            <h2 className="section-title mb-4">More success stories</h2>
            <div className="row g-4 row-cols-1 row-cols-md-2 row-cols-lg-3">
              {more.map((x) => <div className="col" key={x.id}><CaseCard c={x} /></div>)}
            </div>
          </div>
        </section>
      )}
      <CtaBanner s={s} />
      <div className="pb-5" />
    </>
  );
}
