import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, Twitter, Github, Linkedin, Mail, Heart } from 'lucide-react';

const LandingFooter = () => {
    return (
        <footer className="relative bg-[#050505] border-t border-white/5 pt-16 pb-8 overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[300px] bg-blue-600/5 blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-12">
                    {/* Brand Section */}
                    <div className="lg:col-span-5 space-y-6">
                        <Link to="/" className="flex items-center gap-3 group">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform">
                                <Sparkles className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold tracking-tight text-white font-outfit">College Companion</span>
                        </Link>
                        <p className="text-sm text-white/40 leading-relaxed max-w-xs font-medium">
                            Empowering students with AI-driven tools to excel in their academic journey. Automate, collaborate, and succeed.
                        </p>
                    </div>

                    {/* Links Sections */}
                    <div className="lg:col-span-2 space-y-4">
                        <h4 className="text-sm font-bold text-white uppercase tracking-widest text-glow-blue">Platform</h4>
                        <ul className="space-y-3">
                            {[
                                { name: 'Features', href: '/#features' },
                                { name: 'How it Works', href: '/#how-it-works' },
                                { name: 'Pricing', href: '/pricing' },
                            ].map(item => (
                                <li key={item.name}>
                                    <Link to={item.href} className="text-sm text-white/40 hover:text-white transition-colors font-medium">
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="lg:col-span-2 space-y-4">
                        <h4 className="text-sm font-bold text-white uppercase tracking-widest text-glow-blue">Resources</h4>
                        <ul className="space-y-3">
                            {['Documentation', 'API Reference', 'Support'].map(item => (
                                <li key={item}>
                                    <a href="#" className="text-sm text-white/40 hover:text-white transition-colors font-medium">
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="lg:col-span-3 space-y-4">
                        <h4 className="text-sm font-bold text-white uppercase tracking-widest text-glow-blue">Legal</h4>
                        <ul className="space-y-3">
                            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(item => (
                                <li key={item}>
                                    <a href="#" className="text-sm text-white/40 hover:text-white transition-colors font-medium">
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
                    <p className="text-sm text-white/40 flex items-center gap-2 font-medium">
                        © 2026 College Companion. Made with <Heart className="w-4 h-4 text-rose-500 fill-rose-500 animate-pulse" /> by Students.
                    </p>
                    <div className="flex items-center gap-4">
                        {[
                            { Icon: Twitter, label: 'Twitter', href: '#' },
                            { Icon: Github, label: 'Github', href: 'https://github.com/Chirag1724/College_Companion' },
                            { Icon: Linkedin, label: 'Linkedin', href: '#' },
                            { Icon: Mail, label: 'Mail', href: 'mailto:contact@collegecompanion.ai' }
                        ].map((item, i) => (
                            <a key={i} href={item.href} target="_blank" rel="noopener noreferrer" aria-label={item.label} className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/20 hover:text-white hover:bg-indigo-500/20 transition-all">
                                {item.Icon && <item.Icon className="w-4 h-4" />}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default LandingFooter;
