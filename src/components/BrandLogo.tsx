import { splitCompanyName } from "@/lib/utils";

/**
 * Company logo. Uses the logo image set in Admin → Settings; falls back to a text
 * logo (initial + name) when no image is configured.
 */
export default function BrandLogo({
  companyName,
  src,
  height = 40,
  className = "",
}: {
  companyName: string;
  src?: string | null;
  height?: number;
  className?: string;
}) {
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={companyName} height={height} className={`brand-logo ${className}`} style={{ height, width: "auto" }} />
    );
  }
  const { name, suffix } = splitCompanyName(companyName);
  return (
    <>
      <span className="brand-mark">{name.charAt(0)}</span>
      <span>
        <span className="brand-name">{name}</span>
        {suffix && <span className="brand-sub">{suffix}</span>}
      </span>
    </>
  );
}
