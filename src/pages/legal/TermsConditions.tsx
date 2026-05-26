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

const TermsConditions = () => {
  return (
    <div className="relative min-h-screen bg-[#050505] overflow-hidden">
      {/* glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[400px] bg-indigo-600/10 blur-[140px]" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* header */}
          <div className="text-center mb-14">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Terms & Conditions
            </h1>
            <p className="text-white/50 text-sm">
              Last updated: February 12, 2026
            </p>
          </div>

          <div className="space-y-8">

            <Section title="Acceptance of Terms">
              <p>
                By accessing College Companion, you agree to these Terms and
                Conditions and all applicable laws and regulations.
              </p>
            </Section>

            <Section title="Use of Service">
              <ul className="list-disc ml-5 space-y-2">
                <li>Use the platform only for lawful purposes</li>
                <li>Do not attempt unauthorized access</li>
                <li>Do not disrupt or overload the system</li>
              </ul>
            </Section>

            <Section title="User Accounts">
              <p>
                You are responsible for maintaining account confidentiality and
                all activity under your account.
              </p>
            </Section>

            <Section title="Intellectual Property">
              <p>
                All platform content, UI, branding, and code remain the
                property of College Companion unless stated otherwise.
              </p>
            </Section>

            <Section title="Service Availability">
              <p>
                We may modify, suspend, or discontinue features at any time
                without prior notice.
              </p>
            </Section>

            <Section title="Limitation of Liability">
              <p>
                We are not liable for indirect or consequential damages arising
                from use or inability to use the platform.
              </p>
            </Section>

            <Section title="Termination">
              <p>
                Accounts violating these terms may be suspended or terminated.
              </p>
            </Section>

            <Section title="Changes to Terms">
              <p>
                Continued use of the platform after updates means you accept
                the revised terms.
              </p>
            </Section>

          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TermsConditions;
