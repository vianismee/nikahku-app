"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
          <div className="mx-auto w-14 h-14 rounded-full border-2 border-destructive/20 flex items-center justify-center mb-4">
            <AlertTriangle className="h-7 w-7 text-destructive" />
          </div>
          <h2 className="text-lg font-heading font-semibold mb-1">
            Terjadi Kesalahan
          </h2>
          <p className="text-sm text-muted-foreground max-w-md mb-4">
            Maaf, terjadi kesalahan yang tidak terduga. Silakan coba muat ulang halaman.
          </p>
          {this.state.error && (
            <pre className="text-xs text-muted-foreground bg-muted/50 rounded-lg p-3 mb-4 max-w-md overflow-x-auto">
              {this.state.error.message}
            </pre>
          )}
          <Button
            variant="outline"
            onClick={() => this.setState({ hasError: false, error: null })}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Coba Lagi
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
