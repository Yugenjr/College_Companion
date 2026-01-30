import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Sparkles, UserPlus, Settings, Rocket } from 'lucide-react';

const HowItWorksSection = () => {
    const howItWorksRef = useRef(null);
    const isHowItWorksInView = useInView(howItWorksRef, { once: true, margin: "-100px" });

    const steps = [
        {
            icon: UserPlus,
            number: '01',
            title: 'Sign Up',
            description: 'Quick registration with Google or email via Firebase Authentication.',
        },
        {
            icon: Settings,
            number: '02',
            title: 'Setup Profile',
            description: 'Complete onboarding with your semester details and academic info.',
        },
        {
            icon: Rocket,
            number: '03',
            title: 'Start Learning',
            description: 'Access AI tools, study rooms, and track your academic progress.',
        }
    ];

    return (
        <section id="how-it-works" ref={howItWorksRef} className="relative py-32 border-t border-white/[0.06]">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/[0.02] to-transparent" />

            <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isHowItWorksInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="text-center mb-24"
                >
                    <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl mb-8">
                        <Sparkles className="w-4 h-4 text-blue-400" strokeWidth={2.5} />
                        <span className="text-sm text-white/60 font-bold tracking-tight" style={{ fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif' }}>How It Works</span>
                    </div>
                    <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-[-0.02em]" style={{ fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif' }}>
                        <span className="text-white">Get Started in</span>
                        <br />
                        <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
                            Three Simple Steps
                        </span>
                    </h2>
                    <p className="text-lg md:text-xl text-white/40 max-w-2xl mx-auto leading-relaxed" style={{ fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif' }}>
                        Begin your journey to academic excellence in minutes
                    </p>
                </motion.div>

                {/* Steps Grid */}
                <div className="relative max-w-6xl mx-auto">
                    {/* Connection line */}
                    <div className="hidden lg:block absolute top-24 left-0 right-0 h-[2px]">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
                        {steps.map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                animate={isHowItWorksInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.6, delay: index * 0.2, ease: [0.22, 1, 0.36, 1] }}
                                className="relative group pt-8"
                            >
                                <div className="relative p-10 rounded-3xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-xl hover:bg-white/[0.04] hover:border-white/[0.1] transition-all duration-500 overflow-visible">
                                    {/* Hover gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-violet-500/[0.03] to-fuchsia-500/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                    {/* Step number badge */}
                                    <div className="absolute -top-6 left-10">
                                        <div className="relative">
                                            <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-fuchsia-500 blur-xl opacity-60" />
                                            <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center font-bold text-white shadow-2xl" style={{ fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif' }}>
                                                {step.number}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Icon */}
                                    <div className="mt-6 mb-8">
                                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:border-white/20 transition-all duration-500">
                                            <step.icon className="w-8 h-8 text-white/80" strokeWidth={2} />
                                        </div>
                                    </div>

                                    <h3 className="text-2xl font-bold mb-4 text-white" style={{ fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif' }}>
                                        {step.title}
                                    </h3>
                                    <p className="text-white/40 leading-relaxed" style={{ fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif' }}>
                                        {step.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HowItWorksSection;
