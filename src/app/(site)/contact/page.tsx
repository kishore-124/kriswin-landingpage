import type { Metadata } from "next";
import { getServices, getSettings } from "@/lib/data";
import PageHeader from "@/components/site/PageHeader";
import ContactForm from "@/components/site/ContactForm";

export const metadata: Metadata = { title: "Contact Us" };

export default async function ContactPage() {
  const [s, services] = await Promise.all([getSettings(), getServices()]);
  const wa = s.whatsapp.replace(/\D/g, "");
  const items = [
    s.phone && { icon: "bi-telephone", label: "Call us", value: s.phone, href: `tel:${s.phone.replace(/\s/g, "")}` },
    s.email && { icon: "bi-envelope", label: "Email us", value: s.email, href: `mailto:${s.email}` },
    wa && { icon: "bi-whatsapp", label: "WhatsApp", value: "Chat with us", href: `https://wa.me/${wa}` },
    s.address && { icon: "bi-geo-alt", label: "Visit us", value: s.address },
  ].filter(Boolean) as { icon: string; label: string; value: string; href?: string }[];

  return (
    <>
      <PageHeader
        title="Contact Us"
        subtitle="Have a question or a project in mind? We'd love to hear from you."
        crumbs={[{ label: "Contact" }]}
      />
      <section className="section">
        <div className="container">
          <div className="row g-5">
            <div className="col-lg-5">
              <span className="eyebrow">Get in touch</span>
              <h2 className="section-title mb-3">Let&apos;s talk about your next project</h2>
              <p className="text-muted-2 mb-4">
                Share a few details and our team will reach out with ideas, a timeline and a transparent estimate.
              </p>
              <div className="d-grid gap-3">
                {items.map((it) => (
                  <div className="contact-info-card" key={it.label}>
                    <div className="icon-box"><i className={`bi ${it.icon}`} /></div>
                    <div>
                      <div className="small text-muted-2 fw-semibold">{it.label}</div>
                      {it.href ? (
                        <a href={it.href} target={it.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">
                          {it.value}
                        </a>
                      ) : (
                        <span className="fw-semibold text-dark">{it.value}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="col-lg-7">
              <ContactForm services={services.map((x) => x.title)} />
            </div>
          </div>
        </div>
      </section>
      {s.mapEmbedUrl && (
        <section className="pb-5">
          <div className="container">
            <iframe
              className="map-frame"
              src={s.mapEmbedUrl}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Office location"
            />
          </div>
        </section>
      )}
    </>
  );
}
