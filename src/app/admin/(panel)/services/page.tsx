import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { iconClass } from "@/lib/utils";
import { Flash } from "@/components/admin/Fields";
import { EmptyState, PageTitle } from "@/components/admin/ui";
import { QuickToggle, TableSearch } from "@/components/admin/ListTools";
import DeleteButton from "@/components/admin/DeleteButton";
import { deleteService, toggleFlag } from "../../actions";

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function ServicesAdmin({ searchParams }: Props) {
  const sp = await searchParams;
  const items = await prisma.service.findMany({ orderBy: [{ sortOrder: "asc" }, { id: "asc" }] });
  const live = items.filter((i) => i.published).length;
  return (
    <>
      <PageTitle
        title="Services"
        subtitle="Shown on the Home page, the Services page and in the navigation menu."
        actions={<Link href="/admin/services/new" className="btn btn-brand"><i className="bi bi-plus-lg me-1" /> Add service</Link>}
      />
      <Flash sp={sp} />
      <div className="admin-card">
        {items.length === 0 ? (
          <EmptyState icon="bi-briefcase" title="No services yet" text="Add the services your company offers." href="/admin/services/new" cta="Add service" />
        ) : (
          <>
            <div className="list-toolbar">
              <TableSearch target="tbl" placeholder="Search services…" />
              <span className="small text-muted-2">{live} live · {items.length - live} hidden</span>
            </div>
            <div className="table-responsive">
              <table className="table admin-table" id="tbl">
                <thead><tr><th>Service</th><th className="text-center">Order</th><th className="text-center">Visible</th><th className="text-end">Actions</th></tr></thead>
                <tbody>
                  {items.map((s) => (
                    <tr key={s.id} data-row>
                      <td>
                        <div className="d-flex gap-3 align-items-center">
                          <span className="thumb"><i className={iconClass(s.icon)} /></span>
                          <div className="min-w-0">
                            <Link href={`/admin/services/${s.id}`} className="row-title">{s.title}</Link>
                            <div className="row-sub">{s.summary}</div>
                          </div>
                        </div>
                      </td>
                      <td className="text-center"><span className="order-badge">{s.sortOrder}</span></td>
                      <td className="text-center"><QuickToggle action={toggleFlag} model="service" id={s.id} checked={s.published} title="Visible on website" /></td>
                      <td className="text-end text-nowrap">
                        <a href={`/services/${s.slug}`} target="_blank" rel="noopener" className="btn btn-sm btn-light border btn-icon me-1" title="View"><i className="bi bi-eye" /></a>
                        <Link href={`/admin/services/${s.id}`} className="btn btn-sm btn-light border btn-icon me-1" title="Edit"><i className="bi bi-pencil" /></Link>
                        <DeleteButton action={deleteService} id={s.id} />
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
