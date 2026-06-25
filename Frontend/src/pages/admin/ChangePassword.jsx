import { useState } from "react"
import { KeyRound, Eye, EyeOff, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import api from "@/services/axios"
import { toast } from "sonner"
import { useAuth } from "@/contexts/AuthContext"

export default function ChangePassword() {
  const { user } = useAuth()
  const [form, setForm] = useState({
    current_password: "",
    new_password: "",
    confirm_password: ""
  })
  const [show, setShow] = useState({
    current: false,
    new: false,
    confirm: false
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (form.new_password !== form.confirm_password) {
      toast.error("Password baru dan konfirmasi tidak cocok")
      return
    }
    if (form.new_password.length < 6) {
      toast.error("Password baru minimal 6 karakter")
      return
    }

    setLoading(true)
    try {
      const res = await api.post('/auth/change-password', {
        current_password: form.current_password,
        new_password: form.new_password
      })
      toast.success(res.data.message || "Password berhasil diubah!")
      setForm({ current_password: "", new_password: "", confirm_password: "" })
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal mengubah password")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 animate-page-fade">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Ganti Password</h1>
        <p className="text-xs font-semibold text-muted-foreground mt-0.5">
          Ubah password akun <span className="text-accent font-bold">{user?.username}</span> ({user?.role})
        </p>
      </div>

      <div className="max-w-lg">
        {/* Info Card */}
        <div className="flex items-start gap-3 bg-accent/10 border border-accent/30 rounded-xl p-4 mb-6">
          <ShieldCheck className="h-5 w-5 text-accent shrink-0 mt-0.5" />
          <p className="text-xs text-accent font-medium leading-relaxed">
            Gunakan password yang kuat dengan kombinasi huruf besar, kecil, angka, dan simbol. Minimal 6 karakter.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-card border border-border rounded-xl p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Current Password */}
            <div className="space-y-1.5">
              <label htmlFor="current_password" className="text-sm font-semibold text-foreground block">
                Password Saat Ini <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="current_password"
                  name="current_password"
                  type={show.current ? "text" : "password"}
                  required
                  value={form.current_password}
                  onChange={handleChange}
                  placeholder="Masukkan password saat ini"
                  className="pl-9 pr-10 border-border bg-background"
                />
                <button
                  type="button"
                  onClick={() => setShow(s => ({ ...s, current: !s.current }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {show.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <hr className="border-border" />

            {/* New Password */}
            <div className="space-y-1.5">
              <label htmlFor="new_password" className="text-sm font-semibold text-foreground block">
                Password Baru <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="new_password"
                  name="new_password"
                  type={show.new ? "text" : "password"}
                  required
                  value={form.new_password}
                  onChange={handleChange}
                  placeholder="Masukkan password baru (min. 6 karakter)"
                  className="pl-9 pr-10 border-border bg-background"
                />
                <button
                  type="button"
                  onClick={() => setShow(s => ({ ...s, new: !s.new }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {show.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label htmlFor="confirm_password" className="text-sm font-semibold text-foreground block">
                Konfirmasi Password Baru <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirm_password"
                  name="confirm_password"
                  type={show.confirm ? "text" : "password"}
                  required
                  value={form.confirm_password}
                  onChange={handleChange}
                  placeholder="Ulangi password baru"
                  className={`pl-9 pr-10 border-border bg-background ${
                    form.confirm_password && form.confirm_password !== form.new_password
                      ? "border-red-400 focus-visible:ring-red-400"
                      : form.confirm_password && form.confirm_password === form.new_password
                      ? "border-green-400 focus-visible:ring-green-400"
                      : ""
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShow(s => ({ ...s, confirm: !s.confirm }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {show.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {form.confirm_password && form.confirm_password !== form.new_password && (
                <p className="text-xs text-red-500 mt-1">Password tidak cocok</p>
              )}
              {form.confirm_password && form.confirm_password === form.new_password && (
                <p className="text-xs text-green-600 mt-1">✓ Password cocok</p>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <Button
                type="submit"
                disabled={loading}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-sm h-10 px-6 rounded-lg cursor-pointer"
              >
                {loading ? "Menyimpan..." : "Simpan Password"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
