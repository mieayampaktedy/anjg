import React from "react"
import { Button } from "./ui/button"
import { AlertTriangle } from "lucide-react"

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4 text-foreground">
          <div className="max-w-md w-full bg-card rounded-2xl shadow-lg border border-border p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="h-8 w-8" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-foreground">Oops! Terjadi Kesalahan</h1>
              <p className="text-muted-foreground text-sm">
                Maaf, sistem kami menemui masalah yang tidak terduga. Silakan coba muat ulang halaman atau kembali ke Beranda.
              </p>
            </div>
            {import.meta.env.DEV && this.state.error && (
              <div className="bg-muted p-4 rounded-lg text-left overflow-auto text-xs text-destructive font-mono max-h-32">
                {this.state.error.toString()}
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <Button variant="outline" onClick={() => window.location.reload()} className="w-full sm:w-auto border-border">
                Muat Ulang
              </Button>
              <Button onClick={() => window.location.href = "/"} className="w-full sm:w-auto">
                Ke Beranda
              </Button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
