import { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = { hasError: false, error: null };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("🛡️ Erro capturado no Showroom:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="min-h-screen bg-[#050507] flex items-center justify-center p-6 text-center">
            <div className="glass rounded-3xl p-8 max-w-md border border-red-500/30">
              <h2 className="text-2xl font-black text-red-400 tracking-widest mb-2">OPS!</h2>
              <p className="text-white/60 text-sm mb-6">O simulador encontrou um obstáculo. Mas a experiência ATUS continua.</p>
              <button onClick={() => window.location.reload()} className="px-6 py-3 rounded-full bg-white text-black font-bold text-sm hover:scale-105 transition">
                🔄 Reiniciar Experiência
              </button>
            </div>
          </div>
        )
      );
    }
    return this.props.children;
  }
}