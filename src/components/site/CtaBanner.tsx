import Link from "next/link";
import type { SiteSetting } from "@/generated/prisma/client";

export default function CtaBanner({ s }: { s: SiteSetting }) {
  return (
    <section className="section-sm">
      <div className="container">
        <div className="cta-banner reveal">
          <div className="row align-items-center g-4">
            <div className="col-lg-8">
              <h2 className="display-6 mb-2">{s.ctaTitle || "Ready to start your project?"}</h2>
              <p className="mb-0 fs-5">{s.ctaSubtitle || "Talk to our experts today."}</p>
            </div>
            <div className="col-lg-4 d-flex flex-wrap gap-2 justify-content-lg-end">
              <Link href="/contact" className="btn btn-accent btn-lg">
                {s.heroCtaText || "Contact us"} <i className="bi bi-arrow-right ms-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
