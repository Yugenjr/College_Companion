import { motion } from 'framer-motion';
import { Heart, Github, Linkedin, Mail } from 'lucide-react';
import { FaXTwitter, FaDiscord } from 'react-icons/fa6';
import logo from '../../assets/logo.png';




const LandingFooter = () => {
    const currentYear = new Date().getFullYear();

    const quickLinks = [
        { name: 'Features', href: '#features' },
        { name: 'How It Works', href: '#how-it-works' },
        { name: 'About', href: '#' },
    ];

    const resources = [
        { name: 'Documentation', href: '#' },
        { name: 'Support', href: '#' },
        { name: 'GitHub', href: 'https://github.com/Yugenjr/College_Companion' },
    ];

    return (
        <footer className="relative border-t border-white/[0.06] bg-[#0a0a0f]/80 backdrop-blur-2xl">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

                    {/* Brand */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center gap-3 mb-6 group">
                            <img
                                src={logo}
                                alt="College Companion Logo"
                                className="w-14 h-14 object-contain flex-shrink-0 drop-shadow-[0_2px_12px_rgba(124,58,237,0.5)]"
                            />
                            <div>
                                <div className="text-lg font-bold text-white" style={{ fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif' }}>
                                    College Companion
                                </div>
                                <div className="text-[10px] text-white/30 uppercase tracking-[0.15em] font-semibold">
                                    Academic Excellence Platform
                                </div>
                            </div>
                        </div>
                        <p className="text-white/40 text-sm leading-relaxed mb-8 max-w-md" style={{ fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif' }}>
                            Transform your academic journey with AI-powered tools designed for modern college students. Track attendance, study smarter, and collaborate better—all in one elegant platform.
                        </p>
                        <a
                            href="https://github.com/Yugenjr/College_Companion"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2.5 px-5 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white/60 hover:text-white hover:bg-white/[0.08] hover:border-white/[0.12] transition-all duration-300 font-semibold"
                            style={{ fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif' }}
                        >
                            <Github className="w-4 h-4" strokeWidth={2.5} />
                            <span>Star on GitHub</span>
                        </a>
                        <div className="flex items-center gap-3 mt-6">
                            <a
                                href="https://twitter.com/yourusername"
                                target="_blank"
                                className="w-11 h-11 rounded-xl flex items-center justify-center
                   bg-white/[0.04] border border-white/[0.08]
                   text-white/50 hover:text-white
                   hover:border-violet-400/40 hover:bg-white/[0.08]
                   transition-all duration-300"
                                aria-label="X"
                            >
                                <FaXTwitter className="text-[18px]" />
                            </a>

                            <a
                                href="https://linkedin.com/in/yourprofile"
                                target="_blank"
                                className="w-11 h-11 rounded-xl flex items-center justify-center
                   bg-white/[0.04] border border-white/[0.08]
                   text-white/50 hover:text-white
                   hover:border-violet-400/40 hover:bg-white/[0.08]
                   transition-all duration-300"
                                aria-label="LinkedIn"
                            >
                                <Linkedin className="w-5 h-5" />
                            </a>

                            <a
                                href="mailto:yourmail@gmail.com"
                                className="w-11 h-11 rounded-xl flex items-center justify-center
                   bg-white/[0.04] border border-white/[0.08]
                   text-white/50 hover:text-white
                   hover:border-violet-400/40 hover:bg-white/[0.08]
                   transition-all duration-300"
                                aria-label="Email"
                            >
                                <Mail className="w-5 h-5" />
                            </a>

                            <a
                                href="https://discord.gg/yourinvite"
                                target="_blank"
                                className="w-11 h-11 rounded-xl flex items-center justify-center
                   bg-white/[0.04] border border-white/[0.08]
                   text-white/50 hover:text-white
                   hover:border-violet-400/40 hover:bg-white/[0.08]
                   transition-all duration-300"
                                aria-label="Discord"
                            >
                                <FaDiscord className="text-[18px]" />
                            </a>
                        </div>


                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-bold mb-6 text-sm uppercase tracking-[0.15em]" style={{ fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif' }}>
                            Quick Links
                        </h3>
                        <ul className="space-y-4">
                            {quickLinks.map((link) => (
                                <li key={link.name}>
                                    <a
                                        href={link.href}
                                        className="text-white/40 hover:text-white text-sm transition-colors font-semibold inline-block hover:translate-x-1 duration-300"
                                        style={{ fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif' }}
                                    >
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h3 className="text-white font-bold mb-6 text-sm uppercase tracking-[0.15em]" style={{ fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif' }}>
                            Resources
                        </h3>
                        <ul className="space-y-4">
                            {resources.map((link) => (
                                <li key={link.name}>
                                    <a
                                        href={link.href}
                                        target={link.href.startsWith('http') ? '_blank' : undefined}
                                        rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                                        className="text-white/40 hover:text-white text-sm transition-colors font-semibold inline-block hover:translate-x-1 duration-300"
                                        style={{ fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif' }}
                                    >
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent mb-10" />

                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <p className="text-white/20 text-sm font-semibold" style={{ fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif' }}>
                        © {currentYear} College Companion. All rights reserved.
                    </p>
                    <div className="flex items-center gap-2 text-sm text-white/30 font-semibold" style={{ fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif' }}>
                        <span>Made with</span>
                        <Heart className="w-4 h-4 fill-pink-500 text-pink-500" strokeWidth={2.5} />
                        <span>for contributors</span>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-violet-500/20 via-fuchsia-500/20 to-pink-500/20" />
        </footer>
    );
};

export default LandingFooter;