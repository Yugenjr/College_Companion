import React from "react";

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen px-6 py-12 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

      <p className="mb-4">
        At College Companion, we value your privacy. This Privacy Policy explains
        how we collect, use, and protect your information.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Information We Collect</h2>
      <p className="mb-4">
        We may collect personal information such as name, email address, and usage
        data to improve our services.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">How We Use Information</h2>
      <p>
        Your information is used to enhance platform functionality and ensure a
        better user experience.
      </p>
    </div>
  );
};

export default PrivacyPolicy;
