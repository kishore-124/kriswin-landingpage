import Link from "next/link";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { getSettings } from "@/lib/data";
import { initials } from "@/lib/utils";

function greeting() {
  const h = Number(new Intl.DateTimeFormat("en-IN", { hour: "numeric", hour12: false, timeZone: "Asia/Kolkata" }).format(new Date()));
  return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
}

export default async function Dashboard() {
  const session = await requireAdmin();
  const [s, services, products, cases, team, testimonials, unread, totalMsgs, latest, user, sampleCounts] = await Promise.all([
    getSettings(),
    prisma.service.count({ where: { published: true } }),
    prisma.product.count({ where: { published: true } }),
    prisma.caseStudy.count({ where: { published: true } }),
    prisma.teamMember.count({ where: { published: true } }),
    prisma.testimonial.count({ where: { published: true } }),
    prisma.contactMessage.count({ where: { isRead: false } }),
    prisma.contactMessage.count(),
    prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.adminUser.findUnique({ where: { id: session.userId } }),
    Promise.all([
      prisma.product.count({ where: { name: { in: ["Product Two", "Product Three"] } } }),
      prisma.caseStudy.count({ where: { client: { startsWith: "Sample" } } }),
      prisma.teamMember.count({ where: { bio: { startsWith: "Sample profile" } } }),
      prisma.testimonial.count({ where: { name: "Client Name" } }),
    ]),
  ]);

  const [sampleProducts, sampleCases, sampleTeam, sampleTestimonials] = sampleCounts;
  const defaultPassword = user ? await bcrypt.compare("Admin@123", user.passwordHash) : false;

  const checklist = [
    { done: !defaultPassword, label: "Change the default admin password", href: "/admin/account" },
    { done: s.phone !== "+91 7010950016 / +917010889324" && !!s.phone, label: "Add your real phone number", href: "/admin/settings?tab=contact" },
    { done: !!s.address && s.address !== "India", label: "Add your office address & map", href: "/admin/settings?tab=contact" },
    { done: !!s.whatsapp, label: "Add a WhatsApp number (shows chat button)", href: "/admin/settings?tab=contact" },
    { done: sampleProducts === 0, label: "Replace the sample products", href: "/admin/products" },
    { done: sampleCases === 0, label: "Replace the sample case studies", href: "/admin/case-studies" },
    { done: sampleTeam === 0, label: "Add your real team members", href: "/admin/team" },
    { done: sampleTestimonials === 0, label: "Add real client testimonials", href: "/admin/testimonials" },
  ];
  const doneCount = checklist.filter((c) => c.done).length;
  const pct = Math.round((doneCount / checklist.length) * 100);

  const kpis = [
    { label: "Services", value: services, icon: "bi-briefcase", tone: "tone-blue", href: "/admin/services" },
    { label: "Products", value: products, icon: "bi-box-seam", tone: "tone-orange", href: "/admin/products" },
    { label: "Case studies", value: cases, icon: "bi-journal-richtext", tone: "tone-purple", href: "/admin/case-studies" },
    { label: "Team members", value: team, icon: "bi-people", tone: "tone-teal", href: "/admin/team" },
    { label: "Testimonials", value: testimonials, icon: "bi-chat-quote", tone: "tone-pink", href: "/admin/testimonials" },
    { label: "New messages", value: unread, icon: "bi-inbox", tone: "tone-green", href: "/admin/messages", sub: `${totalMsgs} total` },
  ];

  return (
    <>
      <div className="welcome d-flex justify-content-between align-items-center gap-3 flex-wrap">
        <div>
          <h1>{greeting()}, {(session.name || "Admin").split(" ")[0]} 👋</h1>
          <p>Here&apos;s what&apos;s happening with the {s.companyName} website.</p>
        </div>
        <div className="d-flex gap-2 flex-wrap">
          <Link href="/admin/settings" className="btn btn-light"><i className="bi bi-pencil-square me-1" /> Edit website content</Link>
          <a href="/" target="_blank" rel="noopener" className="btn btn-glass"><i className="bi bi-globe2 me-1" /> View site</a>
        </div>
      </div>

      <div className="row g-3 mb-4">
        {kpis.map((k) => (
          <div className="col-6 col-md-4 col-xxl-2" key={k.label}>
            <Link href={k.href} className="admin-card kpi">
              <div className="top">
                <span className={`ic ${k.tone}`}><i className={`bi ${k.icon}`} /></span>
                <i className="bi bi-arrow-up-right text-muted-2" />
              </div>
              <div>
                <div className="num">{k.value}</div>
                <div className="lbl">{k.label}</div>
                {k.sub && <div className="sub">{k.sub}</div>}
              </div>
            </Link>
          </div>
        ))}
      </div>

      <div className="row g-4">
        <div className="col-xl-8">
          <div className="admin-card mb-4">
            <div className="card-head">
              <div><h2>Latest enquiries</h2><p>Messages from your contact forms</p></div>
              <Link href="/admin/messages" className="btn btn-sm btn-light border">View all</Link>
            </div>
            {latest.length === 0 ? (
              <div className="empty py-4">
                <div className="ic"><i className="bi bi-inbox" /></div>
                <h3>No messages yet</h3>
                <p className="mb-0">Enquiries from the website will appear here.</p>
              </div>
            ) : (
              latest.map((m) => (
                <Link href="/admin/messages" key={m.id} className="checklist-item">
                  <span className="avatar" style={{ width: 38, height: 38, fontSize: ".8rem" }}>{initials(m.name)}</span>
                  <div className="flex-grow-1 min-w-0">
                    <div className="d-flex justify-content-between gap-2">
                      <span className={`text-dark ${m.isRead ? "fw-semibold" : "fw-bold"}`}>{m.name}{!m.isRead && <span className="badge rounded-pill bg-brand ms-2">New</span>}</span>
                      <small className="text-muted-2 text-nowrap">{m.createdAt.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</small>
                    </div>
                    <div className="row-sub" style={{ maxWidth: "100%" }}>{m.subject ? `${m.subject} — ` : ""}{m.message}</div>
                  </div>
                </Link>
              ))
            )}
          </div>

          <div className="admin-card">
            <div className="card-head"><div><h2>Quick actions</h2><p>Jump straight into common tasks</p></div></div>
            <div className="card-body-pad">
              <div className="quick-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))" }}>
                {[
                  ["/admin/settings?tab=home", "bi-house", "Edit home page"],
                  ["/admin/services/new", "bi-plus-circle", "Add a service"],
                  ["/admin/products/new", "bi-plus-circle", "Add a product"],
                  ["/admin/case-studies/new", "bi-plus-circle", "Add a case study"],
                  ["/admin/settings?tab=sections", "bi-grid-3x3-gap", "Edit FAQs & sections"],
                  ["/admin/settings?tab=general", "bi-palette", "Change brand colours"],
                ].map(([href, icon, label]) => (
                  <Link key={href} href={href} className="quick"><i className={`bi ${icon}`} />{label}</Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-4">
          <div className="admin-card">
            <div className="card-head">
              <div><h2>Website setup</h2><p>{doneCount} of {checklist.length} done</p></div>
              <span className="fw-bold text-brand">{pct}%</span>
            </div>
            <div className="px-4 pt-3 pb-2"><div className="progress-thin"><div style={{ width: `${pct}%` }} /></div></div>
            <div className="pb-2">
              {checklist.map((c) => (
                <Link key={c.label} href={c.href} className={`checklist-item ${c.done ? "done" : "todo"}`}>
                  <span className="st"><i className={`bi ${c.done ? "bi-check-lg" : "bi-arrow-right"}`} /></span>
                  <span className="t small fw-semibold">{c.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
