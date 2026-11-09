import Toast from "./Toast";
import IconPicker from "./IconPicker";
import ImageInput from "./ImageInput";

type Base = { name: string; label: string; help?: React.ReactNode; col?: string; required?: boolean };

export function Text({
  name, label, help, col = "col-12", required, defaultValue, type = "text", placeholder, prefix,
}: Base & { defaultValue?: string | number | null; type?: string; placeholder?: string; prefix?: React.ReactNode }) {
  const input = (
    <input id={name} name={name} type={type} className="form-control" defaultValue={defaultValue ?? ""} required={required} placeholder={placeholder} />
  );
  return (
    <div className={col}>
      <label className="form-label" htmlFor={name}>{label}{required && <span className="text-danger"> *</span>}</label>
      {prefix ? <div className="input-group"><span className="input-group-text bg-white text-muted-2">{prefix}</span>{input}</div> : input}
      {help && <div className="form-text field-hint">{help}</div>}
    </div>
  );
}

export function Area({
  name, label, help, col = "col-12", required, defaultValue, rows = 4, placeholder, mono,
}: Base & { defaultValue?: string | null; rows?: number; placeholder?: string; mono?: boolean }) {
  return (
    <div className={col}>
      <label className="form-label" htmlFor={name}>{label}{required && <span className="text-danger"> *</span>}</label>
      <textarea
        id={name} name={name} className="form-control" rows={rows} defaultValue={defaultValue ?? ""} required={required} placeholder={placeholder}
        style={mono ? { fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: ".85rem" } : undefined}
      />
      {help && <div className="form-text field-hint">{help}</div>}
    </div>
  );
}

/** A labelled switch row, used in the "Publish" side panel. */
export function SwitchRow({ name, label, hint, defaultChecked }: { name: string; label: string; hint?: string; defaultChecked?: boolean }) {
  return (
    <label className="publish-row" htmlFor={name} style={{ cursor: "pointer" }}>
      <span className="label">{label}{hint && <small>{hint}</small>}</span>
      <span className="form-check form-switch switch-sm m-0">
        <input className="form-check-input" type="checkbox" role="switch" id={name} name={name} defaultChecked={defaultChecked} />
      </span>
    </label>
  );
}

export function IconField({ defaultValue, col = "col-md-6" }: { defaultValue?: string; col?: string }) {
  return (
    <div className={col}>
      <label className="form-label" htmlFor="icon">Icon</label>
      <IconPicker name="icon" defaultValue={defaultValue ?? ""} />
      <div className="form-text">Pick one or type any <a href="https://icons.getbootstrap.com/" target="_blank" rel="noopener noreferrer">Bootstrap Icon</a> name.</div>
    </div>
  );
}

export function ImageField({ defaultValue, label = "Image", col = "col-12" }: { defaultValue?: string; label?: string; col?: string }) {
  return (
    <div className={col}>
      <label className="form-label">{label}</label>
      <ImageInput defaultValue={defaultValue ?? ""} />
    </div>
  );
}

export function Section({ title, desc, children, action }: { title: string; desc?: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="admin-card form-section">
      <div className="card-head">
        <div><h3>{title}</h3>{desc && <p>{desc}</p>}</div>
        {action}
      </div>
      <div className="card-body-pad"><div className="row g-3">{children}</div></div>
    </div>
  );
}

export function Flash({ sp }: { sp: Record<string, string | string[] | undefined> }) {
  return <Toast saved={Boolean(sp.saved)} deleted={Boolean(sp.deleted)} />;
}

export function StatusBadge({ published }: { published: boolean }) {
  return published ? (
    <span className="badge rounded-pill text-bg-success bg-opacity-10 text-success border border-success-subtle"><i className="bi bi-circle-fill me-1" style={{ fontSize: ".45rem" }} />Live</span>
  ) : (
    <span className="badge rounded-pill text-bg-light text-secondary border">Hidden</span>
  );
}
