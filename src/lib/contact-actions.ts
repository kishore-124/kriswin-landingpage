"use server";

import { prisma } from "@/lib/prisma";

export type ContactState = { ok: boolean; message: string } | null;

const str = (fd: FormData, k: string, max: number) => String(fd.get(k) ?? "").trim().slice(0, max);

export async function submitContact(_prev: ContactState, fd: FormData): Promise<ContactState> {
  // Honeypot field: bots fill it, humans never see it
  if (str(fd, "website", 200)) return { ok: true, message: "Thanks! We'll be in touch soon." };

  const name = str(fd, "name", 120);
  const email = str(fd, "email", 200);
  const phone = str(fd, "phone", 40);
  const subject = str(fd, "subject", 200);
  const message = str(fd, "message", 5000);

  if (!name || !email || !message) return { ok: false, message: "Please fill in your name, email and message." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false, message: "Please enter a valid email address." };

  await prisma.contactMessage.create({ data: { name, email, phone, subject, message } });
  return { ok: true, message: "Thank you! Your message has been sent. Our team will get back to you within 24 hours." };
}
