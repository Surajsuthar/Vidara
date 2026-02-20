"use client";

import { Component, type ReactNode } from "react";
import { getErrorMessage, isRetryableError } from "@/lib/error";

export class ErrorBoundary extends Component<
  { children: ReactNode; fallback?: ReactNode },
  { error: unknown }
> {
  state = { error: null };

  static getDerivedStateFromError(error: unknown) {
    return { error };
  }

  render() {
    if (this.state.error) {
      const message = getErrorMessage(this.state.error);
      const retryable = isRetryableError(this.state.error);

      return (
        this.props.fallback || (
          <div>
            <p>{message}</p>
            {retryable && (
              <button onClick={() => this.setState({ error: null })}>
                Try again
              </button>
            )}
          </div>
        )
      );
    }

    return this.props.children;
  }
}
