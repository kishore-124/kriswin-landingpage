import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { initials } from "@/lib/utils";
import { Flash } from "@/components/admin/Fields";
import { EmptyState, PageTitle } from "@/components/admin/ui";
import { QuickToggle, TableSearch } from "@/components/admin/ListTools";
import DeleteButton from "@/components/admin/DeleteButton";
import { deleteTestimonial, toggleFlag } from "../../actions";

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function TestimonialsAdmin({ searchParams }: Props) {
  const sp = await searchParams;
  const items = await prisma.testimonial.findMany({ orderBy: [{ sortOrder: "asc" }, { id: "asc" }] });
  return (
    <>
      <PageTitle
        title="Testimonials"
        subtitle="Client reviews shown on the Home page."
        actions={<Link href="/admin/testimonials/new" className="btn btn-brand"><i className="bi bi-plus-lg me-1" /> Add testimonial</Link>}
      />
      <Flash sp={sp} />
      <div className="admin-card">
        {items.length === 0 ? (
          <EmptyState icon="bi-chat-quote" title="No testimonials yet" text="Add reviews from happy clients." href="/admin/testimonials/new" cta="Add testimonial" />
        ) : (
          <>
            <div className="list-toolbar"><TableSearch target="tbl" placeholder="Search testimonials…" /></div>
            <div className="table-responsive">
              <table className="table admin-table" id="tbl">
                <thead><tr><th>Client</th><th>Review</th><th>Rating</th><th className="text-center">Visible</th><th className="text-end">Actions</th></tr></thead>
                <tbody>
                  {items.map((t) => (
                    <tr key={t.id} data-row>
                      <td>
                        <div className="d-flex gap-3 align-items-center">
                          <span className="avatar">{initials(t.name)}</span>
                          <div>
                            <Link href={`/admin/testimonials/${t.id}`} className="row-title">{t.name}</Link>
                            <div className="row-sub">{t.company}</div>
                          </div>
                        </div>
                      </td>
                      <td><div className="row-sub" style={{ maxWidth: 360 }}>“{t.quote}”</div></td>
                      <td className="stars text-nowrap">{"★".repeat(t.rating)}</td>
                      <td className="text-center"><QuickToggle action={toggleFlag} model="testimonial" id={t.id} checked={t.published} title="Visible on website" /></td>
                      <td className="text-end text-nowrap">
                        <Link href={`/admin/testimonials/${t.id}`} className="btn btn-sm btn-light border btn-icon me-1" title="Edit"><i className="bi bi-pencil" /></Link>
                        <DeleteButton action={deleteTestimonial} id={t.id} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </>
  );
}
