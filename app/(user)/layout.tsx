"use client";

import AuthGuard from "@/components/auth/AuthGuard";
import Layout from "@/components/Layout/cmsfullform/layout";
import { menuData } from "@/components/User/Layout/sidebarData";
import { userTopbar } from "@/components/User/Layout/topbarData";
import "./user.css"

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthGuard>
      <div className="app-dark">
        <Layout menuData={menuData} topbar={userTopbar}>{children}</Layout>
      </div>
    </AuthGuard>
  );
}