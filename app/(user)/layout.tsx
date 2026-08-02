import AuthGuard from "@/components/auth/AuthGuard";
import Layout from "@/components/User/Layout/cmsfullform/layout";
import  "./user.css"
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
