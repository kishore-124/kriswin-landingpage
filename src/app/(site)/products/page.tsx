import type { Metadata } from "next";
import { getProducts, getSettings } from "@/lib/data";
import PageHeader from "@/components/site/PageHeader";
import CtaBanner from "@/components/site/CtaBanner";
import { ProductCard } from "@/components/site/Cards";

export const metadata: Metadata = { title: "Products" };

export default async function ProductsPage() {
  const [s, products] = await Promise.all([getSettings(), getProducts()]);
  return (
    <>
      <PageHeader
        title="Our Products"
        subtitle="Ready-to-use software built by our team to solve everyday business problems."
        crumbs={[{ label: "Products" }]}
      />
      <section className="section">
        <div className="container">
          <div className="row g-4 row-cols-1 row-cols-md-2 row-cols-lg-3">
            {products.map((p) => (
              <div className="col reveal" key={p.id}>
                <ProductCard p={p} maxFeatures={5} />
              </div>
            ))}
          </div>
          {products.length === 0 && <p className="text-center text-muted-2">Products will be listed here soon.</p>}
        </div>
      </section>
      <CtaBanner s={s} />
      <div className="pb-5" />
    </>
  );
}
