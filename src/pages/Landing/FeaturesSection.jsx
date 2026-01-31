import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, ScanSearch, Users, BrainCircuit, Map, Fingerprint, ArrowRight } from 'lucide-react';

const FeaturesSection = () => {
    const features = [
        {
            title: "AI Attendance Advisor",
            desc: "Smart predictions based on your history. Never fall below the threshold again.",
            icon: TrendingUp,
            color: "#3b82f6",
            glow: "rgba(59,130,246,0.15)"
        },
        {
            title: "Smart Syllabus Scanner",
            desc: "Paste text or upload PDFs. Our AI extracts core concepts instantly.",
            icon: ScanSearch,
            color: "#a855f7",
            glow: "rgba(168,85,247,0.15)"
        },
        {
            title: "Study Arena Rooms",
            desc: "Synchronized workspace with friends. Real-time collaboration at its best.",
            icon: Users,
            color: "#10b981",
            glow: "rgba(16,185,129,0.15)"
        },
        {
            title: "AI Question Generator",
            desc: "Instant mock tests and sample questions tailored to your syllabus.",
            icon: BrainCircuit,
            color: "#f59e0b",
            glow: "rgba(245,158,11,0.15)"
        },
        {
            title: "Survival Roadmaps",
            desc: "Customized study schedules for end-term exams and project submissions.",
            icon: Map,
            color: "#f43f5e",
            glow: "rgba(244,63,94,0.15)"
        },
        {
            title: "Security & Privacy",
            desc: "Your data stays yours. Encrypted and protected by industrial standards.",
            icon: Fingerprint,
            color: "#06b6d4",
            glow: "rgba(6,182,212,0.15)"
        }
    ];

    return (
        <section id="features" className="relative py-32 bg-[#050505] overflow-hidden">
            {/* Background Light Rays */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-30 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-[1px] h-full bg-gradient-to-b from-transparent via-blue-500/20 to-transparent rotate-[20deg]" />
                <div className="absolute top-0 right-1/4 w-[1px] h-full bg-gradient-to-b from-transparent via-purple-500/20 to-transparent -rotate-[20deg]" />
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="flex flex-col items-center text-center space-y-4 mb-24">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-blue-500 text-xs font-black uppercase tracking-[0.3em]"
                    >
                        Intelligence Core
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="text-4xl md:text-6xl font-black text-white font-outfit"
                    >
                        Features Designed <br />
                        <span className="text-white/20">For Absolute Success.</span>
                    </motion.h2>
                    <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mt-4" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            whileHover={{ y: -8 }}
                            className="group relative"
                        >
                            {/* Card Accent Glow */}
                            <div
                                className="absolute -inset-0.5 rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition duration-500 blur-xl z-0"
                                style={{ background: feature.glow }}
                            />

                            <div className="relative h-full glass-card-premium p-10 rounded-[2.5rem] border border-white/5 hover:border-white/20 flex flex-col items-start transition-all duration-500 bg-white/[0.01]">
                                {/* Icon Container */}
                                <div className="relative mb-8">
                                    <div
                                        className="w-16 h-16 rounded-2xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6"
                                        style={{ backgroundColor: `${feature.color}15`, border: `1px solid ${feature.color}30` }}
                                    >
                                        <feature.icon className="w-8 h-8" style={{ color: feature.color }} />
                                    </div>
                                    {/* Small floating sparkles around icon on hover */}
                                    <Sparkles className="absolute -top-2 -right-2 w-4 h-4 text-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>

                                <h3 className="text-2xl font-bold text-white mb-4 font-outfit tracking-tight">
                                    {feature.title}
                                </h3>
                                <p className="text-white/40 text-base leading-relaxed font-medium mb-8">
                                    {feature.desc}
                                </p>

                                <div className="mt-auto flex items-center gap-2 text-white/60 font-bold text-sm group-hover:text-blue-400 transition-colors">
                                    Learn Integration <ArrowRight className="w-4 h-4 translate-x-0 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;
