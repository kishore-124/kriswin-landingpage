import type { Metadata } from "next";
import { getSettings, getTeam } from "@/lib/data";
import { initials, paragraphs, pipeLines, safeUrl } from "@/lib/utils";
import PageHeader from "@/components/site/PageHeader";
import CtaBanner from "@/components/site/CtaBanner";
import { SectionHeading } from "@/components/site/Cards";

export const metadata: Metadata = { title: "About Us" };

export default async function AboutPage() {
  const [s, team] = await Promise.all([getSettings(), getTeam()]);
  const values = pipeLines(s.values);
  const valueIcons = ["bi-heart", "bi-gem", "bi-eye", "bi-flag", "bi-lightbulb", "bi-people"];

  return (
    <>
      <PageHeader title="About Us" subtitle={s.tagline} crumbs={[{ label: "About Us" }]} />

      <section className="section">
        <div className="container">
          <div className="row g-5 align-items-center">
            <div className="col-lg-6 reveal">
              <div className="about-visual pe-lg-4">
                <div className="panel">
                  <div className="big">{s.statYears}</div>
                  <div className="fs-5 fw-semibold">Years of building software that works</div>
                </div>
                <div className="exp-card d-none d-md-block">
                  <div className="d-flex align-items-center gap-3">
                    <span className="icon-box"><i className="bi bi-emoji-smile" /></span>
                    <div>
                      <div className="fw-bold fs-4 text-dark lh-1">{s.statClients}</div>
                      <small className="text-muted-2">Happy clients</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <span className="eyebrow">Who we are</span>
              <h2 className="section-title mb-4">{s.aboutTitle || `About ${s.companyName}`}</h2>
              {paragraphs(s.aboutContent).map((p, i) => (
                <p key={i} className="text-muted-2 fs-6">{p}</p>
              ))}
              <div className="row g-3 mt-2">
                {[
                  [s.statProjects, "Projects delivered"],
                  [s.statClients, "Clients worldwide"],
                ].map(([n, l]) => (
                  <div className="col-6" key={l}>
                    <div className="p-3 rounded-4 bg-brand-soft">
                      <div className="fs-3 fw-bold text-brand">{n}</div>
                      <div className="small fw-semibold">{l}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-surface">
        <div className="container">
          <div className="row g-4">
            <div className="col-md-6 reveal">
              <div className="mv-card bg-white">
                <div className="icon-box mb-3"><i className="bi bi-bullseye" /></div>
                <h3 className="h4">Our Mission</h3>
                <p className="text-muted-2 mb-0">{s.mission}</p>
              </div>
            </div>
            <div className="col-md-6 reveal">
              <div className="mv-card bg-white">
                <div className="icon-box mb-3"><i className="bi bi-binoculars" /></div>
                <h3 className="h4">Our Vision</h3>
                <p className="text-muted-2 mb-0">{s.vision}</p>
              </div>
            </div>
          </div>

          {values.length > 0 && (
            <div className="mt-5 pt-4">
              <SectionHeading eyebrow="Our values" title="What we stand for" />
              <div className="row g-4">
                {values.map(([title, text], i) => (
                  <div className="col-md-6 col-lg-3 reveal" key={i}>
                    <div className="feature-card">
                      <div className="icon-box"><i className={`bi ${valueIcons[i % valueIcons.length]}`} /></div>
                      <h4>{title}</h4>
                      <p>{text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {team.length > 0 && (
        <section className="section">
          <div className="container">
            <SectionHeading eyebrow="Our team" title={<>Meet the <span className="text-gradient">people</span> behind the work</>} />
            <div className="row g-4">
              {team.map((m) => (
                <div className="col-sm-6 col-lg-3 reveal" key={m.id}>
                  <div className="team-card">
                    <span className="avatar">
                      {m.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={m.imageUrl} alt={m.name} />
                      ) : (
                        initials(m.name)
                      )}
                    </span>
                    <h3 className="h5 mb-1">{m.name}</h3>
                    <div className="text-brand fw-semibold small mb-2">{m.role}</div>
                    {m.bio && <p className="text-muted-2 small mb-2">{m.bio}</p>}
                    {m.linkedin && (
                      <a href={safeUrl(m.linkedin)} target="_blank" rel="noopener noreferrer" className="text-muted-2" aria-label="LinkedIn">
                        <i className="bi bi-linkedin" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <CtaBanner s={s} />
      <div className="pb-5" />
    </>
  );
}
