import Hero from "@/components/Home/Hero";
import Testimonials from "@/components/Home/Testimonials";
import FAQSection from "@/components/custom/FAQSection";
const faqData = [
  {
    id: 1,
    question: "Is Pennytor SEBI registered ?",
    answer:
      "Yes, we are a SEBI Registered Investment Advisor. We comply with all regulatory requirements and maintain the highest standards of transparency.",
  },
  {
    id: 2,
    question: "What is the minimum SIP amount ?",
    answer:
      "You can start SIP with just ₹500. There are no upper limits, and you can increase your investment anytime. ",
  },
  {
    id: 3,
    question: "How are returns calculated ?",
    answer:
      "Returns depend entirely on market performance. We provide real-time tracking of your portfolio, but we cannot guarantee fixed returns as markets fluctuate. ",
  },
  {
    id: 4,
    question: "Is my money safe ?",
    answer:
      "Yes, we use bank-grade AES-256 encryption, multi-factor authentication, and keep your funds in SEBI-approved custodians.",
  },
  {
    id: 5,
    question: "How do I withdraw my money ?",
    answer:
      "You can withdraw your funds anytime through the dashboard. Withdrawals are processed within 24-48 hours. ",
  },
];

const page = () => {
  return (
    <>
      <Hero />
      <Testimonials />
      <FAQSection
        tag="Have Questions?"
        firstHeading="Frequently Asked"
        secondHeading="Questions"
        description="Everything you need to know about us and our services. Can’t find an answer? Feel free to contact us."
        headingTag="h2"
        faqs={faqData}
      />
    </>
  );
};

export default page;
