import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Area, Section, Text } from "@/components/admin/Fields";
import { EditorLayout, PageTitle } from "@/components/admin/ui";
import { deleteTestimonial, saveTestimonial } from "../../../actions";

type Props = { params: Promise<{ id: string }> };

export default async function TestimonialEdit({ params }: Props) {
  const { id } = await params;
  const isNew = id === "new";
  const item = isNew ? null : await prisma.testimonial.findUnique({ where: { id: Number(id) || 0 } });
  if (!isNew && !item) notFound();

  return (
    <>
      <PageTitle title={isNew ? "Add testimonial" : `Review by ${item!.name}`} back={{ href: "/admin/testimonials", label: "Testimonials" }} />
      <EditorLayout
        action={saveTestimonial} id={item?.id} backHref="/admin/testimonials" viewHref={item ? "/" : undefined}
        published={item?.published ?? true} sortOrder={item?.sortOrder ?? 0} deleteAction={deleteTestimonial}
      >
        <Section title="Review">
          <Text name="name" label="Client name" defaultValue={item?.name} col="col-md-6" required />
          <Text name="company" label="Company / designation" defaultValue={item?.company} col="col-md-6" />
          <Area name="quote" label="What they said" defaultValue={item?.quote} rows={5} required />
          <div className="col-md-6">
            <label className="form-label" htmlFor="rating">Rating</label>
            <select id="rating" name="rating" className="form-select" defaultValue={item?.rating ?? 5}>
              {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{"★".repeat(r)}{"☆".repeat(5 - r)}  ({r}/5)</option>)}
            </select>
          </div>
        </Section>
      </EditorLayout>
    </>
  );
}
