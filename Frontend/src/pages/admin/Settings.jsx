import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import * as z from "zod"
import api from "@/services/axios"
import { invalidateProfileCache } from "@/hooks/useCompanyProfile"
import { Info, Phone, LayoutGrid, Loader2 } from "lucide-react"
import { getAssetUrl } from "@/lib/utils"

const settingsSchema = z.object({
  name: z.string().min(3, { message: "Nama perusahaan minimal 3 karakter" }),
  tagline: z.string().optional().default(""),
  established: z.string().optional().default(""),
  history: z.string().optional().default(""),
  vision: z.string().optional().default(""),
  mission: z.string().optional().default(""),
  phone: z.string().optional().default(""),
  email: z.string().email({ message: "Alamat email tidak valid" }).or(z.literal("")),
  address: z.string().optional().default(""),
  map_url: z.string().optional().default(""),
  whatsapp_number: z.string().min(8, { message: "Nomor WhatsApp minimal 8 digit" }),
  whatsapp_text: z.string().optional().default(""),
  hours_weekday: z.string().optional().default(""),
  hours_saturday: z.string().optional().default(""),
  hours_sunday: z.string().optional().default(""),
  hero_title: z.string().optional().default(""),
  hero_subtitle: z.string().optional().default(""),
  footer_tagline: z.string().optional().default(""),
})

export default function Settings() {
  const [activeTab, setActiveTab] = useState("info")
  const [loading, setLoading] = useState(true)
  const [aboutImageFile, setAboutImageFile] = useState(null)
  const [aboutImagePreview, setAboutImagePreview] = useState("")
  const [logoFile, setLogoFile] = useState(null)
  const [logoPreview, setLogoPreview] = useState("")

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(settingsSchema),
  })

  useEffect(() => {
    api.get("/admin/profile")
      .then((res) => {
        if (res.data) {
          const mappedData = {}
          Object.keys(settingsSchema.shape).forEach((key) => {
            mappedData[key] = res.data[key] || ""
          })
          if (res.data.about_image_url) {
            setAboutImagePreview(getAssetUrl(res.data.about_image_url))
          }
          if (res.data.logo_url) {
            setLogoPreview(getAssetUrl(res.data.logo_url))
          }
          reset(mappedData)
        }
      })
      .catch((err) => {
        console.error(err)
        toast.error("Gagal memuat pengaturan perusahaan dari server.")
      })
      .finally(() => {
        setLoading(false)
      })
  }, [reset])

  const onSubmit = async (data) => {
    try {
      const formData = new FormData()
      Object.keys(data).forEach(key => {
        if (data[key] !== undefined && data[key] !== null) {
          formData.append(key, data[key])
        }
      })
      if (aboutImageFile) {
        formData.append("about_image", aboutImageFile)
      }
      if (logoFile) {
        formData.append("logo", logoFile)
      }

      const res = await api.put("/admin/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      })
      if (res.data) {
        toast.success("Pengaturan perusahaan berhasil diperbarui.")
        invalidateProfileCache()
      }
    } catch (err) {
      console.error(err)
      toast.error("Gagal menyimpan pengaturan ke server.")
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setAboutImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setAboutImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleLogoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setLogoFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogoPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
        <p className="text-sm font-semibold text-muted-foreground">Memuat data pengaturan...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-page-fade text-left">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Pengaturan Sistem</h1>
        <p className="text-xs font-semibold text-muted-foreground mt-0.5">Konfigurasi data profil perusahaan resmi untuk dinamisasi halaman publik.</p>
      </div>

      <div className="max-w-4xl bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        {/* Navigation Tabs */}
        <div className="flex border-b border-border bg-muted/40 overflow-x-auto">
          <button
            onClick={() => setActiveTab("info")}
            className={`flex items-center gap-2 px-5 py-3.5 text-xs font-bold transition-all border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === "info"
                ? "border-primary text-primary bg-background"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Info className="h-4 w-4" />
            Info Perusahaan
          </button>
          <button
            onClick={() => setActiveTab("kontak")}
            className={`flex items-center gap-2 px-5 py-3.5 text-xs font-bold transition-all border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === "kontak"
                ? "border-primary text-primary bg-background"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Phone className="h-4 w-4" />
            Kontak & Jam Operasional
          </button>
          <button
            onClick={() => setActiveTab("konten")}
            className={`flex items-center gap-2 px-5 py-3.5 text-xs font-bold transition-all border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === "konten"
                ? "border-primary text-primary bg-background"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <LayoutGrid className="h-4 w-4" />
            Konten Umum & Footer
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6" noValidate>

          {/* TAB 1: INFO PERUSAHAAN */}
          {activeTab === "info" && (
            <div className="space-y-5 animate-page-fade">
              <div className="grid sm:grid-cols-3 gap-5">
                <div className="sm:col-span-2 space-y-1.5">
                  <label htmlFor="name" className="text-xs font-bold text-foreground block">
                    Nama Perusahaan <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="name"
                    {...register("name")}
                    className={errors.name ? "border-red-400 focus-visible:ring-red-400 text-xs h-9 rounded-lg" : "text-xs h-9 border-border rounded-lg"}
                  />
                  {errors.name && <p className="text-[10px] text-red-500 mt-1">{errors.name.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="established" className="text-xs font-bold text-foreground block">
                    Tahun Berdiri
                  </label>
                  <Input
                    id="established"
                    placeholder="Contoh: 2009"
                    {...register("established")}
                    className="text-xs h-9 border-border rounded-lg"
                  />
                </div>
              </div>

              {/* Logo */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground block">
                  Logo Perusahaan (Header / Footer / Login)
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-16 shrink-0 bg-muted border border-border border-dashed rounded-lg flex items-center justify-center overflow-hidden p-2">
                    {logoPreview ? (
                      <img src={logoPreview} alt="Preview Logo" className="w-full h-full object-contain" />
                    ) : (
                      <div className="text-muted-foreground">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoChange}
                      className="text-xs h-9 border-border file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-[10px] file:font-bold file:bg-muted file:text-foreground hover:file:bg-muted/80 cursor-pointer"
                    />
                    <p className="text-[10px] text-muted-foreground mt-1.5 font-medium">Format: PNG, SVG, JPG. Sangat direkomendasikan berlatar transparan.</p>
                  </div>
                </div>
              </div>

              {/* Foto About */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground block">
                  Foto Banner Header (Halaman Tentang Kami)
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-16 shrink-0 bg-muted border border-border border-dashed rounded-lg flex items-center justify-center overflow-hidden">
                    {aboutImagePreview ? (
                      <img src={aboutImagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-muted-foreground">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="text-xs h-9 border-border file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-[10px] file:font-bold file:bg-muted file:text-foreground hover:file:bg-muted/80 cursor-pointer"
                    />
                    <p className="text-[10px] text-muted-foreground mt-1.5 font-medium">Format: JPG, PNG. Lebar direkomendasikan min 1200px (Banner).</p>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="tagline" className="text-xs font-bold text-foreground block">
                  Tagline Perusahaan
                </label>
                <Input
                  id="tagline"
                  placeholder="Contoh: Pabrikator & Supplier Peralatan Industri"
                  {...register("tagline")}
                  className="text-xs h-9 border-border rounded-lg"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="history" className="text-xs font-bold text-foreground block">
                  Sejarah Perusahaan (Gunakan Enter untuk baris baru)
                </label>
                <textarea
                  id="history"
                  rows={4}
                  {...register("history")}
                  className="w-full px-3 py-2 text-xs border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  placeholder="Jelaskan sejarah dan latar belakang CV Globalindo..."
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label htmlFor="vision" className="text-xs font-bold text-foreground block">
                    Visi Perusahaan
                  </label>
                  <textarea
                    id="vision"
                    rows={4}
                    {...register("vision")}
                    className="w-full px-3 py-2 text-xs border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                    placeholder="Visi perusahaan..."
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="mission" className="text-xs font-bold text-foreground block">
                    Misi Perusahaan (Gunakan Enter untuk butir misi baru)
                  </label>
                  <textarea
                    id="mission"
                    rows={4}
                    {...register("mission")}
                    className="w-full px-3 py-2 text-xs border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                    placeholder={"Misi 1\nMisi 2\nMisi 3"}
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: KONTAK & JAM OPERASIONAL */}
          {activeTab === "kontak" && (
            <div className="space-y-5 animate-page-fade">
              <div className="grid sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label htmlFor="phone" className="text-xs font-bold text-foreground block">
                    Nomor Telepon Kantor
                  </label>
                  <Input
                    id="phone"
                    placeholder="Contoh: +62 251-8329302"
                    {...register("phone")}
                    className="text-xs h-9 border-border rounded-lg"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-xs font-bold text-foreground block">
                    Email Perusahaan
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@globalindo.co.id"
                    {...register("email")}
                    className={errors.email ? "border-red-400 focus-visible:ring-red-400 text-xs h-9 rounded-lg" : "text-xs h-9 border-border rounded-lg"}
                  />
                  {errors.email && <p className="text-[10px] text-red-500 mt-1">{errors.email.message}</p>}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label htmlFor="whatsapp_number" className="text-xs font-bold text-foreground block">
                    Nomor WhatsApp Bisnis <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="whatsapp_number"
                    placeholder="Contoh: 6281234567890"
                    {...register("whatsapp_number")}
                    className={errors.whatsapp_number ? "border-red-400 focus-visible:ring-red-400 text-xs h-9 rounded-lg" : "text-xs h-9 border-border rounded-lg"}
                  />
                  {errors.whatsapp_number && <p className="text-[10px] text-red-500 mt-1">{errors.whatsapp_number.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="whatsapp_text" className="text-xs font-bold text-foreground block">
                    Pesan Default WhatsApp (Bisa Url Encoded)
                  </label>
                  <Input
                    id="whatsapp_text"
                    placeholder="Contoh: Halo CV Globalindo, saya ingin..."
                    {...register("whatsapp_text")}
                    className="text-xs h-9 border-border rounded-lg"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="address" className="text-xs font-bold text-foreground block">
                  Alamat Lengkap Workshop & Kantor
                </label>
                <textarea
                  id="address"
                  rows={2}
                  {...register("address")}
                  className="w-full px-3 py-2 text-xs border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  placeholder="Masukkan alamat lengkap..."
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="map_url" className="text-xs font-bold text-foreground block">
                  Google Map Share Link atau Embed Map URL
                </label>
                <textarea
                  id="map_url"
                  rows={2}
                  {...register("map_url")}
                  className="w-full px-3 py-2 text-xs border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  placeholder="URL Google Map..."
                />
              </div>

              <div className="border-t border-border pt-4">
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3">Jam Operasional</h3>
                <div className="grid sm:grid-cols-3 gap-5">
                  <div className="space-y-1.5">
                    <label htmlFor="hours_weekday" className="text-[11px] font-semibold text-muted-foreground block">
                      Senin - Jumat
                    </label>
                    <Input
                      id="hours_weekday"
                      placeholder="Contoh: 08.00 - 17.00 WIB"
                      {...register("hours_weekday")}
                      className="text-xs h-9 border-border rounded-lg"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="hours_saturday" className="text-[11px] font-semibold text-muted-foreground block">
                      Sabtu
                    </label>
                    <Input
                      id="hours_saturday"
                      placeholder="Contoh: 08.00 - 14.00 WIB"
                      {...register("hours_saturday")}
                      className="text-xs h-9 border-border rounded-lg"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="hours_sunday" className="text-[11px] font-semibold text-muted-foreground block">
                      Minggu / Libur
                    </label>
                    <Input
                      id="hours_sunday"
                      placeholder="Contoh: Tutup"
                      {...register("hours_sunday")}
                      className="text-xs h-9 border-border rounded-lg"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: KONTEN UMUM & FOOTER */}
          {activeTab === "konten" && (
            <div className="space-y-5 animate-page-fade">
              <div className="space-y-1.5">
                <label htmlFor="hero_title" className="text-xs font-bold text-foreground block">
                  Judul Utama Beranda (Hero Title)
                </label>
                <textarea
                  id="hero_title"
                  rows={2}
                  {...register("hero_title")}
                  className="w-full px-3 py-2 text-xs border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  placeholder="Masukkan judul headline yang memukau..."
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="hero_subtitle" className="text-xs font-bold text-foreground block">
                  Sub-Judul Beranda (Hero Subtitle)
                </label>
                <textarea
                  id="hero_subtitle"
                  rows={3}
                  {...register("hero_subtitle")}
                  className="w-full px-3 py-2 text-xs border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  placeholder="Masukkan deskripsi penjelas di bawah headline utama..."
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="footer_tagline" className="text-xs font-bold text-foreground block">
                  Tagline di Bagian Bawah Halaman (Footer Tagline)
                </label>
                <textarea
                  id="footer_tagline"
                  rows={2}
                  {...register("footer_tagline")}
                  className="w-full px-3 py-2 text-xs border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  placeholder="Tagline ringkas untuk diletakkan di footer..."
                />
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="pt-4 border-t border-border flex justify-end">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs h-10 px-6 rounded-lg cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin inline-block" />
                  Menyimpan...
                </>
              ) : (
                "Simpan Pengaturan"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
