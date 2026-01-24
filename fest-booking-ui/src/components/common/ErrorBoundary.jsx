import React from 'react';
import { AlertTriangle } from 'lucide-react';
import Button from './Button';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
        };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
        this.setState({
            error,
            errorInfo,
        });
    }

    handleReset = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
        });
        window.location.href = '/';
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
                    <div className="max-w-2xl w-full backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-8">
                        <div className="flex flex-col items-center text-center">
                            {/* Icon */}
                            <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mb-6">
                                <AlertTriangle className="text-red-400" size={48} />
                            </div>

                            {/* Title */}
                            <h1 className="text-3xl font-bold text-white mb-4">
                                Oops! Something went wrong
                            </h1>

                            {/* Description */}
                            <p className="text-white/70 mb-8 leading-relaxed">
                                We're sorry for the inconvenience. An unexpected error has occurred. Please try
                                refreshing the page or return to the home page.
                            </p>

                            {/* Error Details (Development Only) */}
                            {process.env.NODE_ENV === 'development' && this.state.error && (
                                <details className="w-full mb-8 text-left backdrop-blur-lg bg-black/20 rounded-xl p-4 border border-white/10">
                                    <summary className="text-white font-medium cursor-pointer mb-2">
                                        Error Details (Development)
                                    </summary>
                                    <pre className="text-red-300 text-xs overflow-auto max-h-64">
                    {this.state.error.toString()}
                                        {'\n\n'}
                                        {this.state.errorInfo?.componentStack}
                  </pre>
                                </details>
                            )}

                            {/* Actions */}
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Button
                                    variant="primary"
                                    onClick={this.handleReset}
                                >
                                    Go to Home
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => window.location.reload()}
                                >
                                    Refresh Page
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
