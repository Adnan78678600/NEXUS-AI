import { Component, ErrorInfo, ReactNode } from 'react';
import { RefreshCw, AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleRetry = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="absolute inset-0 flex items-center justify-center bg-black text-white font-mono">
          <div className="flex flex-col items-center gap-6 p-8 max-w-md text-center">
            <AlertTriangle className="w-16 h-16 text-red-500" />
            <div>
              <h2 className="text-xl font-bold mb-2 text-red-400">SYSTEM_ERROR</h2>
              <p className="text-xs text-neutral-400 mb-4">
                A rendering error occurred in the 3D engine.
              </p>
              <code className="text-[10px] text-neutral-500 block bg-neutral-900 p-2 rounded mb-6 break-all">
                {this.state.error?.message || 'Unknown error'}
              </code>
            </div>
            <button
              onClick={this.handleRetry}
              className="flex items-center gap-2 px-6 py-2 bg-white text-black font-bold text-xs hover:bg-green-400 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              RETRY_RENDER
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
