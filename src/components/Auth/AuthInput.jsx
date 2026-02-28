import { useState } from "react";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Reusable Auth Input component
 * Features: Icons, Floating label style logic, Password toggle, Error display
 */
const AuthInput = ({
    label,
    type = "text",
    name,
    value,
    onChange,
    placeholder,
    icon: Icon,
    error,
    disabled = false,
    ...props
}) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const inputType = isPassword ? (showPassword ? "text" : "password") : type;

    return (
        <div className="w-full space-y-2">
            <label className="text-xs font-semibold text-white/50 ml-1">
                {label}
            </label>
            <div className="relative group">
                {/* Icon */}
                {Icon && (
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-blue-400 transition-colors">
                        <Icon className="w-5 h-5" />
                    </div>
                )}

                {/* Input Field */}
                <input
                    type={inputType}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    disabled={disabled}
                    className={`
                        w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5
                        ${Icon ? "pl-11" : ""}
                        ${isPassword ? "pr-11" : ""}
                        text-sm text-white placeholder:text-white/20
                        focus:outline-none focus:border-blue-500/50 focus:bg-white/10
                        hover:border-white/20
                        transition-all duration-300
                        disabled:opacity-50 disabled:cursor-not-allowed
                        ${error ? '!border-red-500/50 !bg-red-500/5' : ''}
                    `}
                    {...props}
                />

                {/* Password Toggle */}
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors focus:outline-none"
                    >
                        {showPassword ? (
                            <EyeOff className="w-5 h-5" />
                        ) : (
                            <Eye className="w-5 h-5" />
                        )}
                    </button>
                )}
            </div>

            {/* Error Message */}
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="flex items-center gap-2 text-red-400 text-xs ml-1"
                    >
                        <AlertCircle className="w-3 h-3" />
                        <span>{error}</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AuthInput;
