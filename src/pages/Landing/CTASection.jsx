import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

const CTASection = () => {
    const navigate = useNavigate();

    return (
        <section className="relative py-32 bg-dark-deep overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 relative">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="relative bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[3rem] p-12 md:p-24 overflow-hidden text-center"
                >
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/20 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2" />

                    <div className="relative z-10 space-y-8">
                        <motion.h2
                            initial={{ scale: 0.9 }}
                            whileInView={{ scale: 1 }}
                            className="text-4xl md:text-7xl font-black text-white font-outfit leading-tight"
                        >
                            Ready to Transform <br />
                            Your College Life?
                        </motion.h2>
                        <p className="text-xl text-white/80 max-w-2xl mx-auto font-medium">
                            Join 25,000+ students already using AI to stay ahead of the curve.
                            Start your success journey today.
                        </p>
                        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-6">
                            <button
                                onClick={() => navigate('/register')}
                                className="px-10 py-5 bg-white text-indigo-700 rounded-[2rem] text-xl font-bold hover:scale-105 transition-all shadow-2xl flex items-center gap-2"
                            >
                                Get Started Free
                                <ArrowRight className="w-6 h-6" />
                            </button>
                            <div className="flex items-center gap-2 text-white/80 font-bold">
                                <Sparkles className="w-5 h-5 text-amber-300" />
                                No Credit Card Required
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default CTASection;
