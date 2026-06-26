import { AlertCircle } from 'lucide-react';

export default function AuthErrorAlert({ errors, children }) {
    if (!errors || errors.length === 0) return null;

    return (
        <div className="mb-6 rounded-2xl bg-red-50 dark:bg-red-900/20 p-4 border border-red-200 dark:border-red-800 flex items-start gap-3">
            <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={18} />
            <div className="flex-1">
                {errors.length === 1 ? (
                    <ErrorMessage text={errors[0]} />
                ) : (
                    <ul className="list-disc pl-4 space-y-1">
                        {errors.map((err, idx) => (
                            <li key={idx} className="text-sm text-red-600 dark:text-red-400 font-medium">
                                <ErrorMessage text={err} />
                            </li>
                        ))}
                    </ul>
                )}
                {children}
            </div>
        </div>
    );
}

function ErrorMessage({ text }) {
    // Specifically format the password complexity error rule as requested
    if (text.includes("Password must be at least 8 characters") && text.includes("uppercase")) {
        return (
            <div className="text-sm text-red-600 dark:text-red-400 font-medium leading-snug">
                <p>Password must be at least 8 characters and include:</p>
                <ul className="list-disc pl-4 mt-1 space-y-0.5 text-xs">
                    <li>One uppercase letter</li>
                    <li>One lowercase letter</li>
                    <li>One number</li>
                    <li>One special character</li>
                </ul>
            </div>
        );
    }
    
    return (
        <p className="text-sm text-red-600 dark:text-red-400 font-medium leading-snug">
            {text}
        </p>
    );
}
