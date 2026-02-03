import ThemeToggle from '../components/ThemeToggle';
import HeroSection from './Landing/HeroSection';
import StatsSection from './Landing/StatsSection';
import FeaturesSection from './Landing/FeaturesSection';
import HowItWorksSection from './Landing/HowItWorksSection';
import LandingFooter from './Landing/LandingFooter';

const Landing = () => {
    return (
        <div className="min-h-screen bg-[#0a0a0f] relative overflow-hidden" >
            <ThemeToggle />
            {/* Global grain texture overlay */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.015] z-50 mix-blend-overlay">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNhKSIvPjwvc3ZnPg==')]" />
            </div>

            <HeroSection />
            <StatsSection />
            <FeaturesSection />
            <HowItWorksSection />
            <LandingFooter />
        </div>
    );
};

export default Landing;
