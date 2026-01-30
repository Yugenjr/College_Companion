import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Sparkles, TrendingUp, BookOpen, Users } from 'lucide-react';

const FeaturesSection = () => {
    const featuresRef = useRef(null);
    const isFeaturesInView = useInView(featuresRef, { once: true, margin: "-100px" });

    const features = [
        {
            icon: TrendingUp,
            title: 'Attendance Advisor',
            description: 'AI-driven attendance tracking with smart predictions and personalized recommendations to stay on track.',
            gradient: 'from-violet-500 via-purple-500 to-fuchsia-500',
            delay: 0.1
        },
        {
            icon: BookOpen,
            title: 'Syllabus Essentials',
            description: 'Extract key topics from syllabus PDFs/images using Perplexity AI for quick topic understanding.',
            gradient: 'from-cyan-500 via-blue-500 to-indigo-500',
            delay: 0.2
        },
        {
            icon: Sparkles,
            title: 'Question Generator',
            description: 'Generate exam-style practice questions automatically using Groq AI to ace your tests.',
            gradient: 'from-pink-500 via-rose-500 to-red-500',
            delay: 0.3
        },
        {
            icon: Users,
            title: 'Study Arena',
            description: 'Create collaborative study rooms with real-time chat and share room codes with classmates.',
            gradient: 'from-amber-500 via-orange-500 to-red-500',
            delay: 0.4
        }
    ];

    return (
        <section id="features" ref={featuresRef} className="relative py-32 border-t border-white/[0.06]">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-fuchsia-500/[0.02] to-transparent" />

            <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isFeaturesInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="text-center mb-24"
                >
                    <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl mb-8">
                        <Sparkles className="w-4 h-4 text-fuchsia-400" strokeWidth={2.5} />
                        <span className="text-sm text-white/60 font-bold tracking-tight" style={{ fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif' }}>Powerful Features</span>
                    </div>
                    <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-[-0.02em]" style={{ fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif' }}>
                        <span className="text-white">Everything You Need for</span>
                        <br />
                        <span className="relative inline-block mt-2">
                            <span className="absolute inset-0 blur-2xl bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 opacity-30" />
                            <span className="relative bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
                                Academic Success
                            </span>
                        </span>
                    </h2>
                    <p className="text-lg md:text-xl text-white/40 max-w-3xl mx-auto leading-relaxed" style={{ fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif' }}>
                        AI-powered tools built with Groq, Google Gemini, and Perplexity AI for smart academic assistance
                    </p>
                </motion.div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            animate={isFeaturesInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6, delay: feature.delay, ease: [0.22, 1, 0.36, 1] }}
                            className="group relative"
                        >
                            <div className="relative p-10 rounded-3xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-xl hover:bg-white/[0.04] hover:border-white/[0.1] transition-all duration-500 overflow-hidden h-full">
                                {/* Gradient overlay */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500`} />

                                {/* Icon */}
                                <div className="relative mb-8">
                                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} blur-2xl opacity-40 group-hover:opacity-60 transition-opacity duration-500`} />
                                    <div className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-2xl`}>
                                        <feature.icon className="w-8 h-8 text-white" strokeWidth={2.5} />
                                    </div>
                                </div>

                                <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-white transition-colors" style={{ fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif' }}>
                                    {feature.title}
                                </h3>
                                <p className="text-white/40 leading-relaxed" style={{ fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif' }}>
                                    {feature.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;
