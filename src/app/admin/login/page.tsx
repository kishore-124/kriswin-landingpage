import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getSettings } from "@/lib/data";
import BrandLogo from "@/components/BrandLogo";
import LoginForm from "./LoginForm";

export const metadata: Metadata = { title: "Admin Login", robots: { index: false } };

export default async function LoginPage() {
  if (await getSession()) redirect("/admin");
  const s = await getSettings();
  return (
    <div className="login-split">
      <div className="login-art">
        <a href="/" className="d-flex align-items-center gap-2 text-decoration-none"><BrandLogo companyName={s.companyName} src={s.logoLightUrl} height={50} /></a>
        <div>
          <h2 className="mb-4">Manage your website<br />in one place.</h2>
          <ul className="list-unstyled mb-0">
            <li><i className="bi bi-pencil-square" />Edit pages, services and products</li>
            <li><i className="bi bi-journal-richtext" />Publish case studies and testimonials</li>
            <li><i className="bi bi-inbox" />Read and reply to enquiries</li>
            <li><i className="bi bi-palette" />Change brand colours instantly</li>
          </ul>
        </div>
        <small className="text-white-50">© {new Date().getFullYear()} {s.companyName}</small>
      </div>
      <div className="login-form-side">
        <div className="login-box">
          <div className="d-lg-none mb-4 d-flex align-items-center gap-2"><BrandLogo companyName={s.companyName} src={s.logoUrl} height={42} /></div>
          <h1 className="h3 fw-bold mb-1">Welcome back</h1>
          <p className="text-muted-2 mb-4">Sign in to the admin panel</p>
          <LoginForm />
          <div className="mt-4 pt-3 border-top">
            <a href="/" className="small text-muted-2 text-decoration-none"><i className="bi bi-arrow-left me-1" />Back to website</a>
          </div>
        </div>
      </div>
    </div>
  );
}
