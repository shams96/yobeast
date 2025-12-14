'use client';

import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    // Log to error monitoring service (Sentry will be added later)
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="card-elevated max-w-md w-full text-center space-y-4">
            <div className="text-6xl">⚠️</div>
            <h2 className="text-2xl font-bold text-text-primary">
              Oops! Something went wrong
            </h2>
            <p className="text-text-secondary">
              We're working on fixing this. Please try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary w-full"
              aria-label="Refresh page"
            >
              Refresh Page
            </button>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="text-left text-xs text-text-tertiary bg-dark-surface p-3 rounded-lg">
                <summary className="cursor-pointer font-semibold mb-2">
                  Error Details (Dev Only)
                </summary>
                <pre className="whitespace-pre-wrap overflow-x-auto">
                  {this.state.error.toString()}
                  {'\n\n'}
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
