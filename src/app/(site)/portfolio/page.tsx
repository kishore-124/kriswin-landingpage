import type { Metadata } from "next";
import { getCaseStudies, getSettings } from "@/lib/data";
import PageHeader from "@/components/site/PageHeader";
import CtaBanner from "@/components/site/CtaBanner";
import { CaseCard } from "@/components/site/Cards";

export const metadata: Metadata = { title: "Portfolio" };

export default async function PortfolioPage() {
  const [s, cases] = await Promise.all([getSettings(), getCaseStudies()]);
  return (
    <>
      <PageHeader
        title="Portfolio & Case Studies"
        subtitle="Real stories of how we help businesses solve problems and grow with technology."
        crumbs={[{ label: "Portfolio" }]}
      />
      <section className="section">
        <div className="container">
          <div className="row g-4 row-cols-1 row-cols-md-2 row-cols-lg-3">
            {cases.map((c) => (
              <div className="col reveal" key={c.id}><CaseCard c={c} /></div>
            ))}
          </div>
          {cases.length === 0 && <p className="text-center text-muted-2">Case studies will be published here soon.</p>}
        </div>
      </section>
      <CtaBanner s={s} />
      <div className="pb-5" />
    </>
  );
}
