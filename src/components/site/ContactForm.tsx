"use client";

import { useActionState, useEffect, useRef } from "react";
import { submitContact, type ContactState } from "@/lib/contact-actions";

export default function ContactForm({
  services,
  title = "Send us a message",
  subtitle = "We usually reply within one business day.",
}: {
  services: string[];
  title?: string;
  subtitle?: string;
}) {
  const [state, action, pending] = useActionState<ContactState, FormData>(submitContact, null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.ok) formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={action} className="form-card">
      <h2 className="h3 mb-1">{title}</h2>
      <p className="text-muted-2 mb-4">{subtitle}</p>

      {state && (
        <div className={`alert ${state.ok ? "alert-success" : "alert-danger"} d-flex gap-2 align-items-start`} role="alert">
          <i className={`bi ${state.ok ? "bi-check-circle-fill" : "bi-exclamation-triangle-fill"}`} />
          <div>{state.message}</div>
        </div>
      )}

      {/* honeypot */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="d-none" aria-hidden="true" />

      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label" htmlFor="name">Full name *</label>
          <input id="name" name="name" className="form-control" required maxLength={120} placeholder="Your name" />
        </div>
        <div className="col-md-6">
          <label className="form-label" htmlFor="email">Email *</label>
          <input id="email" name="email" type="email" className="form-control" required placeholder="you@company.com" />
        </div>
        <div className="col-md-6">
          <label className="form-label" htmlFor="phone">Phone</label>
          <input id="phone" name="phone" className="form-control" maxLength={40} placeholder="+91 ..." />
        </div>
        <div className="col-md-6">
          <label className="form-label" htmlFor="subject">I&apos;m interested in</label>
          <select id="subject" name="subject" className="form-select" defaultValue="">
            <option value="">Select a service</option>
            {services.map((s) => <option key={s}>{s}</option>)}
            <option>Our products</option>
            <option>Something else</option>
          </select>
        </div>
        <div className="col-12">
          <label className="form-label" htmlFor="message">Message *</label>
          <textarea id="message" name="message" className="form-control" rows={5} required maxLength={5000} placeholder="Tell us about your project..." />
        </div>
        <div className="col-12">
          <button className="btn btn-brand btn-lg w-100" disabled={pending}>
            {pending ? (
              <><span className="spinner-border spinner-border-sm me-2" /> Sending...</>
            ) : (
              <>Send Message <i className="bi bi-send ms-1" /></>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
