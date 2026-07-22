import AuthGuard from "@/components/auth/AuthGuard";
import Layout from "@/components/User/Layout/cmsfullform/layout";
export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthGuard>
      {" "}
      <Layout>{children}</Layout>
    </AuthGuard>
  );
}
