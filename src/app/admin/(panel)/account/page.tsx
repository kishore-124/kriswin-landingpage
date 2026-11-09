import { requireAdmin } from "@/lib/auth";
import { initials } from "@/lib/utils";
import { PageTitle } from "@/components/admin/ui";
import AccountForm from "./AccountForm";

export default async function AccountPage() {
  const session = await requireAdmin();
  return (
    <>
      <PageTitle title="My Account" subtitle="Update your profile, login email and password." />
      <div className="row g-4">
        <div className="col-lg-4">
          <div className="admin-card card-body-pad text-center">
            <span className="avatar mx-auto mb-3" style={{ width: 80, height: 80, fontSize: "1.6rem" }}>{initials(session.name || session.email)}</span>
            <h2 className="h5 mb-1">{session.name || "Administrator"}</h2>
            <div className="text-muted-2 small mb-3">{session.email}</div>
            <span className="badge rounded-pill bg-brand-soft text-brand px-3 py-2"><i className="bi bi-shield-check me-1" />Administrator</span>
          </div>
          <div className="admin-card card-body-pad mt-3 small text-muted-2">
            <div className="fw-bold text-dark mb-2"><i className="bi bi-lightbulb me-1 text-accent" />Password tips</div>
            Use at least 8 characters with a mix of letters, numbers and symbols. Don&apos;t reuse a password from another site.
          </div>
        </div>
        <div className="col-lg-8">
          <AccountForm name={session.name} email={session.email} />
        </div>
      </div>
    </>
  );
}
