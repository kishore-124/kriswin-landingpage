import type { Metadata } from "next";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.min.css";
import "@fontsource-variable/plus-jakarta-sans";
import "./globals.css";
import BootstrapClient from "@/components/BootstrapClient";
import { getSettings } from "@/lib/data";
import { colorOr } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return {
    metadataBase: new URL(process.env.SITE_URL || "https://kriswin-infotech.com"),
    title: { default: `${s.companyName} — ${s.tagline}`, template: `%s | ${s.companyName}` },
    description: s.metaDescription || s.tagline,
    openGraph: { siteName: s.companyName, type: "website", images: ["/brand/og-image.png"] },
    twitter: { card: "summary_large_image", images: ["/brand/og-image.png"] },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const s = await getSettings();
  const brandStyle = {
    "--brand": colorOr(s.primaryColor, "#0085B1"),
    "--accent": colorOr(s.accentColor, "#5DB823"),
  } as React.CSSProperties;
  return (
    <html lang="en" style={brandStyle}>
      <body>
        {children}
        <BootstrapClient />
      </body>
    </html>
  );
}
