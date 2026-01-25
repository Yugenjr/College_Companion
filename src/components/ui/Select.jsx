import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

const Select = ({ value, onChange, options, placeholder = "Select an option", className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);

  const selectedOption = options.find(option => option.value === value) || { label: placeholder };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (option) => {
    onChange(option.value);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={selectRef}>
      <button
        type="button"
        className="w-full flex items-center justify-between px-4 py-3 bg-bgDark3/50 border border-glassBorder rounded-neon text-white hover:border-neonPurple transition-all duration-300 focus:outline-none focus:border-neonPurple focus:shadow-neon-purple"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className={`${value ? 'text-white' : 'text-white/40'}`}>
          {selectedOption.label}
        </span>
        <ChevronDown 
          className={`w-4 h-4 ml-2 text-white/60 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-bgDark3/95 backdrop-blur-sm border border-glassBorder rounded-neon shadow-lg overflow-hidden">
          <ul 
            role="listbox"
            className="py-2 max-h-60 overflow-y-auto scrollbar-neon"
          >
            {options.map((option) => (
              <li
                key={option.value}
                role="option"
                aria-selected={value === option.value}
                className={`px-4 py-2 cursor-pointer transition-colors duration-200 hover:bg-neonPurple/20 ${
                  value === option.value 
                    ? 'bg-neonPurple/30 text-neonPurple' 
                    : 'text-white/80 hover:text-white'
                }`}
                onClick={() => handleSelect(option)}
              >
                {option.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Select;