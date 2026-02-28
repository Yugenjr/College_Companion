import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Sparkles, ArrowLeft } from "lucide-react";

/**
 * Reusable Auth Card wrapper component
 * Maintains consistency with the Landing Page theme (Glassmorphism, Dark gradients)
 */
const AuthCard = ({ children, title, subtitle, backLink = "/" }) => {
    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-[#050505]">
            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Grid Overlay */}
                <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px_32px]" />

                {/* Gradient Orbs */}
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.1, 0.2, 0.1],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-blue-600/15 blur-[120px]"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.1, 0.15, 0.1],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 2,
                    }}
                    className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full bg-indigo-600/15 blur-[120px]"
                />

                {/* Grain Texture */}
                <div className="absolute inset-0 opacity-[0.02] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNhKSIvPjwvc3ZnPg==')] mix-blend-overlay" />
            </div>

            {/* Main Split Container */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="relative w-full max-w-5xl z-10 flex flex-col lg:flex-row items-stretch justify-center gap-0 lg:gap-8 min-h-fit py-4"
            >
                {/* Left Side: Branding (Visible only on LG screens) */}
                <div className="hidden lg:flex flex-1 flex-col justify-center p-6 lg:p-8 relative overflow-hidden">
                    <div className="relative z-10 space-y-6 text-left">
                        <Link to="/" className="flex items-center gap-3 group w-fit">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:rotate-6 transition-transform">
                                <Sparkles className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold text-white tracking-tight font-outfit uppercase">College Companion</span>
                        </Link>

                        <div className="space-y-3">
                            <h2 className="text-5xl font-extrabold text-white leading-tight font-outfit tracking-tight">
                                Master Your Studies <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
                                    With AI Intelligence
                                </span>
                            </h2>
                            <p className="text-white/40 text-base font-medium leading-relaxed max-w-sm">
                                Join thousands of students using AI-driven tools to automate attendance, collaborate with peers, and excel in academics.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-2 pt-2">
                            {[
                                "AI Attendance Advisor",
                                "Study Arena Collaboration",
                                "Semester Roadmap Generator"
                            ].map((feature, i) => (
                                <div key={i} className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white/50 text-[10px] font-semibold backdrop-blur-md">
                                    {feature}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Side: Auth Card (Vertical Content) */}
                <div className="w-full lg:max-w-[500px] flex items-center justify-center">
                    <div className="w-full bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-6 lg:p-6 shadow-2xl relative overflow-hidden group">
                        {/* Hover Glow */}
                        <div className="absolute -inset-24 bg-blue-600/5 blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />

                        {/* Mobile Header (Hidden on LG) */}
                        <div className="lg:hidden text-center mb-5 relative z-10">
                            <div className="w-10 h-10 mx-auto mb-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                                <Sparkles className="w-5 h-5 text-white" />
                            </div>
                            <h1 className="text-xl font-bold text-white mb-1 tracking-tight font-outfit">{title}</h1>
                            <p className="text-white/40 text-[10px] font-medium">{subtitle}</p>
                        </div>

                        {/* Desktop Header (Visible on LG) */}
                        <div className="hidden lg:block mb-5 relative z-10">
                            <h1 className="text-2xl font-black text-white mb-0.5 tracking-tight font-outfit leading-none">{title}</h1>
                            <p className="text-white/40 text-[10px] font-medium">{subtitle}</p>
                        </div>

                        {/* Content */}
                        <div className="relative z-10">
                            {children}
                        </div>

                        {/* Back Link */}
                        <div className="mt-6 lg:mt-8 text-center relative z-10">
                            <Link to={backLink} className="inline-flex items-center gap-2 text-xs text-white/30 hover:text-white transition-all duration-300 group/back font-medium">
                                <ArrowLeft className="w-3 h-3 group-hover/back:-translate-x-1 transition-transform" />
                                Back to Home
                            </Link>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default AuthCard;
