import { useEffect } from 'react';
import LandingNavbar from '../components/LandingNavbar';
import LandingFooter from '../components/LandingFooter';
import BackToTop from '../components/BackToTop';
import FAQSection from './Landing/FAQSection';

const FAQ = () => {
    // debug log so we can see when the FAQ component actually mounts
    console.log('FAQ component rendered');

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-[#050505] relative overflow-hidden selection:bg-blue-500/30">
            
            {/* Global grain texture overlay */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-[60] mix-blend-overlay">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNhKSIvPjwvc3ZnPg==')]" />
            </div>

            <LandingNavbar />

            <div className="pt-24 max-w-4xl mx-auto px-6 py-16 text-white">
                <h1 className="text-4xl font-bold text-center mb-12">
                    Frequently Asked Questions
                </h1>

                <FAQSection />
            </div>

            <LandingFooter />
            <BackToTop />
        </div>
    );
};

export default FAQ;