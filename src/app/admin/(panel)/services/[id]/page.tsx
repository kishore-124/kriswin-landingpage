import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Area, IconField, Section, Text } from "@/components/admin/Fields";
import { EditorLayout, PageTitle } from "@/components/admin/ui";
import { deleteService, saveService } from "../../../actions";

type Props = { params: Promise<{ id: string }> };

export default async function ServiceEdit({ params }: Props) {
  const { id } = await params;
  const isNew = id === "new";
  const item = isNew ? null : await prisma.service.findUnique({ where: { id: Number(id) || 0 } });
  if (!isNew && !item) notFound();

  return (
    <>
      <PageTitle title={isNew ? "Add service" : item!.title} subtitle={isNew ? "Describe a service you offer." : "Edit this service"} back={{ href: "/admin/services", label: "Services" }} />
      <EditorLayout
        action={saveService} id={item?.id} backHref="/admin/services" viewHref={item ? `/services/${item.slug}` : undefined}
        published={item?.published ?? true} sortOrder={item?.sortOrder ?? 0} deleteAction={deleteService}
      >
        <Section title="Basic information" desc="Shown on service cards and in the menu.">
          <Text name="title" label="Title" defaultValue={item?.title} required placeholder="e.g. Mobile App Development" />
          <IconField defaultValue={item?.icon ?? "bi-code-slash"} />
          <Text name="slug" label="URL slug" defaultValue={item?.slug} col="col-md-6" prefix="/services/" help="Leave empty to generate from the title." />
          <Area name="summary" label="Short summary" defaultValue={item?.summary} rows={2} required help="One or two sentences." />
        </Section>
        <Section title="Service page" desc="Content of the service detail page.">
          <Area name="description" label="Full description" defaultValue={item?.description} rows={6} help="Separate paragraphs with a blank line." />
          <Area name="features" label="What's included" defaultValue={item?.features} rows={6} help="One feature per line." />
        </Section>
      </EditorLayout>
    </>
  );
}
