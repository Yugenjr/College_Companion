import { motion } from "framer-motion";

const Section = ({ title, children }: any) => (
  <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-sm">
    <h2 className="text-xl md:text-2xl font-semibold text-white mb-4">
      {title}
    </h2>
    <div className="text-white/60 leading-relaxed text-sm md:text-base space-y-3">
      {children}
    </div>
  </div>
);

const PrivacyPolicy = () => {
  return (
    <div className="relative min-h-screen bg-[#050505] overflow-hidden">
      {/* glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[400px] bg-blue-600/10 blur-[140px]" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* header */}
          <div className="text-center mb-14">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Privacy Policy
            </h1>
            <p className="text-white/50 text-sm">
              Last updated: February 12, 2026
            </p>
          </div>

          <div className="space-y-8">

            <Section title="Introduction">
              <p>
                College Companion values your privacy. This policy explains how
                we collect, use, and protect your information when you use our
                platform and services.
              </p>
            </Section>

            <Section title="Information We Collect">
              <ul className="list-disc ml-5 space-y-2">
                <li>Name and email when you register</li>
                <li>Account and academic usage data</li>
                <li>Analytics and device information</li>
                <li>Messages or content you submit</li>
              </ul>
            </Section>

            <Section title="How We Use Information">
              <ul className="list-disc ml-5 space-y-2">
                <li>Provide and improve platform features</li>
                <li>Personalize your experience</li>
                <li>Respond to support requests</li>
                <li>Maintain security and prevent abuse</li>
              </ul>
            </Section>

            <Section title="Data Sharing">
              <p>
                We do not sell your personal data. We may share limited data
                with infrastructure providers and analytics services strictly
                to operate the platform or when legally required.
              </p>
            </Section>

            <Section title="Cookies">
              <p>
                We use cookies and similar technologies to enhance performance
                and remember preferences. You can disable cookies in your
                browser settings.
              </p>
            </Section>

            <Section title="Your Rights">
              <p>
                You may request access, correction, or deletion of your data by
                contacting support. We will respond within a reasonable time.
              </p>
            </Section>

            <Section title="Policy Updates">
              <p>
                We may update this policy periodically. Continued use of the
                service means you accept the revised policy.
              </p>
            </Section>

          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
