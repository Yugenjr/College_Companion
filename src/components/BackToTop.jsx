import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { ChevronUp } from 'lucide-react';

const BackToTop = () => {
    const [isVisible, setIsVisible] = useState(false);
    const { scrollYProgress } = useScroll();

    // Smooth the scroll progress for the border stroke
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 400) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: 20 }}
                    className="fixed bottom-10 right-10 z-[90]"
                >
                    <button
                        onClick={scrollToTop}
                        className="relative group p-4 bg-black/40 backdrop-blur-xl border border-white/10 rounded-full shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] transition-all duration-300 hover:border-blue-500/50"
                        aria-label="Back to top"
                    >
                        {/* Circular Progress Ring */}
                        <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 100 100">
                            <motion.circle
                                cx="50"
                                cy="50"
                                r="48"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                fill="transparent"
                                className="text-blue-500/40"
                                style={{ pathLength: scaleX }}
                            />
                        </svg>

                        {/* Button Content */}
                        <div className="relative z-10 flex items-center justify-center">
                            <ChevronUp className="w-5 h-5 text-white/70 group-hover:text-white transition-all transform group-hover:-translate-y-1" />
                        </div>

                        {/* Subtle Glow Background */}
                        <div className="absolute inset-0 rounded-full bg-blue-500/0 group-hover:bg-blue-500/5 transition-all duration-500 blur-xl" />
                    </button>

                    {/* Tooltip hint */}
                    <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-2 py-1 rounded bg-white/5 border border-white/10 text-[10px] font-black text-white/40 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                        Scroll Top
                    </span>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default BackToTop;
