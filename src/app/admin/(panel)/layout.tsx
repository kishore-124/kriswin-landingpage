import type { Metadata } from "next";
import AdminFrame from "@/components/admin/AdminFrame";
import { requireAdmin } from "@/lib/auth";
import { getSettings } from "@/lib/data";
import { prisma } from "@/lib/prisma";
import { logout } from "../actions";

export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin();
  const [s, unread] = await Promise.all([getSettings(), prisma.contactMessage.count({ where: { isRead: false } })]);

  return (
    <div className="admin-body">
      <AdminFrame companyName={s.companyName} logoUrl={s.logoUrl} unread={unread} user={{ name: session.name, email: session.email }} logout={logout}>
        {children}
      </AdminFrame>
    </div>
  );
}
