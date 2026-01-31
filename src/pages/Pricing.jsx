import { useEffect } from 'react';
import LandingNavbar from '../components/LandingNavbar';
import PricingSection from './Landing/PricingSection';
import LandingFooter from '../components/LandingFooter';
import BackToTop from '../components/BackToTop';

const Pricing = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-[#050505] relative overflow-hidden selection:bg-blue-500/30">
            {/* Global grain texture overlay */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-[60] mix-blend-overlay">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNhKSIvPjwvc3ZnPg==')]" />
            </div>

            <LandingNavbar />
            <div className="pt-12"> {/* Reduced offset for fixed navbar */}
                <PricingSection />
            </div>
            <LandingFooter />
            <BackToTop />
        </div>
    );
};

export default Pricing;
