import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { cn, getAssetUrl } from "@/lib/utils"
import * as z from "zod"

const loginSchema = z.object({
  username: z.string().min(1, { message: "Username harus diisi" }),
  password: z.string().min(6, { message: "Password minimal 6 karakter" }),
})

import { toast } from "sonner"
import { useAuth } from "@/contexts/AuthContext"
import { useCompanyProfile } from "@/hooks/useCompanyProfile"

export default function Login() {
  const navigate = useNavigate()
  const { user, login } = useAuth()
  const { profile } = useCompanyProfile()

  useEffect(() => {
    if (user) {
      navigate("/admin/dashboard", { replace: true })
    }
  }, [user, navigate])

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(loginSchema) })

  const onSubmit = async (data) => {
    try {
      await login(data)
      toast.success("Login Berhasil", { description: "Selamat datang di Dashboard Admin" })
      navigate("/admin/dashboard")
    } catch (err) {
      console.error(err)
      toast.error("Login Gagal", { description: err.response?.data?.message || "Username atau password salah" })
      setError("password", { message: err.response?.data?.message || "Username atau password salah" })
    }
  }

  return (
    <div className="min-h-screen flex animate-page-fade text-left">
      {/* Left panel: branding */}
      <div className="hidden lg:flex w-1/2 relative bg-navy items-end p-16">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=2070&auto=format&fit=crop')",
          }}
        />
        <div className="relative z-10">
          <p className="text-warning text-xs font-bold tracking-widest uppercase mb-4">
            Portal Administrasi
          </p>
          <div className="flex items-center gap-3 mb-6">
            <img 
              src={profile.logo_url ? getAssetUrl(profile.logo_url) : "/logo.png"} 
              alt="CV Globalindo Teknik Mandiri" 
              className="h-12 w-auto object-contain" 
            />
            <span className="font-bold text-warning text-base md:text-lg tracking-tight">
              {profile.name}
            </span>
          </div>
          <p className="text-muted-foreground/80 text-sm max-w-xs leading-relaxed font-semibold">
            Sistem manajemen internal untuk pengelolaan katalog produk, artikel, dan data perusahaan.
          </p>
          <div className="mt-8 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-warning" />
            <span className="text-xs text-muted-foreground font-semibold">Secure Access Portal · Internal Use Only</span>
          </div>
        </div>
      </div>

      {/* Right panel: form */}
      <div className="flex-1 flex items-center justify-center bg-background p-8">
        <div className="w-full max-w-sm">
          <div className="lg:hidden mb-8 flex flex-col items-center gap-2">
            <div className="flex items-center gap-2.5">
              <img 
                src={profile.logo_url ? getAssetUrl(profile.logo_url) : "/logo.png"} 
                alt="CV Globalindo Teknik Mandiri" 
                className="h-10 w-auto object-contain" 
              />
              <span className="font-bold text-warning text-sm tracking-tight">
                {profile.name}
              </span>
            </div>
            <p className="text-muted-foreground text-xs font-bold uppercase tracking-wider">Admin Panel</p>
          </div>

          <div className="bg-card border border-border rounded-xl p-8 shadow-card">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-foreground tracking-tight">Masuk ke Dashboard</h2>
              <p className="text-sm text-muted-foreground mt-1">Gunakan kredensial akun administrator Anda.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
              <div className="space-y-1.5">
                <label htmlFor="username" className="text-sm font-semibold text-foreground block">
                  Username
                </label>
                <Input
                  id="username"
                  type="text"
                  placeholder="admin"
                  {...register("username")}
                  className={cn(
                    "h-10 text-xs border-border bg-background focus-visible:ring-accent",
                    errors.username && "border-red-400 focus-visible:ring-red-400"
                  )}
                />
                {errors.username && (
                  <p className="text-xs text-red-500 mt-1">{errors.username.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="password" className="text-sm font-semibold text-foreground block">
                    Password
                  </label>
                  <a href="#" className="text-xs text-accent hover:text-accent/80 transition-colors font-semibold">
                    Lupa Password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  {...register("password")}
                  className={cn(
                    "h-10 text-xs border-border bg-background focus-visible:ring-accent",
                    errors.password && "border-red-400 focus-visible:ring-red-400"
                  )}
                />
                {errors.password && (
                  <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <input
                  id="remember"
                  type="checkbox"
                  className="w-4 h-4 rounded border-border bg-background text-accent focus:ring-accent"
                />
                <label htmlFor="remember" className="text-xs text-muted-foreground font-semibold cursor-pointer">
                  Ingat saya
                </label>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-10 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs rounded-lg transition-colors cursor-pointer"
              >
                {isSubmitting ? "Memverifikasi..." : "Masuk ke Dashboard →"}
              </Button>
            </form>
          </div>

          <p className="text-center text-xs text-muted-foreground/60 mt-6 font-semibold select-none">
            Secure Access · Confidential · Internal Only
          </p>
        </div>
      </div>
    </div>
  )
}
