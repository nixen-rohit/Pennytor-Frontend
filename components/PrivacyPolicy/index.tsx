import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-[#4E385E] to-[#E85B66] relative overflow-hidden py-16 px-4">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute -bottom-20 -left-20 w-[500px] h-[500px] rounded-full border border-white" />
          <div className="absolute -top-20 -right-20 w-[500px] h-[500px] rounded-full border border-white" />
        </div>
        <div className="max-w-4xl mx-auto relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">Privacy Policy</h1>
          <p className="text-white/70 text-base">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-10">
        <section>
          <h2 className="text-2xl font-bold mb-4 text-[#4E385E] flex items-center gap-2">
            <span className="w-1.5 h-6 rounded-full bg-[#E85B66] inline-block" />
            1. Introduction
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Welcome to Pennytor. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 text-[#4E385E] flex items-center gap-2">
            <span className="w-1.5 h-6 rounded-full bg-[#E85B66] inline-block" />
            2. The Data We Collect About You
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
          </p>
          <ul className="space-y-3">
            {[
              { label: "Identity Data", desc: "Includes first name, last name, username or similar identifier." },
              { label: "Contact Data", desc: "Includes email address and telephone numbers." },
              { label: "Technical Data", desc: "Includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location, operating system and platform." },
              { label: "Usage Data", desc: "Includes information about how you use our website, products and services." },
            ].map((item) => (
              <li key={item.label} className="flex gap-3 items-start">
                <span className="mt-1.5 w-2 h-2 rounded-full bg-[#E85B66] flex-shrink-0" />
                <span className="text-gray-600"><strong className="text-[#4E385E]">{item.label}:</strong> {item.desc}</span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 text-[#4E385E] flex items-center gap-2">
            <span className="w-1.5 h-6 rounded-full bg-[#E85B66] inline-block" />
            3. How We Use Your Personal Data
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
          </p>
          <ul className="space-y-3">
            {[
              "Where we need to perform the contract we are about to enter into or have entered into with you.",
              "Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.",
              "Where we need to comply with a legal obligation.",
            ].map((item, i) => (
              <li key={i} className="flex gap-3 items-start">
                <span className="mt-1.5 w-2 h-2 rounded-full bg-[#E85B66] flex-shrink-0" />
                <span className="text-gray-600">{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 text-[#4E385E] flex items-center gap-2">
            <span className="w-1.5 h-6 rounded-full bg-[#E85B66] inline-block" />
            4. Data Security
          </h2>
          <p className="text-gray-600 leading-relaxed">
            We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorised way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 text-[#4E385E] flex items-center gap-2">
            <span className="w-1.5 h-6 rounded-full bg-[#E85B66] inline-block" />
            5. Data Retention
          </h2>
          <p className="text-gray-600 leading-relaxed">
            We will only retain your personal data for as long as reasonably necessary to fulfil the purposes we collected it for, including for the purposes of satisfying any legal, regulatory, tax, accounting or reporting requirements.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 text-[#4E385E] flex items-center gap-2">
            <span className="w-1.5 h-6 rounded-full bg-[#E85B66] inline-block" />
            6. Your Legal Rights
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Under certain circumstances, you have rights under data protection laws in relation to your personal data. These include the right to:
          </p>
          <ul className="space-y-3">
            {[
              "Request access to your personal data.",
              "Request correction of your personal data.",
              "Request erasure of your personal data.",
              "Object to processing of your personal data.",
              "Request restriction of processing your personal data.",
              "Request transfer of your personal data.",
              "Right to withdraw consent.",
            ].map((item, i) => (
              <li key={i} className="flex gap-3 items-start">
                <span className="mt-1.5 w-2 h-2 rounded-full bg-[#E85B66] flex-shrink-0" />
                <span className="text-gray-600">{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 text-[#4E385E] flex items-center gap-2">
            <span className="w-1.5 h-6 rounded-full bg-[#E85B66] inline-block" />
            7. Contact Us
          </h2>
          <p className="text-gray-600 leading-relaxed mb-2">
            If you have any questions about this privacy policy or our privacy practices, please contact us at:
          </p>
          <a
            href="mailto:support@pennytor.com"
            className="inline-block font-semibold text-[#E85B66] hover:text-[#4E385E] transition-colors"
          >
            support@pennytor.com
          </a>
        </section>
      </div>

      {/* Footer strip */}
      <div className="bg-gradient-to-r from-[#4E385E] to-[#E85B66] py-4 text-center text-white/70 text-sm">
        {new Date().getFullYear()} Pennytor. All rights reserved.
      </div>
    </div>
  );
};

export default PrivacyPolicy;
