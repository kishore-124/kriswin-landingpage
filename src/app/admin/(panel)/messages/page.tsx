import { prisma } from "@/lib/prisma";
import { initials } from "@/lib/utils";
import { Flash } from "@/components/admin/Fields";
import { EmptyState, PageTitle } from "@/components/admin/ui";
import DeleteButton from "@/components/admin/DeleteButton";
import { deleteMessage, toggleMessageRead } from "../../actions";

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

function ago(d: Date) {
  const s = Math.floor((Date.now() - d.getTime()) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)} min ago`;
  if (s < 86400) return `${Math.floor(s / 3600)} h ago`;
  if (s < 604800) return `${Math.floor(s / 86400)} d ago`;
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default async function MessagesAdmin({ searchParams }: Props) {
  const sp = await searchParams;
  const filter = sp.filter === "unread" ? "unread" : sp.filter === "read" ? "read" : "all";
  const q = typeof sp.q === "string" ? sp.q.trim() : "";
  const [total, unread, items] = await Promise.all([
    prisma.contactMessage.count(),
    prisma.contactMessage.count({ where: { isRead: false } }),
    prisma.contactMessage.findMany({
      where: {
        ...(filter === "unread" ? { isRead: false } : filter === "read" ? { isRead: true } : {}),
        ...(q ? { OR: ["name", "email", "subject", "message", "phone"].map((f) => ({ [f]: { contains: q, mode: "insensitive" as const } })) } : {}),
      },
      orderBy: { createdAt: "desc" },
      take: 200,
    }),
  ]);

  const tabs = [
    ["all", "All", total],
    ["unread", "Unread", unread],
    ["read", "Read", total - unread],
  ] as const;

  return (
    <>
      <PageTitle title="Messages" subtitle="Enquiries submitted through the website's contact forms." />
      <Flash sp={sp} />
      <div className="admin-card">
        <div className="list-toolbar">
          <div className="filter-pills">
            {tabs.map(([id, label, n]) => (
              <a key={id} href={`/admin/messages${id === "all" ? "" : `?filter=${id}`}`} className={filter === id ? "active" : ""}>
                {label}<span className="n">{n}</span>
              </a>
            ))}
          </div>
          <form className="search-box" action="/admin/messages">
            {filter !== "all" && <input type="hidden" name="filter" value={filter} />}
            <i className="bi bi-search" />
            <input className="form-control" name="q" defaultValue={q} placeholder="Search name, email, message…" aria-label="Search messages" />
          </form>
        </div>

        {items.length === 0 ? (
          <EmptyState icon="bi-inbox" title={q ? "No matching messages" : "Inbox is empty"} text={q ? "Try a different search." : "New enquiries from your website will show up here."} />
        ) : (
          items.map((m) => (
            <div key={m.id} className={`msg ${m.isRead ? "" : "unread"}`}>
              <span className="avatar">{initials(m.name)}</span>
              <div className="flex-grow-1 min-w-0">
                <div className="d-flex justify-content-between gap-3 flex-wrap">
                  <div>
                    <span className="msg-name">{m.name}</span>
                    <div className="small">
                      <a href={`mailto:${m.email}`} className="text-decoration-none">{m.email}</a>
                      {m.phone && <> · <a href={`tel:${m.phone}`} className="text-decoration-none">{m.phone}</a></>}
                    </div>
                  </div>
                  <div className="text-end">
                    <div className="small text-muted-2" title={m.createdAt.toLocaleString("en-IN")}>{ago(m.createdAt)}</div>
                    {m.subject && <span className="tag brand mt-1 d-inline-block">{m.subject}</span>}
                  </div>
                </div>
                <div className="msg-body">{m.message}</div>
                <div className="d-flex gap-2 flex-wrap">
                  <a href={`mailto:${m.email}?subject=${encodeURIComponent("Re: " + (m.subject || "Your enquiry"))}`} className="btn btn-sm btn-brand">
                    <i className="bi bi-reply me-1" />Reply by email
                  </a>
                  {m.phone && (
                    <a href={`https://wa.me/${m.phone.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-light border">
                      <i className="bi bi-whatsapp me-1 text-success" />WhatsApp
                    </a>
                  )}
                  <form action={toggleMessageRead}>
                    <input type="hidden" name="id" value={m.id} />
                    <button className="btn btn-sm btn-light border">
                      <i className={`bi ${m.isRead ? "bi-envelope" : "bi-envelope-open"} me-1`} />Mark {m.isRead ? "unread" : "read"}
                    </button>
                  </form>
                  <DeleteButton action={deleteMessage} id={m.id} confirmText="Delete this message?" />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
