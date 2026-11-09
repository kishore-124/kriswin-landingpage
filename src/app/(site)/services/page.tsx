import type { Metadata } from "next";
import { getServices, getSettings } from "@/lib/data";
import PageHeader from "@/components/site/PageHeader";
import CtaBanner from "@/components/site/CtaBanner";
import { ServiceCard } from "@/components/site/Cards";

export const metadata: Metadata = { title: "Services" };

export default async function ServicesPage() {
  const [s, services] = await Promise.all([getSettings(), getServices()]);
  return (
    <>
      <PageHeader
        title="Our Services"
        subtitle="Everything you need to plan, build, launch and grow your digital products."
        crumbs={[{ label: "Services" }]}
      />
      <section className="section">
        <div className="container">
          <div className="row g-4">
            {services.map((sv) => (
              <div className="col-md-6 col-lg-4 reveal" key={sv.id}>
                <ServiceCard s={sv} />
              </div>
            ))}
            {services.length === 0 && <p className="text-center text-muted-2">Services will be listed here soon.</p>}
          </div>
        </div>
      </section>
      <CtaBanner s={s} />
      <div className="pb-5" />
    </>
  );
}
