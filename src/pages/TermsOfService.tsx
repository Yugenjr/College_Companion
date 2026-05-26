import React from "react";

const TermsOfService: React.FC = () => {
  return (
    <div className="min-h-screen px-6 py-12 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>

      <p className="mb-4">
        By accessing and using College Companion, you agree to comply with
        the following terms and conditions.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">User Responsibilities</h2>
      <p className="mb-4">
        Users must not misuse the platform or engage in harmful activities.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Account Usage</h2>
      <p>
        You are responsible for maintaining the confidentiality of your account.
      </p>
    </div>
  );
};

export default TermsOfService;
