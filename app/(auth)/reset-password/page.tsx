import ResetPasswordPage from "@/components/auth/ResetPassword";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; email?: string }>;
}) {
  const { token, email } = await searchParams;

  return <ResetPasswordPage token={token} email={email} />;
}
