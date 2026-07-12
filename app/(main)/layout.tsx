import Navbar from "@/layout/Navbar";
import WhatsAppFloatingButton from "@/components/custom/WhatsAppFloatingButton";


export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
    
    <Navbar />
     <WhatsAppFloatingButton/>
      {children}
    </>
  );
}
