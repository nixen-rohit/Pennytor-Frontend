import Navbar from "@/components/Navbar/Navbar";
import WhatsAppFloatingButton from "@/components/custom/WhatsAppFloatingButton";
import Footer from "@/components/Footer/index";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <WhatsAppFloatingButton />
      {children}
      <Footer />
    </>
  );
}
