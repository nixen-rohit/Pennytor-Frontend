import React from "react";

const TermsService = () => {
  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-[#4E385E] to-[#E85B66] relative overflow-hidden py-16 px-4">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute -bottom-20 -left-20 w-[500px] h-[500px] rounded-full border border-white" />
          <div className="absolute -top-20 -right-20 w-[500px] h-[500px] rounded-full border border-white" />
        </div>
        <div className="max-w-4xl mx-auto relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">Terms of Service</h1>
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
            1. Acceptance of Terms
          </h2>
          <p className="text-gray-600 leading-relaxed">
            By accessing and using Pennytor, you accept and agree to be bound by the terms and provision of this agreement. In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 text-[#4E385E] flex items-center gap-2">
            <span className="w-1.5 h-6 rounded-full bg-[#E85B66] inline-block" />
            2. Description of Service
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Pennytor provides users with access to a rich collection of resources and services. You also understand and agree that the service may include certain communications from Pennytor, such as service announcements, administrative messages, and newsletters, and that these communications are considered part of Pennytor membership.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 text-[#4E385E] flex items-center gap-2">
            <span className="w-1.5 h-6 rounded-full bg-[#E85B66] inline-block" />
            3. User Registration and Account Security
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            In consideration of your use of the Service, you agree to:
          </p>
          <ul className="space-y-3">
            {[
              "Provide true, accurate, current and complete information about yourself as prompted by the Service's registration form.",
              "Maintain and promptly update the Registration Data to keep it true, accurate, current and complete.",
              "Be responsible for maintaining the confidentiality of your password and account.",
              "Be fully responsible for all activities that occur under your password or account.",
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
            4. User Conduct
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            You agree to not use the Service to:
          </p>
          <ul className="space-y-3">
            {[
              "Upload, post, email, transmit or otherwise make available any Content that is unlawful, harmful, threatening, abusive, or harassing.",
              "Harm minors in any way.",
              "Impersonate any person or entity.",
              "Interfere with or disrupt the Service or servers or networks connected to the Service.",
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
            5. Modifications to Service
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Pennytor reserves the right at any time and from time to time to modify or discontinue, temporarily or permanently, the Service (or any part thereof) with or without notice. You agree that Pennytor shall not be liable to you or to any third party for any modification, suspension or discontinuance of the Service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 text-[#4E385E] flex items-center gap-2">
            <span className="w-1.5 h-6 rounded-full bg-[#E85B66] inline-block" />
            6. Termination
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Pennytor may immediately terminate your account for reasons including but not limited to:
          </p>
          <ul className="space-y-3">
            {[
              "Breaches or violations of the Terms of Service or other incorporated agreements or guidelines.",
              "Requests by law enforcement or other government agencies.",
              "A request by you (self-initiated account deletions).",
              "Discontinuance or material modification to the Service (or any part thereof).",
              "Unexpected technical or security issues or problems.",
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
            7. Disclaimer of Warranties
          </h2>
          <p className="text-gray-600 leading-relaxed">
            You expressly understand and agree that your use of the service is at your sole risk. The service is provided on an &quot;as is&quot; and &quot;as available&quot; basis. Pennytor expressly disclaims all warranties of any kind, whether express or implied.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 text-[#4E385E] flex items-center gap-2">
            <span className="w-1.5 h-6 rounded-full bg-[#E85B66] inline-block" />
            8. Contact Information
          </h2>
          <p className="text-gray-600 leading-relaxed mb-2">
            If you have any questions or concerns regarding these Terms of Service, please contact us at:
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

export default TermsService;