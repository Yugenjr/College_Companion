import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Home, Rocket, ChevronLeft } from 'lucide-react';

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden px-6">
            {/* Background Gradient Orbs - matching HeroSection vibe */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-blue-600/10 blur-[120px] rounded-full opacity-50" />
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-600/10 blur-[100px] rounded-full opacity-30" />
                <div className="absolute top-1/2 -right-24 w-80 h-80 bg-purple-600/10 blur-[100px] rounded-full opacity-20" />
            </div>

            {/* Stars/Dust particles */}
            {[...Array(20)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-white rounded-full opacity-20"
                    initial={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        scale: Math.random()
                    }}
                    animate={{
                        opacity: [0.2, 0.8, 0.2],
                        scale: [1, 1.5, 1],
                    }}
                    transition={{
                        duration: 3 + Math.random() * 4,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                />
            ))}

            <div className="relative z-10 text-center">
                {/* 404 number with glow */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="relative"
                >
                    <h1 className="text-9xl md:text-[15rem] font-black font-outfit tracking-tighter leading-none select-none">
                        <span className="bg-gradient-to-b from-white via-white/50 to-transparent bg-clip-text text-transparent">
                            404
                        </span>
                    </h1>
                    {/* Glow effect */}
                    <div className="absolute inset-0 blur-3xl bg-blue-500/20 -z-10 scale-150" />
                </motion.div>

                {/* Astronaut / Icon animation */}
                <motion.div
                    animate={{
                        y: [0, -20, 0],
                        rotate: [0, 5, 0, -5, 0]
                    }}
                    transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="mb-8 flex justify-center"
                >
                    <div className="relative">
                        <Rocket className="w-16 h-16 text-blue-400 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                        <motion.div
                            className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-4 h-8 bg-gradient-to-t from-transparent via-orange-500 to-blue-400 blur-sm opacity-50 rounded-full"
                            animate={{ scaleY: [1, 1.5, 1], opacity: [0.5, 0.8, 0.5] }}
                            transition={{ duration: 0.2, repeat: Infinity }}
                        />
                    </div>
                </motion.div>

                {/* Text Content */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-4"
                >
                    <h2 className="text-3xl md:text-5xl font-bold text-white font-outfit tracking-tight">
                        Lost in Space?
                    </h2>
                    <p className="text-white/40 text-lg md:text-xl max-w-md mx-auto font-medium leading-relaxed">
                        The page you're looking for has drifted beyond our reach. Let's get you back to base.
                    </p>
                </motion.div>

                {/* CTA Button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-12"
                >
                    <button
                        onClick={() => navigate('/')}
                        className="group relative px-8 py-4 rounded-2xl bg-white text-black font-bold flex items-center gap-3 mx-auto hover:scale-105 active:scale-95 transition-all shadow-[0_20px_40px_rgba(255,255,255,0.1)] overflow-hidden"
                    >
                        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        Go Back Home
                        <Home className="w-5 h-5 ml-1" />
                    </button>

                    {/* Secondary Link */}
                    <button
                        onClick={() => navigate(-1)}
                        className="mt-6 text-white/40 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest"
                    >
                        Go Back
                    </button>
                </motion.div>
            </div>

            {/* Scanning line effect like Hero Section */}
            <motion.div
                initial={{ top: "-10%" }}
                animate={{ top: "110%" }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "linear"
                }}
                className="absolute inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/30 to-transparent z-0 pointer-events-none"
            />
        </div>
    );
};

export default NotFound;
