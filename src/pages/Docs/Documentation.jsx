import React from 'react';
import LandingNavbar from '../../components/LandingNavbar';
import LandingFooter from '../../components/LandingFooter';
import BackToTop from '../../components/BackToTop';
import { Book, Code, Shield, Zap, Cpu, Users, ArrowRight, Search, BookOpen, Terminal, LifeBuoy } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Documentation = () => {
    const categories = [
        {
            title: "Getting Started",
            icon: <Zap className="w-6 h-6 text-yellow-400" />,
            description: "Learn how to set up your profile and start using AI-powered tools in minutes.",
            links: ["Account Setup", "Onboarding Guide", "Dashboard Overview"]
        },
        {
            title: "AI Tools",
            icon: <Cpu className="w-6 h-6 text-blue-400" />,
            description: "Deep dive into our Attendance Advisor, Study Arena, and Semester Survival features.",
            links: ["Attendance Logic", "Room Creation", "Resource Management"]
        },
        {
            title: "Collaboration",
            icon: <Users className="w-6 h-6 text-emerald-400" />,
            description: "How to collaborate with peers in the Study Arena and share resources effectively.",
            links: ["Group Sessions", "Real-time Sync", "Sharing Permissions"]
        },
        {
            title: "API & Integration",
            icon: <Code className="w-6 h-6 text-purple-400" />,
            description: "For developers: Integrate College Companion tools with your own academic workflows.",
            links: ["Authentication", "Endpoints", "Webhooks"]
        },
        {
            title: "Security",
            icon: <Shield className="w-6 h-6 text-rose-400" />,
            description: "Understanding our encryption, data storage, and how we keep your academic data safe.",
            links: ["Data Encryption", "Privacy Standards", "Compliance"]
        },
        {
            title: "Help & Support",
            icon: <LifeBuoy className="w-6 h-6 text-amber-500" />,
            description: "Need help? Find answers to frequently asked questions or contact our support team.",
            links: ["FAQs", "Contact Support", "Community Forum"]
        }
    ];

    return (
        <div className="min-h-screen bg-[#050505] text-white font-outfit selection:bg-blue-500/30">
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-blue-600/10 blur-[120px]" />
                <div className="absolute top-0 left-0 w-full h-full bg-grid-white opacity-5" />
            </div>

            <LandingNavbar />

            <main className="relative z-10 pt-32 pb-20 px-6">
                <div className="max-w-7xl mx-auto">
                    {/* Header Section */}
                    <div className="text-center mb-20">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-bold mb-6"
                        >
                            <BookOpen className="w-4 h-4" />
                            <span>Knowledge Base</span>
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="text-5xl md:text-6xl font-bold mb-8"
                        >
                            Documentation <span className="text-blue-500 italic">Hub</span>
                        </motion.h1>

                        {/* Search Bar Mockup */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="max-w-2xl mx-auto relative group"
                        >
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-blue-400 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search for guides, tools, or concepts..."
                                className="w-full pl-14 pr-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-blue-500/50 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all text-white font-medium"
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 px-2 py-1 rounded bg-white/10 border border-white/10 text-[10px] font-bold text-white/40">
                                ⌘ K
                            </div>
                        </motion.div>
                    </div>

                    {/* Categories Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {categories.map((category, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="group p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:border-blue-500/30 hover:bg-blue-500/[0.02] transition-all duration-300"
                            >
                                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-blue-500/10 transition-all duration-300">
                                    {category.icon}
                                </div>
                                <h3 className="text-2xl font-bold mb-4 group-hover:text-blue-400 transition-colors">{category.title}</h3>
                                <p className="text-white/50 mb-8 leading-relaxed font-medium">{category.description}</p>

                                <ul className="space-y-3">
                                    {category.links.map((link, lIndex) => (
                                        <li key={lIndex}>
                                            <a href="#" className="flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors group/link">
                                                <ArrowRight className="w-3 h-3 text-blue-500 opacity-0 -ml-4 group-hover/link:opacity-100 group-hover/link:ml-0 transition-all" />
                                                <span>{link}</span>
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}
                    </div>

                    {/* Bottom CTA */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mt-20 p-1 bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-purple-500/20 rounded-[2.5rem]"
                    >
                        <div className="bg-[#0a0a0a] rounded-[2.4rem] p-12 flex flex-col items-center text-center">
                            <Terminal className="w-12 h-12 text-blue-400 mb-6" />
                            <h2 className="text-3xl font-bold mb-4">Can't find what you're looking for?</h2>
                            <p className="text-white/50 max-w-xl mb-10 font-medium">
                                Our documentation is constantly evolving. If you need specific help, our support team is available 24/7 to assist you.
                            </p>
                            <div className="flex flex-wrap justify-center gap-4">
                                <a href="mailto:support@collegecompanion.ai" className="px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all shadow-lg shadow-blue-600/20 hover:scale-105">
                                    Contact Support
                                </a>
                                <Link to="/" className="px-8 py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold transition-all border border-white/10">
                                    Back to Home
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>

            <LandingFooter />
            <BackToTop />
        </div>
    );
};

export default Documentation;
