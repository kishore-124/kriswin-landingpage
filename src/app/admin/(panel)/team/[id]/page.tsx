import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Area, ImageField, Section, Text } from "@/components/admin/Fields";
import { EditorLayout, PageTitle } from "@/components/admin/ui";
import { deleteTeamMember, saveTeamMember } from "../../../actions";

type Props = { params: Promise<{ id: string }> };

export default async function TeamEdit({ params }: Props) {
  const { id } = await params;
  const isNew = id === "new";
  const item = isNew ? null : await prisma.teamMember.findUnique({ where: { id: Number(id) || 0 } });
  if (!isNew && !item) notFound();

  return (
    <>
      <PageTitle title={isNew ? "Add team member" : item!.name} subtitle={isNew ? undefined : item!.role} back={{ href: "/admin/team", label: "Team" }} />
      <EditorLayout
        action={saveTeamMember} id={item?.id} backHref="/admin/team" viewHref={item ? "/about" : undefined}
        published={item?.published ?? true} sortOrder={item?.sortOrder ?? 0} deleteAction={deleteTeamMember}
      >
        <Section title="Profile">
          <Text name="name" label="Name" defaultValue={item?.name} col="col-md-6" required />
          <Text name="role" label="Role / designation" defaultValue={item?.role} col="col-md-6" required />
          <Area name="bio" label="Short bio" defaultValue={item?.bio} rows={3} />
          <Text name="linkedin" label="LinkedIn URL" defaultValue={item?.linkedin} prefix={<i className="bi bi-linkedin" />} />
        </Section>
        <Section title="Photo" desc="Optional — initials are shown when there is no photo.">
          <ImageField defaultValue={item?.imageUrl} label="Profile photo" />
        </Section>
      </EditorLayout>
    </>
  );
}
