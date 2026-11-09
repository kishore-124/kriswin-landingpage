"use server";

import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createSession, destroySession, requireAdmin } from "@/lib/auth";
import { slugify } from "@/lib/utils";

/* ---------------- helpers ---------------- */
const str = (fd: FormData, k: string, max = 10000) => String(fd.get(k) ?? "").trim().slice(0, max);
const int = (fd: FormData, k: string, d = 0) => {
  const n = parseInt(String(fd.get(k) ?? ""), 10);
  return Number.isFinite(n) ? n : d;
};
const bool = (fd: FormData, k: string) => fd.get(k) === "on" || fd.get(k) === "true";

function refreshSite() {
  revalidatePath("/", "layout");
}

const UPLOAD_DIR = path.join(process.cwd(), "uploads");
const ALLOWED = new Map([
  ["image/png", ".png"],
  ["image/jpeg", ".jpg"],
  ["image/webp", ".webp"],
  ["image/gif", ".gif"],
  ["image/svg+xml", ".svg"],
]);

/** Saves an uploaded image (if any) and returns its public URL, otherwise the URL text field. */
async function imageFrom(fd: FormData, fileKey: string, urlKey: string) {
  const file = fd.get(fileKey);
  if (file instanceof File && file.size > 0) {
    const ext = ALLOWED.get(file.type);
    if (!ext) throw new Error("Only PNG, JPG, WEBP, GIF or SVG images are allowed.");
    if (file.size > 4 * 1024 * 1024) throw new Error("Image must be smaller than 4 MB.");
    await mkdir(UPLOAD_DIR, { recursive: true });
    const name = `${randomUUID()}${ext}`;
    await writeFile(path.join(UPLOAD_DIR, name), Buffer.from(await file.arrayBuffer()));
    return `/uploads/${name}`;
  }
  if (bool(fd, `${urlKey}_remove`)) return "";
  return str(fd, urlKey, 1000);
}

async function uniqueSlug(model: "service" | "product" | "caseStudy", base: string, id?: number) {
  const root = slugify(base) || model;
  let slug = root;
  for (let i = 2; ; i++) {
    const existing =
      model === "service"
        ? await prisma.service.findUnique({ where: { slug } })
        : model === "product"
          ? await prisma.product.findUnique({ where: { slug } })
          : await prisma.caseStudy.findUnique({ where: { slug } });
    if (!existing || existing.id === id) return slug;
    slug = `${root}-${i}`;
  }
}

/* ---------------- auth ---------------- */
export type LoginState = { error?: string } | null;

export async function login(_prev: LoginState, fd: FormData): Promise<LoginState> {
  const email = str(fd, "email", 200).toLowerCase();
  const password = String(fd.get("password") ?? "");
  const user = await prisma.adminUser.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return { error: "Invalid email or password." };
  }
  await createSession({ userId: user.id, email: user.email, name: user.name });
  redirect("/admin");
}

export async function logout() {
  await destroySession();
  redirect("/admin/login");
}

export type PasswordState = { ok?: boolean; error?: string } | null;

export async function changePassword(_prev: PasswordState, fd: FormData): Promise<PasswordState> {
  const session = await requireAdmin();
  const current = String(fd.get("current") ?? "");
  const next = String(fd.get("next") ?? "");
  const confirm = String(fd.get("confirm") ?? "");
  const name = str(fd, "name", 120);
  const email = str(fd, "email", 200).toLowerCase();

  const user = await prisma.adminUser.findUnique({ where: { id: session.userId } });
  if (!user || !(await bcrypt.compare(current, user.passwordHash))) return { error: "Current password is incorrect." };
  if (next && next.length < 8) return { error: "New password must be at least 8 characters." };
  if (next !== confirm) return { error: "New passwords do not match." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "Please enter a valid email." };
  if (email !== user.email && (await prisma.adminUser.findUnique({ where: { email } }))) {
    return { error: "That email is already used by another admin." };
  }

  const updated = await prisma.adminUser.update({
    where: { id: user.id },
    data: { name: name || user.name, email, ...(next ? { passwordHash: await bcrypt.hash(next, 10) } : {}) },
  });
  await createSession({ userId: updated.id, email: updated.email, name: updated.name });
  return { ok: true };
}

/* ---------------- settings ---------------- */
const SETTINGS_FIELDS = [
  "companyName", "tagline", "primaryColor", "accentColor", "email", "phone", "whatsapp", "address", "mapEmbedUrl",
  "facebook", "twitter", "linkedin", "instagram", "youtube",
  "heroBadge", "heroTitle", "heroSubtitle", "heroCtaText", "heroCta2Text",
  "statYears", "statClients", "statProjects", "statSupport",
  "aboutTitle", "aboutContent", "mission", "vision", "values", "whyUs",
  "ctaTitle", "ctaSubtitle", "footerAbout", "metaDescription",
  "trustedBy", "challenges", "technologies", "industries", "faqs", "consultPoints",
] as const;

export async function saveSettings(fd: FormData) {
  await requireAdmin();
  const data: Record<string, string> = {};
  for (const f of SETTINGS_FIELDS) if (fd.has(f)) data[f] = str(fd, f);
  if (data.companyName === "") delete data.companyName;
  // Logos: uploaded file, pasted URL, or reset to the bundled default
  data.logoUrl = (await imageFrom(fd, "logoFile", "logoUrl")) || "/brand/kriswin-logo.svg";
  data.logoLightUrl = (await imageFrom(fd, "logoLightFile", "logoLightUrl")) || "/brand/kriswin-logo-white.svg";
  await prisma.siteSetting.upsert({ where: { id: 1 }, update: data, create: { id: 1, ...data } });
  refreshSite();
  const tab = str(fd, "_tab", 30);
  redirect(`/admin/settings?saved=1${tab ? `&tab=${encodeURIComponent(tab)}` : ""}`);
}

/* ---------------- services ---------------- */
export async function saveService(fd: FormData) {
  await requireAdmin();
  const id = int(fd, "id") || undefined;
  const title = str(fd, "title", 200);
  if (!title) throw new Error("Title is required");
  const data = {
    title,
    slug: await uniqueSlug("service", str(fd, "slug", 100) || title, id),
    icon: str(fd, "icon", 60) || "bi-code-slash",
    summary: str(fd, "summary", 500),
    description: str(fd, "description"),
    features: str(fd, "features"),
    sortOrder: int(fd, "sortOrder"),
    published: bool(fd, "published"),
  };
  if (id) await prisma.service.update({ where: { id }, data });
  else await prisma.service.create({ data });
  refreshSite();
  redirect("/admin/services?saved=1");
}

export async function deleteService(fd: FormData) {
  await requireAdmin();
  await prisma.service.delete({ where: { id: int(fd, "id") } });
  refreshSite();
  redirect("/admin/services?deleted=1");
}

/* ---------------- products ---------------- */
export async function saveProduct(fd: FormData) {
  await requireAdmin();
  const id = int(fd, "id") || undefined;
  const name = str(fd, "name", 200);
  if (!name) throw new Error("Name is required");
  const data = {
    name,
    slug: await uniqueSlug("product", str(fd, "slug", 100) || name, id),
    tagline: str(fd, "tagline", 300),
    description: str(fd, "description"),
    features: str(fd, "features"),
    icon: str(fd, "icon", 60) || "bi-box-seam",
    imageUrl: await imageFrom(fd, "imageFile", "imageUrl"),
    websiteUrl: str(fd, "websiteUrl", 500),
    priceLabel: str(fd, "priceLabel", 100),
    badge: str(fd, "badge", 40),
    sortOrder: int(fd, "sortOrder"),
    published: bool(fd, "published"),
  };
  if (id) await prisma.product.update({ where: { id }, data });
  else await prisma.product.create({ data });
  refreshSite();
  redirect("/admin/products?saved=1");
}

export async function deleteProduct(fd: FormData) {
  await requireAdmin();
  await prisma.product.delete({ where: { id: int(fd, "id") } });
  refreshSite();
  redirect("/admin/products?deleted=1");
}

/* ---------------- case studies ---------------- */
export async function saveCaseStudy(fd: FormData) {
  await requireAdmin();
  const id = int(fd, "id") || undefined;
  const title = str(fd, "title", 300);
  if (!title) throw new Error("Title is required");
  const data = {
    title,
    slug: await uniqueSlug("caseStudy", str(fd, "slug", 100) || title, id),
    client: str(fd, "client", 160),
    industry: str(fd, "industry", 100),
    summary: str(fd, "summary", 600),
    challenge: str(fd, "challenge"),
    solution: str(fd, "solution"),
    results: str(fd, "results"),
    techStack: str(fd, "techStack", 500),
    readTime: str(fd, "readTime", 20),
    imageUrl: await imageFrom(fd, "imageFile", "imageUrl"),
    featured: bool(fd, "featured"),
    sortOrder: int(fd, "sortOrder"),
    published: bool(fd, "published"),
  };
  if (id) await prisma.caseStudy.update({ where: { id }, data });
  else await prisma.caseStudy.create({ data });
  refreshSite();
  redirect("/admin/case-studies?saved=1");
}

export async function deleteCaseStudy(fd: FormData) {
  await requireAdmin();
  await prisma.caseStudy.delete({ where: { id: int(fd, "id") } });
  refreshSite();
  redirect("/admin/case-studies?deleted=1");
}

/* ---------------- team ---------------- */
export async function saveTeamMember(fd: FormData) {
  await requireAdmin();
  const id = int(fd, "id") || undefined;
  const data = {
    name: str(fd, "name", 120),
    role: str(fd, "role", 120),
    bio: str(fd, "bio", 1000),
    imageUrl: await imageFrom(fd, "imageFile", "imageUrl"),
    linkedin: str(fd, "linkedin", 500),
    sortOrder: int(fd, "sortOrder"),
    published: bool(fd, "published"),
  };
  if (!data.name) throw new Error("Name is required");
  if (id) await prisma.teamMember.update({ where: { id }, data });
  else await prisma.teamMember.create({ data });
  refreshSite();
  redirect("/admin/team?saved=1");
}

export async function deleteTeamMember(fd: FormData) {
  await requireAdmin();
  await prisma.teamMember.delete({ where: { id: int(fd, "id") } });
  refreshSite();
  redirect("/admin/team?deleted=1");
}

/* ---------------- testimonials ---------------- */
export async function saveTestimonial(fd: FormData) {
  await requireAdmin();
  const id = int(fd, "id") || undefined;
  const data = {
    name: str(fd, "name", 120),
    company: str(fd, "company", 160),
    quote: str(fd, "quote", 2000),
    rating: Math.max(1, Math.min(5, int(fd, "rating", 5))),
    sortOrder: int(fd, "sortOrder"),
    published: bool(fd, "published"),
  };
  if (!data.name || !data.quote) throw new Error("Name and quote are required");
  if (id) await prisma.testimonial.update({ where: { id }, data });
  else await prisma.testimonial.create({ data });
  refreshSite();
  redirect("/admin/testimonials?saved=1");
}

export async function deleteTestimonial(fd: FormData) {
  await requireAdmin();
  await prisma.testimonial.delete({ where: { id: int(fd, "id") } });
  refreshSite();
  redirect("/admin/testimonials?deleted=1");
}

/* ---------------- messages ---------------- */
export async function toggleMessageRead(fd: FormData) {
  await requireAdmin();
  const id = int(fd, "id");
  const msg = await prisma.contactMessage.findUnique({ where: { id } });
  if (msg) await prisma.contactMessage.update({ where: { id }, data: { isRead: !msg.isRead } });
  revalidatePath("/admin", "layout");
}

export async function deleteMessage(fd: FormData) {
  await requireAdmin();
  await prisma.contactMessage.delete({ where: { id: int(fd, "id") } });
  redirect("/admin/messages?deleted=1");
}

/* ---------------- quick toggles (list pages) ---------------- */
const TOGGLABLE = {
  service: ["published"],
  product: ["published"],
  caseStudy: ["published", "featured"],
  teamMember: ["published"],
  testimonial: ["published"],
} as const;

export async function toggleFlag(fd: FormData) {
  await requireAdmin();
  const model = str(fd, "model", 30) as keyof typeof TOGGLABLE;
  const field = str(fd, "field", 30);
  const id = int(fd, "id");
  if (!(model in TOGGLABLE) || !(TOGGLABLE[model] as readonly string[]).includes(field)) throw new Error("Invalid toggle");

  // Each Prisma delegate has the same findUnique/update shape for these models
  const delegate = prisma[model] as unknown as {
    findUnique: (a: { where: { id: number } }) => Promise<Record<string, unknown> | null>;
    update: (a: { where: { id: number }; data: Record<string, boolean> }) => Promise<unknown>;
  };
  const row = await delegate.findUnique({ where: { id } });
  if (!row) return;
  await delegate.update({ where: { id }, data: { [field]: !row[field] } });
  refreshSite();
  revalidatePath("/admin", "layout");
}
