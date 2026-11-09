import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { iconClass, safeUrl } from "@/lib/utils";
import { Flash } from "@/components/admin/Fields";
import { EmptyState, PageTitle } from "@/components/admin/ui";
import { QuickToggle, TableSearch } from "@/components/admin/ListTools";
import DeleteButton from "@/components/admin/DeleteButton";
import { deleteProduct, toggleFlag } from "../../actions";

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function ProductsAdmin({ searchParams }: Props) {
  const sp = await searchParams;
  const items = await prisma.product.findMany({ orderBy: [{ sortOrder: "asc" }, { id: "asc" }] });
  return (
    <>
      <PageTitle
        title="Products"
        subtitle="Your own software products, like EasyBillo."
        actions={<Link href="/admin/products/new" className="btn btn-brand"><i className="bi bi-plus-lg me-1" /> Add product</Link>}
      />
      <Flash sp={sp} />
      <div className="admin-card">
        {items.length === 0 ? (
          <EmptyState icon="bi-box-seam" title="No products yet" text="Showcase the software products you sell." href="/admin/products/new" cta="Add product" />
        ) : (
          <>
            <div className="list-toolbar"><TableSearch target="tbl" placeholder="Search products…" /></div>
            <div className="table-responsive">
              <table className="table admin-table" id="tbl">
                <thead><tr><th>Product</th><th>Website</th><th>Price</th><th className="text-center">Visible</th><th className="text-end">Actions</th></tr></thead>
                <tbody>
                  {items.map((p) => (
                    <tr key={p.id} data-row>
                      <td>
                        <div className="d-flex gap-3 align-items-center">
                          <span className="thumb">
                            {p.imageUrl ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={p.imageUrl} alt="" />
                            ) : <i className={iconClass(p.icon)} />}
                          </span>
                          <div className="min-w-0">
                            <Link href={`/admin/products/${p.id}`} className="row-title">{p.name}</Link>
                            {p.badge && <span className="badge rounded-pill ms-2" style={{ background: "var(--accent-soft)", color: "var(--accent)" }}>{p.badge}</span>}
                            <div className="row-sub">{p.tagline}</div>
                          </div>
                        </div>
                      </td>
                      <td className="small">{p.websiteUrl ? <a href={safeUrl(p.websiteUrl)} target="_blank" rel="noopener noreferrer" className="text-decoration-none">{p.websiteUrl.replace(/^https?:\/\//, "")} <i className="bi bi-box-arrow-up-right" /></a> : <span className="text-muted-2">—</span>}</td>
                      <td className="small fw-semibold">{p.priceLabel || <span className="text-muted-2">—</span>}</td>
                      <td className="text-center"><QuickToggle action={toggleFlag} model="product" id={p.id} checked={p.published} title="Visible on website" /></td>
                      <td className="text-end text-nowrap">
                        <a href={`/products/${p.slug}`} target="_blank" rel="noopener" className="btn btn-sm btn-light border btn-icon me-1" title="View"><i className="bi bi-eye" /></a>
                        <Link href={`/admin/products/${p.id}`} className="btn btn-sm btn-light border btn-icon me-1" title="Edit"><i className="bi bi-pencil" /></Link>
                        <DeleteButton action={deleteProduct} id={p.id} />
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
