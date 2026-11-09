import Link from "next/link";
import { getCaseStudies, getProducts, getServices, getSettings, getTestimonials } from "@/lib/data";
import { iconClass, lines, pipeLines, splitCompanyName } from "@/lib/utils";
import { CaseCard, ProductCard, SectionHeading, ServiceCard, TestimonialCard } from "@/components/site/Cards";
import TechTabs from "@/components/site/TechTabs";
import ContactForm from "@/components/site/ContactForm";
import CtaBanner from "@/components/site/CtaBanner";

const process = [
  { title: "Discover", text: "Workshops to understand your goals, users and constraints." },
  { title: "Design", text: "Wireframes, prototypes and a clear technical blueprint." },
  { title: "Develop", text: "Agile sprints with weekly demos and full transparency." },
  { title: "Launch & Grow", text: "Go-live, monitoring and continuous improvement." },
];

export default async function HomePage() {
  const [s, services, products, cases, testimonials] = await Promise.all([
    getSettings(),
    getServices(),
    getProducts(),
    getCaseStudies(),
    getTestimonials(),
  ]);

  const whyUs = pipeLines(s.whyUs);
  const challenges = pipeLines(s.challenges);
  const industries = pipeLines(s.industries);
  const faqs = pipeLines(s.faqs);
  const trusted = lines(s.trustedBy);
  const consultPoints = lines(s.consultPoints);
  const techGroups = pipeLines(s.technologies).map(([name, items = ""]) => ({
    name,
    items: items.split(",").map((t) => t.trim()).filter(Boolean),
  }));
  const featuredCases = cases.filter((c) => c.featured).slice(0, 3);

  // Highlight the last two words of the hero headline
  const words = (s.heroTitle || s.tagline).split(" ");
  const head = words.slice(0, -2).join(" ");
  const tail = words.slice(-2).join(" ");

  return (
    <>
      {/* ================= Hero ================= */}
      <section className="hero">
        <div className="container position-relative">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              {s.heroBadge && (
                <span className="pill mb-4">
                  <span className="dot"><i className="bi bi-lightning-charge-fill" /></span>
                  {s.heroBadge}
                </span>
              )}
              <h1 className="mb-4">
                {head} <span className="hl">{tail}</span>
              </h1>
              <p className="lead mb-4 pb-2">{s.heroSubtitle}</p>
              <div className="d-flex flex-wrap gap-3 mb-5">
                <Link href="/contact" className="btn btn-brand btn-lg">
                  <i className="bi bi-calendar-check me-2" />{s.heroCtaText || "Contact us"}
                </Link>
                <Link href="/portfolio" className="btn btn-ghost btn-lg">
                  {s.heroCta2Text || "See our work"} <i className="bi bi-arrow-right ms-1" />
                </Link>
              </div>
              <div className="hero-proof">
                <div className="avatars">
                  {["#0085B1", "#5DB823", "#00998E", "#0c2233"].map((c, i) => (
                    <span key={c} style={{ background: c }}>{["A", "S", "R", "K"][i]}</span>
                  ))}
                </div>
                <div className="small">
                  <div className="stars">★★★★★</div>
                  <span className="text-muted-2">Trusted by <strong className="text-dark">{s.statClients}</strong> businesses</span>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="hero-visual">
                <div className="hv-main">
                  <div className="hv-head">
                    <div className="hv-dots"><span /><span /><span /></div>
                    <span className="tag brand"><i className="bi bi-circle-fill me-1" style={{ fontSize: ".5rem" }} />Live project</span>
                  </div>
                  <div className="row g-3 mb-3">
                    <div className="col-6"><div className="hv-kpi"><div className="lbl">Projects delivered</div><div className="val">{s.statProjects}</div></div></div>
                    <div className="col-6"><div className="hv-kpi"><div className="lbl">Uptime</div><div className="val">{s.statSupport}</div></div></div>
                  </div>
                  <div className="hv-kpi mb-3">
                    <div className="d-flex justify-content-between"><div className="lbl">Sprint velocity</div><span className="small fw-bold text-success">▲ 38%</span></div>
                    <div className="hv-chart">
                      {[42, 60, 48, 72, 58, 84, 70, 95, 80].map((h, i) => (
                        <span key={i} style={{ height: `${h}%`, animationDelay: `${i * 0.07}s` }} />
                      ))}
                    </div>
                  </div>
                  {[
                    ["bi-check2-circle", "UI/UX design approved", "Done"],
                    ["bi-code-slash", "API & mobile app development", "In progress"],
                  ].map(([ic, t, st]) => (
                    <div className="hv-row" key={t}>
                      <span className="ic"><i className={`bi ${ic}`} /></span>
                      <span className="flex-grow-1 fw-semibold text-dark">{t}</span>
                      <span className={`tag ${st === "Done" ? "brand" : ""}`}>{st}</span>
                    </div>
                  ))}
                </div>
                <div className="chip-float c1">
                  <span className="ic"><i className="bi bi-rocket-takeoff" /></span>
                  <div>Launched on time<small>Agile delivery</small></div>
                </div>
                <div className="chip-float c2">
                  <span className="ic"><i className="bi bi-shield-check" /></span>
                  <div>Secure &amp; scalable<small>Cloud-native</small></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= Trusted by ================= */}
      {trusted.length > 0 && (
        <section className="trusted">
          <div className="container">
            <div className="row align-items-center g-3">
              <div className="col-lg-2 label text-center text-lg-start">Trusted by</div>
              <div className="col-lg-10">
                <div className="marquee">
                  <div className="marquee-track">
                    {[...trusted, ...trusted].map((t, i) => (
                      <span className="logo-word" key={i} aria-hidden={i >= trusted.length}>
                        <i className="bi bi-hexagon-fill" style={{ fontSize: ".9rem" }} />{t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ================= Challenges ================= */}
      {challenges.length > 0 && (
        <section className="section bg-surface">
          <div className="container">
            <SectionHeading
              eyebrow="Sound familiar?"
              title={<>Technology problems that <span className="hl">hold you back</span></>}
              lead="Most businesses we meet face at least one of these. The good news — every one of them is solvable."
            />
            <div className="row g-4">
              {challenges.map(([icon, title, text], i) => (
                <div className="col-md-6 col-lg-4 reveal" key={i}>
                  <div className="challenge-card">
                    <div className="icon-box"><i className={iconClass(icon)} /></div>
                    <h3>{title}</h3>
                    <p>{text}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-5 reveal">
              <p className="fw-semibold text-dark mb-3">We help you fix them — end to end.</p>
              <Link href="/contact" className="btn btn-brand">Talk to an expert <i className="bi bi-arrow-right ms-1" /></Link>
            </div>
          </div>
        </section>
      )}

      {/* ================= Services ================= */}
      <section className="section">
        <div className="container">
          <div className="row align-items-end mb-5 g-3">
            <div className="col-lg-7">
              <SectionHeading
                center={false}
                eyebrow="What we do"
                title={<>Services that cover your <span className="hl">entire journey</span></>}
                lead="From the first idea to scale — strategy, design, engineering, cloud and support under one roof."
              />
            </div>
            <div className="col-lg-5 text-lg-end mb-5">
              <Link href="/services" className="btn btn-outline-brand">All services <i className="bi bi-arrow-right ms-1" /></Link>
            </div>
          </div>
          <div className="row g-4" style={{ marginTop: "-2rem" }}>
            {services.slice(0, 8).map((sv, i) => (
              <div className="col-md-6 col-lg-3 reveal" key={sv.id}>
                <ServiceCard s={sv} index={i} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= Stats ================= */}
      <section className="pb-5">
        <div className="container">
          <div className="stats-band reveal">
            <div className="row text-center g-4">
              {[
                [s.statYears, "Years of experience"],
                [s.statClients, "Happy clients"],
                [s.statProjects, "Projects delivered"],
                [s.statSupport, "Uptime & reliability"],
              ].map(([n, l]) => (
                <div className="col-6 col-md-3 stat" key={l}>
                  <div className="num">{n}</div>
                  <div className="lbl">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= Case studies ================= */}
      {featuredCases.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="row align-items-end g-3">
              <div className="col-lg-8">
                <SectionHeading
                  center={false}
                  eyebrow="Success stories"
                  title={<>Real projects. <span className="hl">Real results.</span></>}
                  lead="A look at how we've helped businesses solve problems and grow with technology."
                />
              </div>
              <div className="col-lg-4 text-lg-end mb-5">
                <Link href="/portfolio" className="btn btn-outline-brand">View portfolio <i className="bi bi-arrow-right ms-1" /></Link>
              </div>
            </div>
            <div className="row g-4 row-cols-1 row-cols-md-2 row-cols-lg-3" style={{ marginTop: "-2rem" }}>
              {featuredCases.map((c) => (
                <div className="col reveal" key={c.id}><CaseCard c={c} /></div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ================= Why us ================= */}
      {whyUs.length > 0 && (
        <section className="section bg-surface">
          <div className="container">
            <div className="row g-4 align-items-stretch">
              <div className="col-lg-4 reveal">
                <div className="why-panel d-flex flex-column">
                  <span className="eyebrow text-white">Why {splitCompanyName(s.companyName).name.split(" ")[0]}</span>
                  <h2 className="section-title mb-3">A partner you can count on</h2>
                  <p>{s.aboutContent.split(/\n/)[0]}</p>
                  <div className="mt-auto pt-4">
                    <div className="big">{s.statYears}</div>
                    <div className="fw-semibold">years of delivering software</div>
                    <Link href="/about" className="btn btn-light mt-4">About us <i className="bi bi-arrow-right ms-1" /></Link>
                  </div>
                </div>
              </div>
              <div className="col-lg-8">
                <div className="row g-3">
                  {whyUs.map(([icon, title, text], i) => (
                    <div className="col-md-6 reveal" key={i}>
                      <div className="why-item">
                        <div className="icon-box"><i className={iconClass(icon)} /></div>
                        <div><h4>{title}</h4><p>{text}</p></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ================= Products ================= */}
      {products.length > 0 && (
        <section className="section">
          <div className="container">
            <SectionHeading
              eyebrow="Our products"
              title={<>SaaS products, <span className="hl">built in-house</span></>}
              lead="Ready-to-use software built and maintained by our team — used by businesses and customers every day."
            />
            <div className="row g-4 row-cols-1 row-cols-md-2 row-cols-lg-3">
              {products.slice(0, 3).map((p) => (
                <div className="col reveal" key={p.id}><ProductCard p={p} /></div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ================= Process ================= */}
      <section className="section bg-surface">
        <div className="container">
          <SectionHeading eyebrow="How we work" title={<>A simple, <span className="hl">proven process</span></>} />
          <div className="row g-4 process">
            {process.map((p, i) => (
              <div className="col-sm-6 col-lg-3 process-step reveal" key={p.title}>
                <div className="process-num">{String(i + 1).padStart(2, "0")}</div>
                <h4>{p.title}</h4>
                <p>{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= Technologies ================= */}
      {techGroups.length > 0 && (
        <section className="section">
          <div className="container">
            <SectionHeading
              eyebrow="Technologies"
              title={<>The right tools for <span className="hl">every job</span></>}
              lead="We pick proven, modern technologies that fit your goals, budget and team."
            />
            <TechTabs groups={techGroups} />
          </div>
        </section>
      )}

      {/* ================= Industries ================= */}
      {industries.length > 0 && (
        <section className="section bg-navy on-dark">
          <div className="container">
            <SectionHeading
              eyebrow="Industries"
              title="Domain experience across industries"
              lead="We understand the workflows, regulations and users of the industries we build for."
            />
            <div className="row g-3">
              {industries.map(([icon, name], i) => (
                <div className="col-6 col-lg-3 reveal" key={i}>
                  <div className="industry"><i className={iconClass(icon)} />{name}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ================= Testimonials ================= */}
      {testimonials.length > 0 && (
        <section className="section">
          <div className="container">
            <SectionHeading eyebrow="Testimonials" title={<>What our <span className="hl">clients say</span></>} />
            <div className="row g-4">
              {testimonials.slice(0, 3).map((t) => (
                <div className="col-md-6 col-lg-4 reveal" key={t.id}><TestimonialCard t={t} /></div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ================= Consultation form ================= */}
      <section className="section pt-0" id="consultation">
        <div className="container">
          <div className="consult-wrap">
            <div className="row g-5 align-items-center">
              <div className="col-lg-5">
                <span className="eyebrow">Free consultation</span>
                <h2 className="section-title mb-3">Let&apos;s discuss your <span className="hl">project</span></h2>
                <p className="text-muted-2 mb-4">Share a few details and our experts will get back to you. Here&apos;s what you can expect:</p>
                {consultPoints.map((p) => (
                  <div className="consult-point" key={p}><i className="bi bi-check-circle-fill" /><span>{p}</span></div>
                ))}
                <div className="d-flex gap-4 mt-4 pt-3 border-top flex-wrap">
                  {s.email && <a href={`mailto:${s.email}`} className="fw-semibold text-decoration-none"><i className="bi bi-envelope me-1" />{s.email}</a>}
                  {s.phone && <a href={`tel:${s.phone.replace(/\s/g, "")}`} className="fw-semibold text-decoration-none"><i className="bi bi-telephone me-1" />{s.phone}</a>}
                </div>
              </div>
              <div className="col-lg-7">
                <ContactForm services={services.map((x) => x.title)} title="Book your free consultation" subtitle="It takes less than a minute." />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FAQ ================= */}
      {faqs.length > 0 && (
        <section className="section bg-surface">
          <div className="container">
            <div className="row g-5">
              <div className="col-lg-4">
                <SectionHeading center={false} eyebrow="FAQ" title="Frequently asked questions" lead="Can't find what you're looking for? Reach out — we're happy to help." />
                <Link href="/contact" className="btn btn-brand">Ask a question</Link>
              </div>
              <div className="col-lg-8 faq">
                {faqs.map(([q, a], i) => (
                  <details key={i} open={i === 0}>
                    <summary>{q}</summary>
                    <p>{a}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <CtaBanner s={s} />
      <div className="pb-5" />
    </>
  );
}
