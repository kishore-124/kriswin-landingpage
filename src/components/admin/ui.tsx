import Link from "next/link";
import SubmitButton from "./SubmitButton";
import { DeleteSubmit } from "./DeleteButton";
import { SwitchRow } from "./Fields";

export function PageTitle({
  title, subtitle, back, actions,
}: { title: string; subtitle?: string; back?: { href: string; label: string }; actions?: React.ReactNode }) {
  return (
    <div className="page-title">
      <div>
        {back && <Link href={back.href} className="back-link"><i className="bi bi-arrow-left" /> {back.label}</Link>}
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {actions && <div className="d-flex gap-2 flex-wrap">{actions}</div>}
    </div>
  );
}

export function EmptyState({ icon, title, text, href, cta }: { icon: string; title: string; text: string; href?: string; cta?: string }) {
  return (
    <div className="empty">
      <div className="ic"><i className={`bi ${icon}`} /></div>
      <h3>{title}</h3>
      <p className="mb-3">{text}</p>
      {href && cta && <Link href={href} className="btn btn-brand btn-sm"><i className="bi bi-plus-lg me-1" />{cta}</Link>}
    </div>
  );
}

/**
 * Two-column editor: main fields on the left, a sticky "Publish" panel on the right.
 * Everything lives in one <form>; the delete button submits the same form to the delete action.
 */
export function EditorLayout({
  action, id, backHref, viewHref, published, featured, featuredLabel, sortOrder, deleteAction, children, aside,
}: {
  action: (fd: FormData) => Promise<void>;
  id?: number;
  backHref: string;
  viewHref?: string;
  published: boolean;
  featured?: boolean;
  featuredLabel?: string;
  sortOrder: number;
  deleteAction?: (fd: FormData) => Promise<void>;
  children: React.ReactNode;
  aside?: React.ReactNode;
}) {
  return (
    <form action={action}>
      {id && <input type="hidden" name="id" value={id} />}
      <div className="row g-4">
        <div className="col-xl-8 col-lg-7 order-2 order-lg-1">{children}</div>
        <div className="col-xl-4 col-lg-5 order-1 order-lg-2">
          <div className="aside-sticky d-grid gap-3">
            <div className="admin-card">
              <div className="card-head">
                <h3>Publish</h3>
                {viewHref && id && <a href={viewHref} target="_blank" rel="noopener" className="small fw-semibold text-decoration-none">View live <i className="bi bi-box-arrow-up-right" /></a>}
              </div>
              <div className="card-body-pad">
                <SwitchRow name="published" label="Visible on website" hint="Turn off to hide without deleting" defaultChecked={published} />
                {featured !== undefined && <SwitchRow name="featured" label={featuredLabel || "Featured"} hint="Show on the Home page" defaultChecked={featured} />}
                <div className="publish-row">
                  <span className="label">Display order<small>Lower numbers appear first</small></span>
                  <input type="number" name="sortOrder" defaultValue={sortOrder} className="form-control form-control-sm text-center" style={{ width: 80 }} />
                </div>
                <div className="d-grid gap-2 mt-3">
                  <SubmitButton label={id ? "Save changes" : "Create"} className="btn btn-brand" />
                  <Link href={backHref} className="btn btn-light border">Cancel</Link>
                </div>
              </div>
            </div>
            {aside}
            {id && deleteAction && (
              <div className="admin-card card-body-pad d-flex justify-content-between align-items-center gap-2">
                <div><div className="fw-bold text-dark small">Danger zone</div><div className="small text-muted-2">Permanently delete this item</div></div>
                <DeleteSubmit action={deleteAction} />
              </div>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}
