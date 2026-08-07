import ContactForm from "@/components/ContactUs/ContactForm";
import GoogleMapsSection from "@/components/ContactUs/GoogleMapsSection";

const page = () => {
  return (
    <div className=" bg-linear-to-tr from-[#f3f8fa] via-[#fffdf9] to-[#fffbf2] ">
      <ContactForm />
      <GoogleMapsSection />
    </div>
  );
};

export default page;