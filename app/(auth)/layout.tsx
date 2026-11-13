export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Auth screens are always light, regardless of the OS colour scheme
  // (the root `:root` tokens are light — this makes the surface explicit).
  return (
    <div className="min-h-screen bg-white text-neutral-900">{children}</div>
  );
}
