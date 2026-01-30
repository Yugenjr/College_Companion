import { motion } from "framer-motion";

/**
 * Visual strength indicator for passwords
 * Shows labeled bars (Weak/Medium/Strong)
 */
const PasswordStrength = ({ password }) => {
    const getStrength = (pass) => {
        let strength = 0;
        if (pass.length > 5) strength += 1; // Length > 5
        if (pass.length > 7) strength += 1; // Length > 7
        if (/[A-Z]/.test(pass)) strength += 1; // Has uppercase
        if (/[0-9]/.test(pass)) strength += 1; // Has number
        if (/[^A-Za-z0-9]/.test(pass)) strength += 1; // Has special char
        return strength;
    };

    const strength = getStrength(password || "");

    const getStrengthLabel = () => {
        if (strength === 0) return "Start typing...";
        if (strength < 3) return "Weak";
        if (strength < 5) return "Medium";
        return "Strong";
    };

    const getStrengthColor = () => {
        if (strength === 0) return "bg-white/10";
        if (strength < 3) return "bg-red-500";
        if (strength < 5) return "bg-yellow-500";
        return "bg-emerald-500";
    };

    // Calculate width as percentage (0 to 100)
    const getWidth = () => {
        if (strength === 0) return 0;
        // Normalize 0-5 score to percent. Max score 5 = 100%
        return Math.min(100, (strength / 5) * 100);
    };

    return (
        <div className="space-y-2 mt-2">
            <div className="flex justify-between items-center text-xs">
                <span className="text-white/40">Password Strength</span>
                <span className={`font-semibold ${strength < 3 ? "text-red-400" : strength < 5 ? "text-yellow-400" : "text-emerald-400"
                    }`}>
                    {password ? getStrengthLabel() : ""}
                </span>
            </div>

            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                <motion.div
                    className={`h-full ${getStrengthColor()}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${getWidth()}%` }}
                    transition={{ duration: 0.3 }}
                />
            </div>

            {/* Optional hints */}
            {password && strength < 5 && (
                <p className="text-[10px] text-white/30">
                    Tip: Use uppercase, numbers, and symbols for a stronger password.
                </p>
            )}
        </div>
    );
};

export default PasswordStrength;
