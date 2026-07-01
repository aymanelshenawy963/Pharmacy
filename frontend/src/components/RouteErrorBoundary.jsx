import { Component } from 'react';
import { Link } from 'react-router-dom';

export default class RouteErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Route error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-[60vh] flex items-center justify-center p-4">
                    <div className="bg-surface rounded-2xl border border-border max-w-md w-full p-8 text-center">
                        <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
                        <p className="text-text-muted mb-6">An error occurred on this page.</p>
                        <div className="flex gap-3 justify-center">
                            <button onClick={() => this.setState({ hasError: false })} className="glass-button-secondary">
                                Try Again
                            </button>
                            <Link to="/" className="glass-button-primary">
                                Go Home
                            </Link>
                        </div>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}
