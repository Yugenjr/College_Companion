import React from "react";

const CookiePolicy = () => {
  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      <h1 className="text-4xl font-bold mb-6 text-center">Cookie Policy</h1>

      <p className="mb-6 text-gray-700">
        This Cookie Policy explains how College Companion uses cookies and
        similar technologies to recognize you when you visit our website.
        It explains what these technologies are, why we use them, and your
        rights to control their use.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-3">
        What Are Cookies?
      </h2>

      <p className="text-gray-700 mb-6">
        Cookies are small data files stored on your device when you visit a
        website. They help websites remember your preferences and improve your
        browsing experience.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-3">
        Types of Cookies We Use
      </h2>

      <div className="space-y-4">

        <div>
          <h3 className="text-xl font-semibold">Essential Cookies</h3>
          <p className="text-gray-700">
            These cookies are necessary for the website to function properly.
            They enable core features such as page navigation, authentication,
            and security.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-semibold">Analytics Cookies</h3>
          <p className="text-gray-700">
            These cookies help us understand how users interact with our
            website. The information collected is anonymous and helps us
            improve the performance and usability of the platform.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-semibold">Functional Cookies</h3>
          <p className="text-gray-700">
            Functional cookies allow the website to remember choices you make
            such as your preferred settings, providing a more personalized
            experience.
          </p>
        </div>

      </div>

      <h2 className="text-2xl font-semibold mt-8 mb-3">
        Managing Cookies
      </h2>

      <p className="text-gray-700 mb-6">
        Most web browsers allow you to control cookies through their settings.
        You can choose to block or delete cookies at any time. However,
        disabling certain cookies may affect the functionality of the website.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-3">
        Updates to This Policy
      </h2>

      <p className="text-gray-700 mb-6">
        We may update this Cookie Policy from time to time to reflect changes
        in technology, regulations, or our services. Any updates will be posted
        on this page.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-3">
        Contact Us
      </h2>

      <p className="text-gray-700">
        If you have any questions about this Cookie Policy, please contact the
        College Companion team.
      </p>
    </div>
  );
};

export default CookiePolicy;