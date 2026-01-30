import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Sparkles, ArrowLeft } from "lucide-react";

/**
 * Reusable Auth Card wrapper component
 * Maintains consistency with the Landing Page theme (Glassmorphism, Dark gradients)
 */
const AuthCard = ({ children, title, subtitle, backLink = "/" }) => {
    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-[#0a0a0f]">
            {/* Background Effects (Matches Landing Page) */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">

                {/* Gradient Orbs */}
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.15, 0.25, 0.15],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-violet-500/20 blur-[100px]"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.15, 0.2, 0.15],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 2,
                    }}
                    className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full bg-fuchsia-500/20 blur-[100px]"
                />

                {/* Grain Texture */}
                <div className="absolute inset-0 opacity-[0.015] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNhKSIvPjwvc3ZnPg==')] mix-blend-overlay" />
            </div>

            {/* Card Container */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="relative w-full max-w-md z-10"
            >
                <div className="bg-[#0a0a0f]/60 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden group">

                    {/* Hover Gradient Border Effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-fuchsia-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                    {/* Header */}
                    <div className="text-center mb-8 relative z-10">
                        {/* Logo/Icon */}
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                            className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/20"
                        >
                            <Sparkles className="w-8 h-8 text-white" />
                        </motion.div>

                        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight" style={{ fontFamily: '"SF Pro Display", sans-serif' }}>
                            {title}
                        </h1>
                        <p className="text-white/40 text-sm">
                            {subtitle}
                        </p>
                    </div>

                    {/* Content */}
                    <div className="relative z-10">
                        {children}
                    </div>

                    {/* Back Link */}
                    <div className="mt-8 text-center relative z-10">
                        <Link
                            to={backLink}
                            className="inline-flex items-center gap-2 text-sm text-white/30 hover:text-white transition-colors duration-300 group/back"
                        >
                            <ArrowLeft className="w-4 h-4 group-hover/back:-translate-x-1 transition-transform" />
                            Back to Home
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default AuthCard;
