"use client";

/** A small form that asks for confirmation before calling a delete server action. */
export default function DeleteButton({
  action,
  id,
  label = "",
  confirmText = "Delete this item? This cannot be undone.",
}: {
  action: (fd: FormData) => Promise<void>;
  id: number;
  label?: string;
  confirmText?: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm(confirmText)) e.preventDefault();
      }}
      className="d-inline"
    >
      <input type="hidden" name="id" value={id} />
      <button className="btn btn-sm btn-light border text-danger btn-icon" title="Delete">
        <i className="bi bi-trash3" />{label && <span className="ms-1">{label}</span>}
      </button>
    </form>
  );
}

/** Delete button placed inside an existing form (submits that form to the delete action). */
export function DeleteSubmit({ action }: { action: (fd: FormData) => Promise<void> }) {
  return (
    <button
      formAction={action}
      formNoValidate
      className="btn btn-sm btn-outline-danger"
      onClick={(e) => {
        if (!confirm("Delete this item? This cannot be undone.")) e.preventDefault();
      }}
    >
      <i className="bi bi-trash3 me-1" />Delete
    </button>
  );
}
