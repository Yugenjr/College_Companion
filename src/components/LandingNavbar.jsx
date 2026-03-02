import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Sparkles, Menu, X } from 'lucide-react';

const LandingNavbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [hoveredTab, setHoveredTab] = useState(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Handle scroll for anchor links
    const handleNavClick = (e, href) => {
        if (href.startsWith('/#')) {
            e.preventDefault();
            const id = href.replace('/#', '');

            if (location.pathname === '/') {
                // If already on home, just scroll
                const element = document.getElementById(id);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            } else {
                // If on another page, navigate home first then scroll
                navigate('/', { state: { scrollTo: id } });
            }
            setIsMobileMenuOpen(false);
        }
    };

    // Listen for cross-page scroll requests
    useEffect(() => {
        if (location.pathname === '/' && location.state?.scrollTo) {
            const id = location.state.scrollTo;
            setTimeout(() => {
                const element = document.getElementById(id);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
                // Clear state to avoid scrolling again on back button
                window.history.replaceState({}, document.title);
            }, 100);
        }
    }, [location]);

    const navLinks = [
        { name: 'Features', href: '/#features' },
        { name: 'How it Works', href: '/#how-it-works' },
        { name: 'Pricing', href: '/pricing' },
        { name: 'FAQ', href: '/faq' }
    ];

    const isActivePage = location.pathname;
    return (
        <nav className={`fixed top-0 inset-x-0 z-[100] transition-all duration-500 border-b ${isScrolled
            ? 'py-4 backdrop-blur-xl bg-black/70 border-white/10'
            : 'py-6 bg-transparent border-transparent'
            }`}>
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                {/* Logo Section */}
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:rotate-6 transition-transform">
                        <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xl font-bold tracking-tight text-white font-outfit leading-tight">College Companion</span>
                        <span className="text-[10px] font-black text-blue-400 tracking-[0.2em] uppercase leading-none">AI Powered</span>
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-1 glass-card-premium px-2 py-1.5 rounded-2xl border-white/5 bg-white/[0.02]">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.href}
                            onClick={(e) => handleNavClick(e, link.href)}
                            onMouseEnter={() => setHoveredTab(link.name)}
                            onMouseLeave={() => setHoveredTab(null)}
                            className={`relative px-5 py-2 text-sm font-medium transition-colors duration-300 group ${(isActivePage === link.href || hoveredTab === link.name) ? 'text-white' : 'text-white/40'
                                }`}
                        >
                            <span className="relative z-10">{link.name}</span>

                            {(hoveredTab === link.name || isActivePage === link.href) && (
                                <motion.div
                                    layoutId="nav-pill"
                                    className="absolute inset-0 bg-white/[0.06] rounded-xl -z-0 shadow-inner"
                                    initial={false}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ type: "spring", bounce: 0, duration: 0.3 }}
                                />
                            )}
                        </Link>
                    ))}
                </div>

                {/* Desktop Actions */}
                <div className="hidden md:flex items-center gap-3">
                    <button
                        onClick={() => navigate('/login')}
                        className="px-5 py-2.5 text-sm font-bold text-white/60 hover:text-white transition-all rounded-xl"
                    >
                        Log in
                    </button>
                    <button
                        onClick={() => navigate('/register')}
                        className="relative group px-6 py-2.5 rounded-xl text-sm font-bold text-white overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 transition-transform group-hover:scale-105" />
                        <span className="relative z-10">Get Started</span>
                    </button>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden p-2 text-white/60 hover:text-white"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden border-t border-white/5 bg-black/90 backdrop-blur-3xl overflow-hidden"
                    >
                        <div className="p-6 space-y-6">
                            <div className="flex flex-col gap-4">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.name}
                                        to={link.href}
                                        onClick={(e) => handleNavClick(e, link.href)}
                                        className="text-lg font-bold text-white/60 hover:text-white"
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                            </div>
                            <div className="pt-6 border-t border-white/5 flex flex-col gap-4">
                                <button
                                    onClick={() => { navigate('/login'); setIsMobileMenuOpen(false); }}
                                    className="w-full py-4 rounded-2xl bg-white/5 text-white font-bold"
                                >
                                    Log in
                                </button>
                                <button
                                    onClick={() => { navigate('/register'); setIsMobileMenuOpen(false); }}
                                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold"
                                >
                                    Join Now
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default LandingNavbar;
