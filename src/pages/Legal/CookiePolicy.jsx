import React from 'react';
import LandingNavbar from '../../components/LandingNavbar';
import LandingFooter from '../../components/LandingFooter';
import BackToTop from '../../components/BackToTop';
import { Cookie, Info, Settings, Shield, Zap, MousePointer2 } from 'lucide-react';
import { motion } from 'framer-motion';

const CookiePolicy = () => {
    const sections = [
        {
            title: "What are Cookies?",
            icon: <Cookie className="w-6 h-6 text-amber-400" />,
            content: "Cookies are small text files that are stored on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and login status."
        },
        {
            title: "How We Use Cookies",
            icon: <Info className="w-6 h-6 text-blue-400" />,
            content: "We use cookies to understand how you interact with our platform, track performance, and save your personal settings. This allows us to improve our services based on your behavior."
        },
        {
            title: "Types of Cookies",
            icon: <Settings className="w-6 h-6 text-indigo-400" />,
            content: "We use both essential cookies (necessary for the site to function) and analytical cookies (to help us understand site usage). You can choose to opt-out of analytical cookies."
        },
        {
            title: "Managing Cookies",
            icon: <MousePointer2 className="w-6 h-6 text-emerald-400" />,
            content: "Most web browsers allow you to control cookies through their settings. You can delete existing cookies or set your browser to block all cookies, though some features may not work correctly."
        },
        {
            title: "Third-Party Cookies",
            icon: <Shield className="w-6 h-6 text-purple-400" />,
            content: "We may use third-party services like Google Analytics that also set cookies on your device to help us analyze traffic and improve user experience."
        },
        {
            title: "Performance Tracking",
            icon: <Zap className="w-6 h-6 text-rose-400" />,
            content: "Some cookies help us monitor the performance of our site, ensuring that pages load quickly and that our AI tools respond promptly to your requests."
        }
    ];

    return (
        <div className="min-h-screen bg-[#050505] text-white font-outfit selection:bg-blue-500/30">
            {/* Background Glow */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[20%] w-[40%] h-[40%] bg-amber-600/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-[10%] right-[10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full" />
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
                        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                            Cookie Policy
                        </h1>
                        <p className="text-white/60 text-lg max-w-2xl mx-auto">
                            Last updated: February 14, 2026. Learn about how we use cookies to improve your campus life.
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
                                        <h2 className="text-xl font-bold mb-3 text-white group-hover:text-amber-400 transition-colors">
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
                        className="mt-16 p-8 rounded-3xl bg-gradient-to-br from-amber-500/10 to-orange-600/10 border border-amber-500/20 text-center"
                    >
                        <h3 className="text-xl font-bold mb-4">Cookie Preferences</h3>
                        <p className="text-white/60 mb-6">
                            You can update your cookie preferences at any time. We respect your choice to control your data.
                        </p>
                        <button
                            className="px-8 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 font-bold hover:scale-105 transition-transform"
                            onClick={() => alert("Cookie settings coming soon!")}
                        >
                            Manage Settings
                        </button>
                    </motion.div>
                </div>
            </main>

            <LandingFooter />
            <BackToTop />
        </div>
    );
};

export default CookiePolicy;
