"use client";

import AdminGuard from "@/components/auth/AdminGuard";
import Layout from "@/components/Layout/cmsfullform/layout";
import { adminNav } from "@/components/admin/Layout/sidebarData";
import { adminTopbar } from "@/components/admin/Layout/topbarData";

export default function AdminRouteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AdminGuard>
      <Layout menuData={adminNav} topbar={adminTopbar}>
        {children}
      </Layout>
    </AdminGuard>
  );
}