import Link from "next/link";

export default function PageHeader({
  title,
  subtitle,
  crumbs = [],
}: {
  title: string;
  subtitle?: string;
  crumbs?: { href?: string; label: string }[];
}) {
  return (
    <header className="page-header text-center">
      <div className="container position-relative">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb mb-3">
            <li className="breadcrumb-item"><Link href="/">Home</Link></li>
            {crumbs.map((c, i) =>
              c.href ? (
                <li key={i} className="breadcrumb-item"><Link href={c.href}>{c.label}</Link></li>
              ) : (
                <li key={i} className="breadcrumb-item active" aria-current="page">{c.label}</li>
              )
            )}
          </ol>
        </nav>
        <h1 className="mb-3">{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
    </header>
  );
}
