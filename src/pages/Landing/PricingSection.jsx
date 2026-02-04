import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Sparkles, Zap, GraduationCap, ArrowRight, Star } from 'lucide-react';

const PricingSection = () => {
    const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' or 'yearly'

    const plans = [
        {
            name: "Free",
            monthlyPrice: "0",
            yearlyPrice: "0",
            description: "Essential tools for every student to get started with AI.",
            features: ["Basic Attendance Tracking", "Manual Syllabus Upload", "5 AI Questions / Day", "Public Community Access"],
            btnText: "Get Started",
            btnStyle: "bg-white/5 border border-white/10 hover:bg-white/10",
            icon: Zap,
            color: "blue"
        },
        {
            name: "Pro Student",
            monthlyPrice: "49",
            yearlyPrice: "39",
            description: "Advanced AI features to supercharge your academic success.",
            features: [
                "AI Predictive Attendance",
                "Smart Syllabus Scanner",
                "Unlimited AI Questions",
                "Priority Dashboard access",
                "Personal Study Roadmap",
                "Real-time AI Tutoring"
            ],
            btnText: "Go Pro Now",
            btnStyle: "btn-premium-primary text-white",
            highlight: true,
            icon: Sparkles,
            color: "indigo"
        },
        {
            name: "College Enterprise",
            monthlyPrice: "Custom",
            yearlyPrice: "Custom",
            description: "For institutions and large student groups needing control.",
            features: [
                "Bulk User Management",
                "Institutional Analytics",
                "Custom Resource Portal",
                "24/7 Priority Support",
                "White-labeled Dashboard"
            ],
            btnText: "Contact Sales",
            btnStyle: "bg-white/5 border border-white/10 hover:bg-white/10",
            icon: GraduationCap,
            color: "purple"
        }
    ];

    return (
        <section id="pricing" className="relative pt-16 pb-32 bg-[#050505] overflow-hidden">
            {/* Ambient Background Elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none opacity-50" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none opacity-30" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="flex flex-col items-center text-center space-y-6 mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/60 text-xs font-black tracking-[0.2em] uppercase"
                    >
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                        Professional Plans
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-black text-white font-outfit tracking-tight"
                    >
                        Simple <span className="text-white/20 italic">Pricing,</span> <br />
                        <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">Powerfully Advanced.</span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-white/40 max-w-2xl mx-auto text-lg font-medium"
                    >
                        Whether you're an individual student or an entire university department, we have a plan that matches your ambition.
                    </motion.p>

                    {/* Billing Toggle */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="flex items-center gap-4 p-1 rounded-2xl bg-white/5 border border-white/10 mt-8"
                    >
                        <button
                            onClick={() => setBillingCycle('monthly')}
                            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${billingCycle === 'monthly' ? 'bg-white text-black' : 'text-white/40 hover:text-white'}`}
                        >
                            Monthly
                        </button>
                        <button
                            onClick={() => setBillingCycle('yearly')}
                            className={`relative px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${billingCycle === 'yearly' ? 'bg-white text-black' : 'text-white/40 hover:text-white'}`}
                        >
                            Yearly
                            <span className="absolute -top-3 -right-4 px-2 py-0.5 rounded-md bg-green-500 text-[9px] font-black text-white uppercase tracking-tighter">Save 20%</span>
                        </button>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
                    {plans.map((plan, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                            className={`relative group flex flex-col h-full ${plan.highlight ? 'z-20' : 'z-10'}`}
                        >
                            {plan.highlight && (
                                <div className="absolute -top-5 inset-x-0 flex justify-center">
                                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-[1px] rounded-full shadow-[0_0_20px_rgba(59,130,246,0.5)]">
                                        <span className="block bg-black text-white text-[10px] font-black uppercase tracking-widest px-6 py-2 rounded-full">
                                            Most Popular Choice
                                        </span>
                                    </div>
                                </div>
                            )}

                            <div className={`flex flex-col h-full glass-card-premium p-10 rounded-[3rem] border transition-all duration-700 ${plan.highlight
                                ? 'border-indigo-500/40 bg-indigo-500/[0.04] shadow-[0_0_80px_rgba(79,70,229,0.15)] scale-105 md:scale-110'
                                : 'border-white/5 hover:border-white/20'
                                }`}>
                                <div className="space-y-8 flex-1">
                                    <div className="flex items-center justify-between">
                                        <div className={`w-14 h-14 rounded-2xl bg-${plan.color}-500/10 flex items-center justify-center text-${plan.color}-400 border border-${plan.color}-500/20`}>
                                            <plan.icon className="w-7 h-7" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-white font-outfit tracking-tight">{plan.name}</h3>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-baseline gap-2">
                                            <AnimatePresence mode="wait">
                                                <motion.span
                                                    key={billingCycle}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    className="text-5xl font-black text-white font-outfit tracking-tighter"
                                                >
                                                    {plan.monthlyPrice === "Custom" ? "Custom" : `₹${billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice}`}
                                                </motion.span>
                                            </AnimatePresence>
                                            {plan.monthlyPrice !== "Custom" && <span className="text-white/40 text-lg font-medium">/mo</span>}
                                        </div>
                                        <p className="text-sm text-white/40 leading-relaxed font-medium min-h-[40px]">
                                            {plan.description}
                                        </p>
                                    </div>

                                    <div className="space-y-5 pt-8 border-t border-white/5">
                                        {plan.features.map((feature, idx) => (
                                            <div key={idx} className="flex items-center gap-4 group/item">
                                                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center border border-green-500/20 group-hover/item:bg-green-500/20 transition-colors">
                                                    <Check className="w-3 h-3 text-green-400" />
                                                </div>
                                                <span className="text-sm text-white/60 font-medium group-hover/item:text-white transition-colors">{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <button className={`w-full mt-12 py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all duration-500 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 group/btn ${plan.btnStyle}`}>
                                    {plan.btnText}
                                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Trust Badges */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-24 flex flex-wrap justify-center items-center gap-x-12 gap-y-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-1000"
                >
                    <span className="text-sm font-bold text-white tracking-widest uppercase">Trusted by 50+ Institutions</span>
                    <div className="h-px w-12 bg-white/10 hidden md:block" />
                    <span className="text-sm font-bold text-white tracking-widest uppercase">Secure AES-256 Data Entry</span>
                    <div className="h-px w-12 bg-white/10 hidden md:block" />
                    <span className="text-sm font-bold text-white tracking-widest uppercase">24/7 Academic Support</span>
                </motion.div>
            </div>
        </section>
    );
};

export default PricingSection;
