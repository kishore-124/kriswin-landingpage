import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Area, IconField, ImageField, Section, Text } from "@/components/admin/Fields";
import { EditorLayout, PageTitle } from "@/components/admin/ui";
import { deleteProduct, saveProduct } from "../../../actions";

type Props = { params: Promise<{ id: string }> };

export default async function ProductEdit({ params }: Props) {
  const { id } = await params;
  const isNew = id === "new";
  const item = isNew ? null : await prisma.product.findUnique({ where: { id: Number(id) || 0 } });
  if (!isNew && !item) notFound();

  return (
    <>
      <PageTitle title={isNew ? "Add product" : item!.name} subtitle={isNew ? "Showcase a product you sell." : "Edit this product"} back={{ href: "/admin/products", label: "Products" }} />
      <EditorLayout
        action={saveProduct} id={item?.id} backHref="/admin/products" viewHref={item ? `/products/${item.slug}` : undefined}
        published={item?.published ?? true} sortOrder={item?.sortOrder ?? 0} deleteAction={deleteProduct}
        aside={
          <div className="admin-card">
            <div className="card-head"><h3>Cover</h3></div>
            <div className="card-body-pad d-grid gap-3">
              <IconField defaultValue={item?.icon ?? "bi-box-seam"} col="" />
              <ImageField defaultValue={item?.imageUrl} label="Image (optional — replaces the icon)" col="" />
            </div>
          </div>
        }
      >
        <Section title="Basic information">
          <Text name="name" label="Product name" defaultValue={item?.name} col="col-md-6" required />
          <Text name="slug" label="URL slug" defaultValue={item?.slug} col="col-md-6" prefix="/products/" help="Leave empty to generate from the name." />
          <Text name="tagline" label="Tagline" defaultValue={item?.tagline} required placeholder="One line that explains the product" />
          <Text name="websiteUrl" label="Product website" defaultValue={item?.websiteUrl} col="col-md-6" placeholder="https://easybillo.in" prefix={<i className="bi bi-link-45deg" />} />
          <Text name="priceLabel" label="Price label" defaultValue={item?.priceLabel} col="col-md-3" placeholder="₹499/month" />
          <Text name="badge" label="Badge" defaultValue={item?.badge} col="col-md-3" placeholder="New" />
        </Section>
        <Section title="Product page">
          <Area name="description" label="Description" defaultValue={item?.description} rows={6} help="Separate paragraphs with a blank line." />
          <Area name="features" label="Key features" defaultValue={item?.features} rows={6} help="One feature per line." />
        </Section>
      </EditorLayout>
    </>
  );
}
