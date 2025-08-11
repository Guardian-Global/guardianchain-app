import React from "react";

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }


  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error details to the browser console for debugging
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line no-console
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-900 to-purple-900 text-white p-8">
          <h1 className="text-4xl font-bold mb-4">Something went wrong</h1>
          <p className="mb-2 font-mono text-lg text-red-200">{this.state.error?.message}</p>
          {this.state.error?.stack && (
            <pre className="bg-black/60 text-xs text-red-100 p-4 rounded max-w-2xl overflow-x-auto mt-4">
              {this.state.error.stack}
            </pre>
          )}
          <button className="mt-6 px-4 py-2 bg-indigo-600 rounded" onClick={() => window.location.reload()}>Reload</button>
          <p className="mt-4 text-sm text-gray-300">Check the browser console for more details.</p>
        </div>
      );
    }
    return this.props.children;
  }
}
