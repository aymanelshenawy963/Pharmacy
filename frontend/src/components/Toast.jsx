import { Toaster } from 'react-hot-toast';

export default function AppToaster() {
    return (
        <Toaster
            position="top-right"
            toastOptions={{
                duration: 3000,
                style: {
                    borderRadius: '16px',
                    border: '1px solid rgba(13, 148, 136, 0.14)',
                    background: '#ffffff',
                    color: '#0f172a',
                    boxShadow: '0 18px 40px rgba(15, 23, 42, 0.12)',
                    fontFamily: 'DM Sans, sans-serif',
                },
                success: {
                    iconTheme: {
                        primary: '#0d9488',
                        secondary: '#ffffff',
                    },
                },
            }}
        />
    );
}