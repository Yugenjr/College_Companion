import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const StatsSection = () => {
    const statsRef = useRef(null);
    const isStatsInView = useInView(statsRef, { once: true, margin: "-100px" });

    const stats = [
        { value: '3', label: 'AI Models' },
        { value: 'Real-time', label: 'Collaboration' },
        { value: 'OCR', label: 'Powered' },
        { value: '100%', label: 'Free & Open' }
    ];

    return (
        <section ref={statsRef} className="relative py-24 border-t border-white/[0.06]">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-500/[0.02] to-transparent" />

            <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isStatsInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12"
                >
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={isStatsInView ? { opacity: 1, scale: 1 } : {}}
                            transition={{ duration: 0.5, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                            className="text-center group"
                        >
                            <div className="relative inline-block">
                                <div className="absolute inset-0 blur-2xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 group-hover:from-violet-500/30 group-hover:to-fuchsia-500/30 transition-all duration-500" />
                                <div className="relative text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-br from-white to-white/60 bg-clip-text text-transparent mb-3" style={{ fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif' }}>
                                    {stat.value}
                                </div>
                            </div>
                            <div className="text-white/40 text-sm md:text-base font-semibold tracking-wide" style={{ fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif' }}>
                                {stat.label}
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default StatsSection;
