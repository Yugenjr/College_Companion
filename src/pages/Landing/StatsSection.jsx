import { motion, useMotionValue, useTransform, animate, useInView } from 'framer-motion';
import { Users, GraduationCap, Zap, Star } from 'lucide-react';
import { useEffect, useRef } from 'react';

const CountUp = ({ value, suffix = "", decimals = 0 }) => {
    const count = useMotionValue(0);
    const rounded = useTransform(count, (latest) => {
        if (decimals > 0) {
            return latest.toFixed(decimals) + suffix;
        }
        return Math.floor(latest) + suffix;
    });

    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-100px" });

    useEffect(() => {
        if (inView) {
            const controls = animate(count, value, {
                duration: 2,
                ease: [0.16, 1, 0.3, 1], // Custom cubic-bezier for premium feel
            });
            return controls.stop;
        }
    }, [inView, value, count]);

    return <motion.span ref={ref}>{rounded}</motion.span>;
};

const StatsSection = () => {
    const stats = [
        { label: "Active Students", target: 25, suffix: "k+", icon: Users, color: "text-blue-400" },
        { label: "Questions Generated", target: 1.2, suffix: "M", icon: Zap, color: "text-amber-400", decimals: 1 },
        { label: "Colleges Joined", target: 450, suffix: "+", icon: GraduationCap, color: "text-purple-400" },
        { label: "Average Rating", target: 4.9, suffix: "/5", icon: Star, color: "text-rose-400", decimals: 1 },
    ];

    return (
        <section className="relative py-20 bg-dark-deep border-y border-white/5 overflow-hidden">
            {/* Subtle background glow removed */}

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                            viewport={{ once: true }}
                            className="text-center space-y-4 group"
                        >
                            <motion.div
                                className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/5 border border-white/10 mb-2 group-hover:border-white/20 transition-all duration-500 relative"
                            >
                                {/* Floating glow behind icon */}
                                <div className={`absolute inset-0 blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 ${stat.color.replace('text', 'bg')}`} />
                                <stat.icon className={`w-7 h-7 ${stat.color} relative z-10 group-hover:scale-110 transition-transform duration-500`} />
                            </motion.div>

                            <div className="space-y-1">
                                <h3 className="text-4xl md:text-6xl font-black text-white font-outfit tracking-tighter tabular-nums leading-none">
                                    <CountUp value={stat.target} suffix={stat.suffix} decimals={stat.decimals || 0} />
                                </h3>
                                <p className="text-[10px] md:text-sm font-black text-white/30 uppercase tracking-[0.2em] pt-2">{stat.label}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default StatsSection;
