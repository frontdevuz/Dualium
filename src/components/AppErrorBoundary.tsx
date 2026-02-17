import { Component, type ErrorInfo, type ReactNode } from 'react';

type AppErrorBoundaryProps = {
  children: ReactNode;
};

type AppErrorBoundaryState = {
  hasError: boolean;
  errorMessage: string;
};

export class AppErrorBoundary extends Component<AppErrorBoundaryProps, AppErrorBoundaryState> {
  public constructor(props: AppErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  public static getDerivedStateFromError(error: Error): AppErrorBoundaryState {
    return { hasError: true, errorMessage: error.message || 'Unexpected application error.' };
  }

  public componentDidCatch(error: Error, info: ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error('Dualium runtime error boundary:', error, info);
  }

  public render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <div className="min-h-screen bg-mist px-4 py-10 text-zinc-900 dark:bg-ink dark:text-zinc-100">
        <div className="mx-auto max-w-xl rounded-2xl border border-zinc-300/70 bg-white/90 p-6 shadow-soft dark:border-zinc-700 dark:bg-zinc-900/85">
          <h1 className="text-xl font-bold">Something went wrong</h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
            The app hit an unexpected error. Reload to recover. If the issue repeats, check recent code changes.
          </p>
          <p className="mt-4 rounded-lg border border-zinc-200/70 bg-zinc-50 p-3 text-xs text-zinc-600 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-300">
            {this.state.errorMessage}
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-5 rounded-full bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Reload App
          </button>
        </div>
      </div>
    );
  }
}
