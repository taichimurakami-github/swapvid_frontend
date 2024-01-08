import { ComponentError } from "@/presentations/Error";
import React, { PropsWithChildren } from "react";

export class ErrorBoundary extends React.Component<
  PropsWithChildren,
  | { hasError: false; errorInfo: undefined; error: undefined }
  | { hasError: true; errorInfo: React.ErrorInfo; error: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, errorInfo: undefined, error: undefined };
  }

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error: error, errorInfo: {} };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // You can also log the error to an error reporting service
    this.setState({ hasError: true, error: error, errorInfo: errorInfo });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <ComponentError
          message={this.state.error.message}
          errorInfo={this.state.errorInfo}
        />
      );
    }

    return this.props.children;
  }
}
