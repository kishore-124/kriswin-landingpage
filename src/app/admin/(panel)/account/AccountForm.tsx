"use client";

import { useActionState, useState } from "react";
import { changePassword, type PasswordState } from "../../actions";

function strength(p: string) {
  let s = 0;
  if (p.length >= 8) s++;
  if (p.length >= 12) s++;
  if (/[A-Z]/.test(p) && /[a-z]/.test(p)) s++;
  if (/\d/.test(p)) s++;
  if (/[^A-Za-z0-9]/.test(p)) s++;
  return Math.min(s, 4);
}

export default function AccountForm({ name, email }: { name: string; email: string }) {
  const [state, action, pending] = useActionState<PasswordState, FormData>(changePassword, null);
  const [pw, setPw] = useState("");
  const [show, setShow] = useState(false);
  const st = strength(pw);
  const meta = [
    ["Too short", "#dc2626"],
    ["Weak", "#ea580c"],
    ["Fair", "#ca8a04"],
    ["Good", "#16a34a"],
    ["Strong", "#15803d"],
  ][st];

  return (
    <form action={action} className="d-grid gap-3">
      {state?.ok && <div className="alert alert-success mb-0"><i className="bi bi-check-circle-fill me-2" />Account updated successfully.</div>}
      {state?.error && <div className="alert alert-danger mb-0"><i className="bi bi-exclamation-triangle-fill me-2" />{state.error}</div>}

      <div className="admin-card">
        <div className="card-head"><div><h3>Profile</h3><p>Your name and the email you log in with.</p></div></div>
        <div className="card-body-pad"><div className="row g-3">
          <div className="col-md-6">
            <label className="form-label" htmlFor="name">Name</label>
            <input id="name" name="name" className="form-control" defaultValue={name} />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="email">Login email</label>
            <input id="email" name="email" type="email" className="form-control" defaultValue={email} required />
          </div>
        </div></div>
      </div>

      <div className="admin-card">
        <div className="card-head"><div><h3>Change password</h3><p>Leave blank to keep your current password.</p></div></div>
        <div className="card-body-pad"><div className="row g-3">
          <div className="col-md-6">
            <label className="form-label" htmlFor="next">New password</label>
            <div className="input-group">
              <input id="next" name="next" type={show ? "text" : "password"} className="form-control" minLength={8} autoComplete="new-password" value={pw} onChange={(e) => setPw(e.target.value)} />
              <button type="button" className="btn btn-light border" onClick={() => setShow((v) => !v)} aria-label="Show password"><i className={`bi ${show ? "bi-eye-slash" : "bi-eye"}`} /></button>
            </div>
            {pw && (
              <div className="mt-2">
                <div className="progress-thin"><div style={{ width: `${(st + 1) * 20}%`, background: meta[1] }} /></div>
                <small style={{ color: meta[1] }} className="fw-semibold">{meta[0]}</small>
              </div>
            )}
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="confirm">Confirm new password</label>
            <input id="confirm" name="confirm" type={show ? "text" : "password"} className="form-control" autoComplete="new-password" />
          </div>
        </div></div>
      </div>

      <div className="admin-card">
        <div className="card-body-pad d-flex flex-column flex-md-row gap-3 align-items-md-end">
          <div className="flex-grow-1">
            <label className="form-label" htmlFor="current">Current password <span className="text-danger">*</span></label>
            <input id="current" name="current" type="password" className="form-control" required autoComplete="current-password" />
            <div className="form-text">Required to confirm any change.</div>
          </div>
          <button className="btn btn-brand" disabled={pending}>
            {pending ? <><span className="spinner-border spinner-border-sm me-2" />Saving…</> : <><i className="bi bi-check2 me-1" />Update account</>}
          </button>
        </div>
      </div>
    </form>
  );
}
