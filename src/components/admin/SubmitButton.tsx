"use client";

import { useFormStatus } from "react-dom";

export default function SubmitButton({ label = "Save", className = "btn btn-brand" }: { label?: string; className?: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className={className} disabled={pending}>
      {pending ? <><span className="spinner-border spinner-border-sm me-2" />Saving...</> : <><i className="bi bi-check2 me-1" />{label}</>}
    </button>
  );
}
