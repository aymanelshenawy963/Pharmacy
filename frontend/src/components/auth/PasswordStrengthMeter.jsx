import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { getPasswordStrength } from '../../utils/validators';
import { PASSWORD_RULES } from '../../constants/auth';

export default function PasswordStrengthMeter({ password }) {
    const strength = getPasswordStrength(password);
    const rules = PASSWORD_RULES.map((rule) => ({
        label: rule.label,
        met: rule.test(password),
    }));

    return (
        <motion.div
            initial={false}
            animate={{ height: password ? 'auto' : 0, opacity: password ? 1 : 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
        >
            <div className="flex h-2 w-full overflow-hidden rounded-full bg-[rgb(var(--color-border))]">
                <motion.div
                    className="h-full rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${(strength.score / 5) * 100}%` }}
                    transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                    style={{ backgroundColor: strength.color }}
                />
            </div>
            <motion.p
                key={strength.label}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="text-xs font-medium mt-1"
                style={{ color: strength.color }}
            >
                Strength: {strength.label}
            </motion.p>
            <div className="grid grid-cols-2 gap-1.5 pt-2">
                {rules.map((rule) => (
                    <motion.div
                        key={rule.label}
                        initial={false}
                        animate={{ opacity: 1 }}
                        className="flex items-center gap-1.5 text-xs"
                    >
                        <motion.div
                            initial={false}
                            animate={rule.met ? { scale: [1, 1.3, 1] } : {}}
                            transition={{ duration: 0.3 }}
                        >
                            {rule.met
                                ? <CheckCircle2 size={12} className="text-green-500 shrink-0" />
                                : <div className="w-3 h-3 rounded-full border border-[rgb(var(--color-border))] shrink-0" />}
                        </motion.div>
                        <span className={`transition-colors duration-200 ${rule.met ? 'text-green-600 dark:text-green-400' : 'text-[rgb(var(--color-text-muted))]'}`}>
                            {rule.label}
                        </span>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}
