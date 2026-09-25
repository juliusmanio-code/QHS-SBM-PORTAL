import React, { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('QHS SBM Portal Error Caught by Boundary:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  private handleClearAndReload = () => {
    try {
      sessionStorage.clear();
    } catch (e) {
      console.warn('Could not clear session storage:', e);
    }
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#06140E] text-[#FFFDF9] flex items-center justify-center p-4">
          <div className="max-w-lg w-full bg-[#0B2519] border border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold text-[#FFFDF9]">Something unexpected occurred</h2>
              <p className="text-xs text-[#8FBCA7] leading-relaxed">
                The SBM Portal encountered an interface issue. Your uploaded MOVs and evaluation data remain safe and preserved in storage.
              </p>
            </div>

            {this.state.error?.message && (
              <div className="p-3 bg-[#061810] rounded-xl border border-[#D4AF37]/20 text-left text-xs font-mono text-amber-300 max-h-32 overflow-y-auto">
                {this.state.error.message}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={this.handleReset}
                className="w-full sm:w-auto px-4 py-2.5 gold-btn text-xs font-bold rounded-xl shadow-md flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reload Application</span>
              </button>
              <button
                type="button"
                onClick={this.handleClearAndReload}
                className="w-full sm:w-auto px-4 py-2.5 bg-[#0E3824] hover:bg-[#123E2A] text-[#8FBCA7] hover:text-[#FFFDF9] border border-[#D4AF37]/30 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <Home className="w-4 h-4" />
                <span>Reset View</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
