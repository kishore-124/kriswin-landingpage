import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { initials } from "@/lib/utils";
import { Flash } from "@/components/admin/Fields";
import { EmptyState, PageTitle } from "@/components/admin/ui";
import { QuickToggle, TableSearch } from "@/components/admin/ListTools";
import DeleteButton from "@/components/admin/DeleteButton";
import { deleteTeamMember, toggleFlag } from "../../actions";

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function TeamAdmin({ searchParams }: Props) {
  const sp = await searchParams;
  const items = await prisma.teamMember.findMany({ orderBy: [{ sortOrder: "asc" }, { id: "asc" }] });
  return (
    <>
      <PageTitle
        title="Team"
        subtitle="People shown on the About Us page."
        actions={<Link href="/admin/team/new" className="btn btn-brand"><i className="bi bi-plus-lg me-1" /> Add member</Link>}
      />
      <Flash sp={sp} />
      <div className="admin-card">
        {items.length === 0 ? (
          <EmptyState icon="bi-people" title="No team members yet" text="Introduce the people behind your company." href="/admin/team/new" cta="Add member" />
        ) : (
          <>
            <div className="list-toolbar"><TableSearch target="tbl" placeholder="Search team…" /></div>
            <div className="table-responsive">
              <table className="table admin-table" id="tbl">
                <thead><tr><th>Member</th><th className="text-center">Order</th><th className="text-center">Visible</th><th className="text-end">Actions</th></tr></thead>
                <tbody>
                  {items.map((m) => (
                    <tr key={m.id} data-row>
                      <td>
                        <div className="d-flex gap-3 align-items-center">
                          <span className="avatar">
                            {m.imageUrl ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={m.imageUrl} alt="" />
                            ) : initials(m.name)}
                          </span>
                          <div>
                            <Link href={`/admin/team/${m.id}`} className="row-title">{m.name}</Link>
                            <div className="row-sub">{m.role}</div>
                          </div>
                        </div>
                      </td>
                      <td className="text-center"><span className="order-badge">{m.sortOrder}</span></td>
                      <td className="text-center"><QuickToggle action={toggleFlag} model="teamMember" id={m.id} checked={m.published} title="Visible on website" /></td>
                      <td className="text-end text-nowrap">
                        <Link href={`/admin/team/${m.id}`} className="btn btn-sm btn-light border btn-icon me-1" title="Edit"><i className="bi bi-pencil" /></Link>
                        <DeleteButton action={deleteTeamMember} id={m.id} />
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
