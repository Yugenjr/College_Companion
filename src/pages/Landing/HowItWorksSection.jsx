import { motion } from 'framer-motion';
import { UserPlus, CloudUpload, Zap, GraduationCap } from 'lucide-react';

const HowItWorksSection = () => {
    const steps = [
        {
            num: "01",
            title: "Join the Squad",
            desc: "Create your account in seconds with Google or email. No fancy setup required.",
            icon: UserPlus,
            color: "from-blue-500 to-indigo-500"
        },
        {
            num: "02",
            title: "Sync Your Data",
            desc: "Upload your syllabus or current attendance status. Our AI starts analyzing immediately.",
            icon: CloudUpload,
            color: "from-purple-500 to-pink-500"
        },
        {
            num: "03",
            title: "Generate Success",
            desc: "Get AI-generated questions, summaries, and personalized study schedules.",
            icon: Zap,
            color: "from-orange-500 to-red-500"
        },
        {
            num: "04",
            title: "Crush Your Exams",
            desc: "Stay ahead with real-time tracking and collaborative study sessions.",
            icon: GraduationCap,
            color: "from-teal-500 to-green-500"
        }
    ];

    return (
        <section id="how-it-works" className="relative py-32 bg-dark-deep overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid lg:grid-cols-2 gap-20 items-center">
                    {/* Left Side: Illustration / UI */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="relative"
                    >
                        <div className="absolute -inset-10 bg-indigo-500/20 blur-[100px] rounded-full" />
                        <div className="relative glass-card-premium p-4 md:p-8 rounded-[3rem] border-white/10 shadow-2xl">
                            <div className="bg-black/40 rounded-[2rem] p-6 md:p-10 border border-white/5 space-y-8">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-xl font-bold text-white font-outfit">AI Integration</h4>
                                    <div className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-[10px] font-bold uppercase">Processing...</div>
                                </div>
                                <div className="space-y-4">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="flex gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex-shrink-0" />
                                            <div className="flex-1 space-y-2">
                                                <div className="h-2 w-3/4 bg-white/10 rounded-full" />
                                                <div className="h-2 w-1/2 bg-white/5 rounded-full" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="pt-8 border-t border-white/5">
                                    <div className="h-12 w-full btn-premium-primary rounded-xl flex items-center justify-center font-bold text-white">
                                        Analyze Academic Data
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Side: Steps */}
                    <div className="space-y-12">
                        <div className="space-y-4">
                            <h2 className="text-4xl md:text-5xl font-bold text-white font-outfit">Study Smarter In Four <br /> Simple Steps</h2>
                            <p className="text-white/40 max-w-md">We've automated the boring parts of college so you can focus on what actually matters.</p>
                        </div>

                        <div className="space-y-8">
                            {steps.map((step, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: i * 0.1 }}
                                    className="flex gap-6 group"
                                >
                                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} p-[1px] flex-shrink-0 group-hover:scale-110 transition-transform`}>
                                        <div className="w-full h-full rounded-2xl bg-dark-deep flex items-center justify-center">
                                            <step.icon className="w-6 h-6 text-white" />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs font-black text-indigo-400 opacity-50">{step.num}</span>
                                            <h4 className="text-xl font-bold text-white font-outfit">{step.title}</h4>
                                        </div>
                                        <p className="text-white/40 text-sm leading-relaxed max-w-sm">{step.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HowItWorksSection;