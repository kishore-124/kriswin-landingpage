"use client";

import { useActionState, useState } from "react";
import { login, type LoginState } from "../actions";

export default function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, null);
  const [show, setShow] = useState(false);
  return (
    <form action={action}>
      {state?.error && (
        <div className="alert alert-danger py-2 small d-flex gap-2 align-items-center"><i className="bi bi-exclamation-circle-fill" />{state.error}</div>
      )}
      <div className="mb-3">
        <label className="form-label" htmlFor="email">Email address</label>
        <input id="email" name="email" type="email" className="form-control" required autoComplete="username" autoFocus placeholder="you@company.com" />
      </div>
      <div className="mb-4">
        <label className="form-label" htmlFor="password">Password</label>
        <div className="input-group">
          <input id="password" name="password" type={show ? "text" : "password"} className="form-control" required autoComplete="current-password" placeholder="••••••••" />
          <button type="button" className="btn btn-light border" onClick={() => setShow((v) => !v)} aria-label={show ? "Hide password" : "Show password"}>
            <i className={`bi ${show ? "bi-eye-slash" : "bi-eye"}`} />
          </button>
        </div>
      </div>
      <button className="btn btn-brand w-100 btn-lg" disabled={pending}>
        {pending ? <><span className="spinner-border spinner-border-sm me-2" />Signing in…</> : <>Sign in <i className="bi bi-arrow-right ms-1" /></>}
      </button>
    </form>
  );
}
