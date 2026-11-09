"use client";

import { useRef, useState } from "react";

/** Upload or URL input with a live preview. Field names match the server actions: imageFile, imageUrl, imageUrl_remove. */
export default function ImageInput({
  defaultValue,
  name = "imageUrl",
  fileName = "imageFile",
  dark = false,
  contain = false,
  hint = "PNG, JPG, WEBP or SVG · max 4 MB",
}: {
  defaultValue: string;
  name?: string;
  fileName?: string;
  dark?: boolean;
  contain?: boolean;
  hint?: string;
}) {
  const [url, setUrl] = useState(defaultValue);
  const [preview, setPreview] = useState(defaultValue);
  const [chosen, setChosen] = useState("");
  const [removed, setRemoved] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const onFile = (f?: File) => {
    if (!f) return;
    setChosen(f.name);
    setRemoved(false);
    setPreview(URL.createObjectURL(f));
  };

  const clear = () => {
    if (fileRef.current) fileRef.current.value = "";
    setChosen("");
    setUrl("");
    setPreview("");
    setRemoved(true);
  };

  return (
    <div>
      <div className="image-drop">
        <div className="preview" style={{ ...(dark ? { background: "var(--navy)" } : {}), ...(contain ? { width: 200, padding: 10 } : {}) }}>
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="" style={contain ? { objectFit: "contain" } : undefined} />
          ) : (
            <i className="bi bi-image" />
          )}
        </div>
        <div className="flex-grow-1 min-w-0">
          <div className="d-flex gap-2 flex-wrap mb-2">
            <button type="button" className="btn btn-sm btn-outline-brand" onClick={() => fileRef.current?.click()}>
              <i className="bi bi-upload me-1" /> {preview ? "Replace" : "Upload image"}
            </button>
            {preview && (
              <button type="button" className="btn btn-sm btn-light border text-danger" onClick={clear}>
                <i className="bi bi-trash3 me-1" /> Remove
              </button>
            )}
          </div>
          <div className="small text-muted-2 text-truncate">{chosen || hint}</div>
          <input
            ref={fileRef} type="file" name={fileName} className="d-none"
            accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
            onChange={(e) => onFile(e.target.files?.[0])}
          />
        </div>
      </div>
      <input
        name={name} className="form-control form-control-sm mt-2" value={url} placeholder="…or paste an image URL"
        onChange={(e) => { setUrl(e.target.value); setPreview(e.target.value); setRemoved(false); }}
      />
      {removed && <input type="hidden" name={`${name}_remove`} value="on" />}
    </div>
  );
}
