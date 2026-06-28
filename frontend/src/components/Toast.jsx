import { Toaster } from 'react-hot-toast';
import { CheckCircle2, XCircle, AlertTriangle, Info } from 'lucide-react';

export default function AppToaster() {
    return (
        <Toaster
            position="top-right"
            gutter={12}
            containerStyle={{ top: 20, right: 20 }}
            toastOptions={{
                duration: 3500,
                style: {
                    borderRadius: '14px',
                    border: '1px solid rgba(13, 148, 136, 0.1)',
                    background: 'rgb(var(--color-surface))',
                    color: 'rgb(var(--color-text))',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.12)',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '14px',
                    padding: '12px 16px',
                    maxWidth: '400px',
                },
                success: {
                    iconTheme: {
                        primary: '#0d9488',
                        secondary: '#ffffff',
                    },
                    style: {
                        border: '1px solid rgba(13, 148, 136, 0.15)',
                    },
                },
                error: {
                    iconTheme: {
                        primary: '#ef4444',
                        secondary: '#ffffff',
                    },
                    duration: 4500,
                    style: {
                        border: '1px solid rgba(239, 68, 68, 0.15)',
                    },
                },
            }}
        />
    );
}
