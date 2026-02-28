

import { useTheme } from '../contexts/ThemeContext';
import { useLocation } from 'react-router-dom';
import '../styles/ThemeToggle.css';

function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();
    const location = useLocation();

    // Only show toggle on landing page
    if (location.pathname !== '/') {
        return null;
    }

    return (
        <button
            onClick={toggleTheme}
            className="theme-toggle"
            aria-label="Toggle theme"
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
            <span className="theme-toggle-icon">
                {theme === 'dark' ? '🌙' : '☀️'}
            </span>
        </button>
    );
}

export default ThemeToggle;