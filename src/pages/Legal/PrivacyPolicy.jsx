import React from 'react';
import LandingNavbar from '../../components/LandingNavbar';
import LandingFooter from '../../components/LandingFooter';
import BackToTop from '../../components/BackToTop';
import { Shield, Lock, Eye, FileText, Bell, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

const PrivacyPolicy = () => {
    const sections = [
        {
            title: "Information We Collect",
            icon: <Eye className="w-6 h-6 text-blue-400" />,
            content: "We collect information you provide directly to us, such as when you create an account, update your profile, or use our academic tools. This may include your name, email address, educational institution, and study preferences."
        },
        {
            title: "How We Use Your Information",
            icon: <FileText className="w-6 h-6 text-indigo-400" />,
            content: "We use the information we collect to provide, maintain, and improve our services, including personalize your experience with AI-driven study recommendations and attendance tracking."
        },
        {
            title: "Data Security",
            icon: <Lock className="w-6 h-6 text-purple-400" />,
            content: "We implement robust security measures to protect your personal information. However, no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security."
        },
        {
            title: "Your Rights",
            icon: <Shield className="w-6 h-6 text-blue-400" />,
            content: "You have the right to access, update, or delete your personal information at any time through your account settings. You can also request a copy of the data we hold about you."
        },
        {
            title: "Updates to This Policy",
            icon: <Bell className="w-6 h-6 text-indigo-400" />,
            content: "We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the 'Last updated' date."
        },
        {
            title: "Global Compliance",
            icon: <Globe className="w-6 h-6 text-purple-400" />,
            content: "We strive to comply with international data protection standards, ensuring your privacy is respected regardless of where you access College Companion from."
        }
    ];

    return (
        <div className="min-h-screen bg-[#050505] text-white font-outfit selection:bg-blue-500/30">
            {/* Background Glow */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full" />
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
                        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
                            Privacy Policy
                        </h1>
                        <p className="text-white/60 text-lg max-w-2xl mx-auto">
                            Last updated: February 14, 2026. Your privacy is our top priority. Learn how we handle your data with care.
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
                                        <h2 className="text-xl font-bold mb-3 text-white group-hover:text-blue-400 transition-colors">
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
                        className="mt-16 p-8 rounded-3xl bg-gradient-to-br from-blue-500/10 to-indigo-600/10 border border-blue-500/20 text-center"
                    >
                        <h3 className="text-xl font-bold mb-4">Contact Our Privacy Team</h3>
                        <p className="text-white/60 mb-6">
                            If you have any questions about our Privacy Policy or data practices, please reach out to us.
                        </p>
                        <a
                            href="mailto:privacy@collegecompanion.ai"
                            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 font-bold hover:scale-105 transition-transform"
                        >
                            Contact Us
                        </a>
                    </motion.div>
                </div>
            </main>

            <LandingFooter />
            <BackToTop />
        </div>
    );
};

export default PrivacyPolicy;
