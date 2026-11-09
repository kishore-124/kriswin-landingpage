import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Flash } from "@/components/admin/Fields";
import { EmptyState, PageTitle } from "@/components/admin/ui";
import { QuickToggle, TableSearch } from "@/components/admin/ListTools";
import DeleteButton from "@/components/admin/DeleteButton";
import { deleteCaseStudy, toggleFlag } from "../../actions";

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function CaseStudiesAdmin({ searchParams }: Props) {
  const sp = await searchParams;
  const items = await prisma.caseStudy.findMany({ orderBy: [{ sortOrder: "asc" }, { id: "asc" }] });
  return (
    <>
      <PageTitle
        title="Case Studies"
        subtitle="Portfolio projects. Featured ones appear in “Success stories” on the Home page."
        actions={<Link href="/admin/case-studies/new" className="btn btn-brand"><i className="bi bi-plus-lg me-1" /> Add case study</Link>}
      />
      <Flash sp={sp} />
      <div className="admin-card">
        {items.length === 0 ? (
          <EmptyState icon="bi-journal-richtext" title="No case studies yet" text="Show prospects what you've built." href="/admin/case-studies/new" cta="Add case study" />
        ) : (
          <>
            <div className="list-toolbar"><TableSearch target="tbl" placeholder="Search case studies…" /></div>
            <div className="table-responsive">
              <table className="table admin-table" id="tbl">
                <thead><tr><th>Case study</th><th>Industry</th><th className="text-center">On Home</th><th className="text-center">Visible</th><th className="text-end">Actions</th></tr></thead>
                <tbody>
                  {items.map((c) => (
                    <tr key={c.id} data-row>
                      <td>
                        <div className="d-flex gap-3 align-items-center">
                          <span className="thumb">
                            {c.imageUrl ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={c.imageUrl} alt="" />
                            ) : <i className="bi bi-journal-richtext" />}
                          </span>
                          <div className="min-w-0">
                            <Link href={`/admin/case-studies/${c.id}`} className="row-title">{c.title}</Link>
                            <div className="row-sub">{c.client}</div>
                          </div>
                        </div>
                      </td>
                      <td>{c.industry ? <span className="tag brand">{c.industry}</span> : <span className="text-muted-2">—</span>}</td>
                      <td className="text-center"><QuickToggle action={toggleFlag} model="caseStudy" field="featured" id={c.id} checked={c.featured} title="Feature on Home page" /></td>
                      <td className="text-center"><QuickToggle action={toggleFlag} model="caseStudy" id={c.id} checked={c.published} title="Visible on website" /></td>
                      <td className="text-end text-nowrap">
                        <a href={`/portfolio/${c.slug}`} target="_blank" rel="noopener" className="btn btn-sm btn-light border btn-icon me-1" title="View"><i className="bi bi-eye" /></a>
                        <Link href={`/admin/case-studies/${c.id}`} className="btn btn-sm btn-light border btn-icon me-1" title="Edit"><i className="bi bi-pencil" /></Link>
                        <DeleteButton action={deleteCaseStudy} id={c.id} />
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
