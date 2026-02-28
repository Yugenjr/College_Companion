import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, CheckCircle2, Zap, Layout, BookOpen, Users } from 'lucide-react';
import dashboardPreview from '../../assets/dashboard-image.webp';

const HeroSection = () => {
    const navigate = useNavigate();

    return (
        <section className="relative pt-32 pb-20 overflow-hidden bg-black">
            {/* Background elements */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-blue-600/10 blur-[120px] rounded-full opacity-50" />
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-600/10 blur-[100px] rounded-full opacity-30" />
                <div className="absolute top-1/2 -right-24 w-80 h-80 bg-purple-600/10 blur-[100px] rounded-full opacity-20" />
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md"
                >
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    <span className="text-[10px] sm:text-xs font-black text-white/70 uppercase tracking-[0.2em] flex items-center gap-2">
                        <Sparkles className="w-3 h-3 text-blue-400" />
                        Next-Gen Academic Assistant
                    </span>
                </motion.div>

                {/* Heading */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-5xl md:text-8xl font-black text-white font-outfit tracking-tight leading-[1.05] mb-8"
                >
                    Master Your Studies <br />
                    <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                        With AI Intelligence
                    </span>
                </motion.h1>

                {/* Description */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-white/40 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed mb-12"
                >
                    The ultimate all-in-one platform for students. Automate attendance,
                    generate exam questions, and collaborate in real-time.
                </motion.p>

                {/* CTAs */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-24"
                >
                    <button
                        onClick={() => navigate('/register')}
                        className="group relative px-8 py-4 rounded-2xl bg-white text-black font-bold flex items-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-[0_20px_40px_rgba(255,255,255,0.1)] overflow-hidden"
                    >
                        Launch Your Dashboard
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button
                        onClick={() => {
                            document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all active:scale-95"
                    >
                        See how it works
                    </button>
                </motion.div>

                {/* Hero Dashboard Mockup Area */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 1 }}
                    className="relative max-w-5xl mx-auto"
                >
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-[80%] h-20 bg-blue-500/20 blur-[60px] rounded-full" />

                    {/* Floating Status Badge */}
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-20 px-4 py-1.5 rounded-full bg-black/80 backdrop-blur-xl border border-white/10 flex items-center gap-3">
                        <div className="flex items-center gap-2">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                            </span>
                            <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Scanning Academic Data:</span>
                        </div>
                        <span className="text-[10px] font-black text-blue-400">24 sources analyzed</span>
                    </div>

                    <div className="relative glass-card-premium rounded-[2.5rem] border-white/10 overflow-hidden shadow-2xl p-1 bg-white/[0.02]">
                        <div className="relative bg-black/40 rounded-[2.2rem] overflow-hidden border border-white/5 aspect-[16/9] flex items-center justify-center group">
                            {/* Scanning Laser Effect */}
                            <motion.div
                                initial={{ top: "-10%" }}
                                animate={{ top: "110%" }}
                                transition={{
                                    duration: 4,
                                    repeat: Infinity,
                                    ease: "linear"
                                }}
                                className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent z-10 opacity-50 shadow-[0_0_15px_rgba(59,130,246,1)] pointer-events-none"
                            />

                            <img
                                src={dashboardPreview}
                                alt="College Companion Dashboard"
                                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105"
                            />
                        </div>
                    </div>

                    {/* Decorative side cards */}
                    <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute hidden lg:block -left-12 bottom-1/4 p-6 glass-card text-left space-y-3 w-64 border-white/10 backdrop-blur-2xl"
                    >
                        <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                            <Zap className="w-5 h-5 text-blue-400" />
                        </div>
                        <h4 className="font-bold text-white text-sm">Attendance Sync</h4>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full w-3/4 bg-blue-500 rounded-full" />
                        </div>
                        <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">88% Accuracy</p>
                    </motion.div>

                    <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                        className="absolute hidden lg:block -right-12 top-1/4 p-6 glass-card text-left space-y-3 w-64 border-white/10 backdrop-blur-2xl"
                    >
                        <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                            <BookOpen className="w-5 h-5 text-purple-400" />
                        </div>
                        <h4 className="font-bold text-white text-sm">Smart Questions</h4>
                        <div className="flex -space-x-2">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="w-6 h-6 rounded-full border-2 border-black bg-gradient-to-br from-indigo-500 to-purple-500" />
                            ))}
                            <div className="w-6 h-6 rounded-full border-2 border-black bg-white/5 flex items-center justify-center text-[8px] font-bold text-white/40">+12</div>
                        </div>
                        <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">New Mock Test Ready</p>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default HeroSection;
