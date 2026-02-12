import React from "react";

const TermsConditions: React.FC = () => {
  return (
    <div className="px-6 lg:px-24 py-12 text-gray-800">
      <h1 className="text-4xl font-bold text-center mb-8">
        Terms & Conditions
      </h1>

      <p className="mb-6">
        Last updated: <strong>February 12, 2026</strong>
      </p>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">
          Acceptance of Terms
        </h2>
        <p>
          By accessing or using College Companion (“we”, “us”, “our”), you agree
          to be bound by these Terms and Conditions and all applicable laws.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">
          Use of Website
        </h2>
        <p>
          You agree not to misuse our services or attempt to access them
          unlawfully. You further agree not to disrupt or interfere with the
          integrity of the platform.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">
          Intellectual Property
        </h2>
        <p>
          All content, design, trademarks, and code featured on the site are
          owned by College Companion or its licensors and protected by law.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">
          User Responsibilities
        </h2>
        <ul className="list-disc ml-6">
          <li>You must provide accurate information when required.</li>
          <li>You are responsible for maintaining confidentiality of your account.</li>
          <li>You agree not to post harmful, illegal, or offensive content.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">
          Termination
        </h2>
        <p>
          We may suspend or terminate access to the website for any user at any
          time, with or without notice, for violation of these terms.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">
          Limitation of Liability
        </h2>
        <p>
          College Companion and its affiliates are not liable for any damages
          arising out of your use or inability to use the service.
        </p>
      </section>

      <section className="pb-6 text-sm text-gray-600">
        <p>
          These Terms & Conditions constitute the entire agreement between you
          and College Companion regarding your use of the website and services.
        </p>
      </section>
    </div>
  );
};

export default TermsConditions;
