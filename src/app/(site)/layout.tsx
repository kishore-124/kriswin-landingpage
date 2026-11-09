import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import { getProducts, getServices, getSettings } from "@/lib/data";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [s, services, products] = await Promise.all([getSettings(), getServices(), getProducts()]);
  const wa = s.whatsapp.replace(/\D/g, "");
  return (
    <>
      <Navbar
        companyName={s.companyName}
        logoUrl={s.logoUrl}
        email={s.email}
        phone={s.phone}
        services={services.map(({ title, slug, icon, summary }) => ({ title, slug, icon, summary }))}
        products={products.map(({ name, slug, icon, tagline }) => ({ name, slug, icon, tagline }))}
      />
      <main>{children}</main>
      <Footer s={s} services={services} products={products} />
      {wa && (
        <a className="whatsapp-fab" href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp">
          <i className="bi bi-whatsapp" />
        </a>
      )}
    </>
  );
}
