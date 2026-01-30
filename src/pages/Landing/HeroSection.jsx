import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, ChevronDown } from 'lucide-react';
import dashboardPreview from '../../assets/dashboard-image.webp';

const HeroSection = () => {
    const navigate = useNavigate();

    const scrollToFeatures = () => {
        document.getElementById('features')?.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    };

    return (
        <section className="relative min-h-screen flex flex-col">
            {/* Premium background effects */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Deep gradient base */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0f] via-[#13111c] to-[#0a0a0f]" />

                {/* Animated gradient orbs */}
                <motion.div
                    className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full opacity-20 blur-3xl"
                    style={{
                        background: 'radial-gradient(circle, rgba(124,58,237,0.4) 0%, rgba(124,58,237,0) 70%)'
                    }}
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.2, 0.3, 0.2],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                <motion.div
                    className="absolute top-1/4 -right-40 w-[500px] h-[500px] rounded-full opacity-20 blur-3xl"
                    style={{
                        background: 'radial-gradient(circle, rgba(59,130,246,0.4) 0%, rgba(59,130,246,0) 70%)'
                    }}
                    animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.2, 0.25, 0.2],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                <motion.div
                    className="absolute bottom-0 left-1/3 w-[550px] h-[550px] rounded-full opacity-15 blur-3xl"
                    style={{
                        background: 'radial-gradient(circle, rgba(236,72,153,0.4) 0%, rgba(236,72,153,0) 70%)'
                    }}
                    animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.15, 0.25, 0.15],
                    }}
                    transition={{
                        duration: 12,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />

                {/* Grid pattern overlay */}
                <div
                    className="absolute inset-0 opacity-[0.02]"
                    style={{
                        backgroundImage: `
                            linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
                        `,
                        backgroundSize: '100px 100px'
                    }}
                />
            </div>

            {/* Premium Navigation */}
            <nav className="relative z-50 border-b border-white/[0.06] backdrop-blur-2xl bg-[#0a0a0f]/80">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 sm:h-20">
                        {/* Logo */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                            className="flex items-center gap-2 sm:gap-3 group cursor-pointer"
                        >
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-fuchsia-500 blur-xl opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                                <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-2xl shadow-violet-500/50">
                                    <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white" strokeWidth={2.5} />
                                </div>
                            </div>
                            <div>
                                <span className="text-base sm:text-xl font-bold text-white tracking-tight" style={{ fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif' }}>
                                    College Companion
                                </span>
                                <div className="hidden sm:block text-[9px] text-white/30 uppercase tracking-[0.15em] font-medium">Academic Excellence Platform</div>
                            </div>
                        </motion.div>

                        {/* Navigation Buttons */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                            className="flex items-center gap-2 sm:gap-3"
                        >
                            <button
                                onClick={() => navigate('/login')}
                                className="px-3 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-white/70 hover:text-white transition-all duration-300 rounded-lg sm:rounded-xl hover:bg-white/[0.04]"
                                style={{ fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif' }}
                            >
                                Sign In
                            </button>
                            <button
                                onClick={() => navigate('/register')}
                                className="group relative px-4 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-bold text-white rounded-lg sm:rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                                style={{ fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif' }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500" />
                                <div className="absolute inset-0 bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <span className="relative flex items-center gap-1 sm:gap-2">
                                    Get Started
                                    <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-0.5 transition-transform" strokeWidth={2.5} />
                                </span>
                            </button>
                        </motion.div>
                    </div>
                </div>
            </nav>

            {/* Hero Content */}
            <div className="relative z-10 flex-1 flex items-center">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20 lg:py-24">
                    <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
                        {/* Left Content */}
                        <div className="text-center lg:text-left space-y-6 sm:space-y-8">
                            {/* Premium Badge */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                                className="inline-flex items-center gap-2 sm:gap-2.5 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl group hover:bg-white/[0.05] hover:border-white/[0.12] transition-all duration-500"
                            >
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500 shadow-lg shadow-violet-500/50"></span>
                                </span>
                                <span className="text-xs sm:text-sm text-white/60 font-semibold tracking-tight" style={{ fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif' }}>
                                    Powered by Groq, Gemini & Perplexity AI
                                </span>
                            </motion.div>

                            {/* Main Headline */}
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-[-0.02em]"
                                style={{ fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif' }}
                            >
                                <span className="text-white">Transform Your</span>
                                <br />
                                <span className="relative inline-block mt-1 sm:mt-2">
                                    <span className="absolute inset-0 blur-xl sm:blur-2xl bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 opacity-30" />
                                    <span className="relative bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent whitespace-nowrap">
                                        Academic Journey
                                    </span>
                                </span>
                            </motion.h1>

                            {/* Subheadline */}
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                                className="text-base sm:text-lg md:text-xl text-white/50 leading-relaxed max-w-xl lg:max-w-none mx-auto lg:mx-0"
                                style={{ fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif' }}
                            >
                                AI-powered attendance tracking, syllabus extraction, question generation, and real-time study collaboration—your complete academic toolkit.
                            </motion.p>

                            {/* CTA Buttons */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                                className="flex flex-col sm:flex-row items-center lg:items-start gap-3 sm:gap-4"
                            >
                                <button
                                    onClick={() => navigate('/register')}
                                    className="w-full sm:w-auto group relative px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-white transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-2xl"
                                    style={{ fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif' }}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 rounded-xl sm:rounded-2xl" />
                                    <div className="absolute inset-0 bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    <div className="absolute inset-0 rounded-xl sm:rounded-2xl shadow-[0_0_50px_rgba(124,58,237,0.5)] group-hover:shadow-[0_0_80px_rgba(124,58,237,0.6)] transition-all duration-300" />
                                    <span className="relative flex items-center justify-center gap-2 text-sm sm:text-base">
                                        Start Free Today
                                        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" strokeWidth={2.5} />
                                    </span>
                                </button>
                                <button
                                    onClick={scrollToFeatures}
                                    className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white/[0.04] border border-white/[0.08] backdrop-blur-xl rounded-xl sm:rounded-2xl font-bold text-white hover:bg-white/[0.08] hover:border-white/[0.12] transition-all duration-300 text-sm sm:text-base"
                                    style={{ fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif' }}
                                >
                                    Explore Features
                                </button>
                            </motion.div>

                            {/* Trust Indicators */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.7, duration: 0.8 }}
                                className="flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 text-xs sm:text-sm text-white/40"
                                style={{ fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif' }}
                            >
                                <div className="flex items-center gap-2 sm:gap-2.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 shadow-lg shadow-violet-500/50" />
                                    <span className="font-semibold">100% Free</span>
                                </div>
                                <div className="flex items-center gap-2 sm:gap-2.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 shadow-lg shadow-cyan-500/50" />
                                    <span className="font-semibold">AI-Powered</span>
                                </div>
                                <div className="flex items-center gap-2 sm:gap-2.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 shadow-lg shadow-pink-500/50" />
                                    <span className="font-semibold">Secure & Private</span>
                                </div>
                            </motion.div>
                        </div>

                        {/* Right Side - macOS Style Dashboard Mockup with Animations */}
                        <motion.div
                            initial={{ opacity: 0, x: 40 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6, duration: 1, ease: [0.22, 1, 0.36, 1] }}
                            className="relative hidden lg:block"
                        >
                            {/* Floating mockup card with animation */}
                            <motion.div
                                className="relative"
                                animate={{
                                    y: [0, -10, 0],
                                }}
                                transition={{
                                    duration: 6,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            >
                                {/* Animated Glow effect */}
                                <motion.div
                                    className="absolute -inset-4 bg-gradient-to-br from-violet-500/20 via-fuchsia-500/20 to-pink-500/20 blur-3xl rounded-3xl"
                                    animate={{
                                        scale: [1, 1.05, 1],
                                        opacity: [0.5, 0.7, 0.5]
                                    }}
                                    transition={{
                                        duration: 4,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                />

                                {/* Main mockup container with hover effect */}
                                <motion.div
                                    className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 bg-[#0a0a0f] backdrop-blur-xl shadow-2xl"
                                    whileHover={{
                                        scale: 1.02,
                                        rotateY: 5,
                                        rotateX: -2,
                                    }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 300,
                                        damping: 20
                                    }}
                                    style={{
                                        transformStyle: "preserve-3d",
                                        perspective: 1000
                                    }}
                                >
                                    {/* macOS window controls */}
                                    <div className="flex items-center gap-2 px-4 sm:px-6 py-3 sm:py-4 border-b border-white/5 bg-white/[0.02]">
                                        <motion.div
                                            className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors cursor-pointer"
                                            whileHover={{ scale: 1.2 }}
                                            whileTap={{ scale: 0.9 }}
                                        />
                                        <motion.div
                                            className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow-500/80 hover:bg-yellow-500 transition-colors cursor-pointer"
                                            whileHover={{ scale: 1.2 }}
                                            whileTap={{ scale: 0.9 }}
                                        />
                                        <motion.div
                                            className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-500/80 hover:bg-green-500 transition-colors cursor-pointer"
                                            whileHover={{ scale: 1.2 }}
                                            whileTap={{ scale: 0.9 }}
                                        />
                                        <div className="ml-3 sm:ml-4 text-[10px] sm:text-xs text-white/40 font-semibold" style={{ fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif' }}>
                                            College Companion Dashboard
                                        </div>
                                    </div>

                                    {/* Dashboard Screenshot with shimmer effect */}
                                    <div className="relative overflow-hidden group">
                                        <motion.img
                                            src={dashboardPreview}
                                            alt="Dashboard Preview"
                                            className="w-full h-auto object-cover"
                                            initial={{ opacity: 0.9 }}
                                            whileHover={{ opacity: 1 }}
                                            transition={{ duration: 0.3 }}
                                        />
                                        {/* Overlay gradient for extra depth */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f]/20 to-transparent pointer-events-none" />

                                        {/* Shimmer effect on hover */}
                                        <motion.div
                                            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                            style={{
                                                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)'
                                            }}
                                            animate={{
                                                x: ['-100%', '200%']
                                            }}
                                            transition={{
                                                duration: 2,
                                                repeat: Infinity,
                                                repeatDelay: 3
                                            }}
                                        />
                                    </div>
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:block"
            >
                <motion.button
                    onClick={scrollToFeatures}
                    className="flex flex-col items-center gap-2 text-white/40 hover:text-white/60 transition-colors cursor-pointer"
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    <span className="text-xs font-semibold tracking-wide" style={{ fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif' }}>Scroll to explore</span>
                    <ChevronDown className="w-5 h-5" strokeWidth={2} />
                </motion.button>
            </motion.div>
        </section>
    );
};

export default HeroSection;
