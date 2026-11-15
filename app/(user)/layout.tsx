"use client";

import AuthGuard from "@/components/auth/AuthGuard";
import Layout from "@/components/Layout/cmsfullform/layout";
import { menuData } from "@/components/User/Layout/sidebarData";
import { userTopbar } from "@/components/User/Layout/topbarData";

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthGuard>
      <Layout menuData={menuData} topbar={userTopbar}>
        {children}
      </Layout>
    </AuthGuard>
  );
}
