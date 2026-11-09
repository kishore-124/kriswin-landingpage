import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Area, ImageField, Section, Text } from "@/components/admin/Fields";
import { EditorLayout, PageTitle } from "@/components/admin/ui";
import { deleteCaseStudy, saveCaseStudy } from "../../../actions";

type Props = { params: Promise<{ id: string }> };

export default async function CaseStudyEdit({ params }: Props) {
  const { id } = await params;
  const isNew = id === "new";
  const item = isNew ? null : await prisma.caseStudy.findUnique({ where: { id: Number(id) || 0 } });
  if (!isNew && !item) notFound();

  return (
    <>
      <PageTitle title={isNew ? "Add case study" : item!.title} subtitle={isNew ? "Tell the story of a project you delivered." : "Edit this case study"} back={{ href: "/admin/case-studies", label: "Case Studies" }} />
      <EditorLayout
        action={saveCaseStudy} id={item?.id} backHref="/admin/case-studies" viewHref={item ? `/portfolio/${item.slug}` : undefined}
        published={item?.published ?? true} featured={item?.featured ?? true} featuredLabel="Show on Home page"
        sortOrder={item?.sortOrder ?? 0} deleteAction={deleteCaseStudy}
        aside={
          <div className="admin-card">
            <div className="card-head"><h3>Cover image</h3></div>
            <div className="card-body-pad"><div className="row"><ImageField defaultValue={item?.imageUrl} label="Optional" /></div></div>
          </div>
        }
      >
        <Section title="Overview">
          <Text name="title" label="Title" defaultValue={item?.title} required placeholder="e.g. Building a marketplace app in 4 months" />
          <Text name="client" label="Client" defaultValue={item?.client} col="col-md-4" />
          <Text name="industry" label="Industry" defaultValue={item?.industry} col="col-md-4" placeholder="Healthcare" />
          <Text name="readTime" label="Read time" defaultValue={item?.readTime} col="col-md-4" placeholder="5 min" />
          <Area name="summary" label="Short summary" defaultValue={item?.summary} rows={2} required />
          <Text name="slug" label="URL slug" defaultValue={item?.slug} prefix="/portfolio/" help="Leave empty to generate from the title." />
        </Section>
        <Section title="The story">
          <Area name="challenge" label="The challenge" defaultValue={item?.challenge} rows={4} />
          <Area name="solution" label="Our solution" defaultValue={item?.solution} rows={4} />
          <Area name="results" label="Results" defaultValue={item?.results} rows={5} col="col-md-6" help="One result per line." />
          <Area name="techStack" label="Technologies used" defaultValue={item?.techStack} rows={5} col="col-md-6" help="Comma separated, e.g. React, Node.js, AWS" />
        </Section>
      </EditorLayout>
    </>
  );
}
