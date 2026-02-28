import React from 'react';
import LandingNavbar from '../../components/LandingNavbar';
import LandingFooter from '../../components/LandingFooter';
import BackToTop from '../../components/BackToTop';
import { Scale, CheckCircle, AlertCircle, HelpCircle, FileCheck, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const TermsOfService = () => {
    const sections = [
        {
            title: "Acceptance of Terms",
            icon: <CheckCircle className="w-6 h-6 text-green-400" />,
            content: "By accessing or using College Companion, you agree to be bound by these Terms of Service. If you do not agree to all of these terms, do not use our services."
        },
        {
            title: "User Accounts",
            icon: <ShieldCheck className="w-6 h-6 text-blue-400" />,
            content: "You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account."
        },
        {
            title: "Academic Integrity",
            icon: <Scale className="w-6 h-6 text-amber-400" />,
            content: "Our tools are designed to assist learning, not to facilitate academic dishonesty. Users are responsible for ensuring their use of College Companion aligns with their institution's policies."
        },
        {
            title: "Intellectual Property",
            icon: <FileCheck className="w-6 h-6 text-purple-400" />,
            content: "The content, features, and functionality of College Companion are owned by us and are protected by international copyright, trademark, and other intellectual property laws."
        },
        {
            title: "Limitation of Liability",
            icon: <AlertCircle className="w-6 h-6 text-rose-400" />,
            content: "In no event shall College Companion be liable for any indirect, incidental, special, or consequential damages resulting from the use or inability to use our services."
        },
        {
            title: "Governing Law",
            icon: <HelpCircle className="w-6 h-6 text-indigo-400" />,
            content: "These Terms shall be governed and construed in accordance with the laws of the jurisdiction in which our company is established, without regard to its conflict of law provisions."
        }
    ];

    return (
        <div className="min-h-screen bg-[#050505] text-white font-outfit selection:bg-blue-500/30">
            {/* Background Glow */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
            </div>

            <LandingNavbar />

            <main className="relative z-10 pt-32 pb-20 px-6">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center mb-16"
                    >
                        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
                            Terms of Service
                        </h1>
                        <p className="text-white/60 text-lg max-w-2xl mx-auto">
                            Last updated: February 14, 2026. Please read these terms carefully before using our platform.
                        </p>
                    </motion.div>

                    <div className="grid gap-8">
                        {sections.map((section, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="glass-card-premium p-8 rounded-3xl border border-white/5 hover:border-white/10 transition-all group"
                            >
                                <div className="flex items-start gap-6">
                                    <div className="p-3 rounded-2xl bg-white/5 group-hover:bg-white/10 transition-colors">
                                        {section.icon}
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold mb-3 text-white group-hover:text-indigo-400 transition-colors">
                                            {section.title}
                                        </h2>
                                        <p className="text-white/50 leading-relaxed font-medium">
                                            {section.content}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="mt-16 p-8 rounded-3xl bg-gradient-to-br from-indigo-500/10 to-purple-600/10 border border-indigo-500/20 text-center"
                    >
                        <h3 className="text-xl font-bold mb-4">Questions About Our Terms?</h3>
                        <p className="text-white/60 mb-6">
                            If you have any questions regarding these Terms of Service, please contact our legal team.
                        </p>
                        <a
                            href="mailto:legal@collegecompanion.ai"
                            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 font-bold hover:scale-105 transition-transform"
                        >
                            Contact Legal
                        </a>
                    </motion.div>
                </div>
            </main>

            <LandingFooter />
            <BackToTop />
        </div>
    );
};

export default TermsOfService;
