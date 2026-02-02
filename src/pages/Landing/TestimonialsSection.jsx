import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

const TestimonialsSection = () => {
    const testimonials = [
        {
            name: "Rahul Sharma",
            role: "CSE Student, IIT Delhi",
            text: "College Companion saved my attendance from falling below 75%. The AI predictions are spookily accurate!",
            avatar: "RS"
        },
        {
            name: "Ananya Iyer",
            role: "Final Year, BITS Pilani",
            text: "The Question Generator is a godsend for last-minute exam prep. It's like having a personal tutor 24/7.",
            avatar: "AI"
        },
        {
            name: "Kartik Mehta",
            role: "Sophomore, VIT",
            text: "Study Arena makes collaborative learning so much easier. We use it for every group project now.",
            avatar: "KM"
        }
    ];

    return (
        <section className="relative py-32 bg-dark-deep">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-20 space-y-4">
                    <h2 className="text-4xl md:text-5xl font-bold text-white font-outfit">What Our Students Say</h2>
                    <p className="text-white/40">Join thousands of students who are excelling with AI.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {testimonials.map((t, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, delay: i * 0.1 }}
                            className="glass-card-premium p-8 rounded-[2.5rem] relative"
                        >
                            <Quote className="absolute top-8 right-8 w-10 h-10 text-white/5" />
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-white shadow-lg">
                                    {t.avatar}
                                </div>
                                <div>
                                    <h4 className="font-bold text-white">{t.name}</h4>
                                    <p className="text-xs text-white/40">{t.role}</p>
                                </div>
                            </div>
                            <p className="text-white/60 leading-relaxed italic">"{t.text}"</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TestimonialsSection;
