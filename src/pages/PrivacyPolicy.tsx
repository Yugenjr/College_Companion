import React from "react";

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen px-6 py-16 max-w-4xl mx-auto space-y-8">
      
      {/* Page Title */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Privacy Policy</h1>
        <p className="text-gray-600">
          At College Companion, we are committed to protecting your privacy and
          ensuring transparency about how your information is collected, used,
          and safeguarded.
        </p>
      </div>

      {/* Introduction */}
      <section className="space-y-3">
        <p className="text-gray-700">
          This Privacy Policy explains what information we collect, how we use
          it, and the rights you have regarding your personal data. By using
          College Companion, you agree to the practices described in this policy.
        </p>
      </section>

      {/* 1. Information We Collect */}
      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">1. Information We Collect</h2>
        <p className="text-gray-700">
          We may collect different types of information to provide and improve
          our services:
        </p>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li>Personal information such as name and email address</li>
          <li>Account credentials for authentication</li>
          <li>Usage data including interactions within the platform</li>
          <li>Device, browser, and log information for analytics</li>
        </ul>
      </section>

      {/* 2. How We Use Your Information */}
      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">2. How We Use Your Information</h2>
        <p className="text-gray-700">
          The information collected may be used for the following purposes:
        </p>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li>To provide and maintain platform functionality</li>
          <li>To personalize and improve user experience</li>
          <li>To respond to user inquiries and support requests</li>
          <li>To monitor and enhance system performance and security</li>
        </ul>
      </section>

      {/* 3. Data Security */}
      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">3. Data Security</h2>
        <p className="text-gray-700">
          We implement appropriate technical and organizational measures to
          protect your personal information from unauthorized access,
          alteration, disclosure, or destruction.
        </p>
      </section>

      {/* 4. Third-Party Services */}
      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">4. Third-Party Services</h2>
        <p className="text-gray-700">
          We may use trusted third-party services such as analytics providers
          and hosting services. These third parties process data in accordance
          with their own privacy policies and applicable regulations.
        </p>
      </section>

      {/* 5. User Rights */}
      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">5. Your Rights</h2>
        <p className="text-gray-700">
          As a user, you have the right to:
        </p>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li>Access the personal information we hold about you</li>
          <li>Request correction of inaccurate data</li>
          <li>Request deletion of your personal data</li>
          <li>Withdraw consent where applicable</li>
        </ul>
      </section>

      {/* 6. Changes to This Policy */}
      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">6. Changes to This Privacy Policy</h2>
        <p className="text-gray-700">
          We may update this Privacy Policy from time to time. Any changes
          will be posted on this page with an updated revision date.
        </p>
      </section>

      {/* Last Updated */}
      <div className="border-t pt-6 text-sm text-gray-500">
        Last Updated: {new Date().getFullYear()}
      </div>

    </div>
  );
};

export default PrivacyPolicy;