import "server-only";
import { cache } from "react";
import { prisma } from "./prisma";

export const getSettings = cache(async () => {
  const settings = await prisma.siteSetting.findUnique({ where: { id: 1 } });
  return settings ?? (await prisma.siteSetting.create({ data: { id: 1 } }));
});

export const getServices = cache(() =>
  prisma.service.findMany({ where: { published: true }, orderBy: [{ sortOrder: "asc" }, { id: "asc" }] })
);

export const getProducts = cache(() =>
  prisma.product.findMany({ where: { published: true }, orderBy: [{ sortOrder: "asc" }, { id: "asc" }] })
);

export const getTeam = cache(() =>
  prisma.teamMember.findMany({ where: { published: true }, orderBy: [{ sortOrder: "asc" }, { id: "asc" }] })
);

export const getTestimonials = cache(() =>
  prisma.testimonial.findMany({ where: { published: true }, orderBy: [{ sortOrder: "asc" }, { id: "asc" }] })
);

export const getCaseStudies = cache(() =>
  prisma.caseStudy.findMany({ where: { published: true }, orderBy: [{ sortOrder: "asc" }, { id: "asc" }] })
);
