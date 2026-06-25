import { Mail, Phone, MapPin, CheckCircle, Headphones, Truck, Shield, ChevronRight, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { Helmet } from "react-helmet-async"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Link, useSearchParams } from "react-router-dom"
import { useEffect } from "react"
import * as z from "zod"
import { cn } from "@/lib/utils"
import { useCompanyProfile } from "@/hooks/useCompanyProfile"
import api from "@/services/axios"

const contactSchema = z.object({
  fullName: z.string().min(2, { message: "Nama harus diisi minimal 2 karakter" }),
  email: z.string().email({ message: "Alamat email tidak valid" }),
  phone: z.string().min(8, { message: "Nomor telepon tidak valid" }),
  message: z.string().min(10, { message: "Pesan terlalu singkat, minimal 10 karakter" }),
})

export default function Contact() {
  const [searchParams] = useSearchParams()
  const productParam = searchParams.get("product")
  const skuParam = searchParams.get("sku")
  
  const { profile, getWhatsappLink } = useCompanyProfile()

  const trustItems = [
    { icon: CheckCircle, title: "Tanggapan 1x24 Jam", desc: "Pesan Anda akan direspons maksimal 1x24 jam kerja oleh tim engineering & tender kami." },
    { icon: Shield, title: "Standar SNI & Mutu", desc: "Setiap alat uji dan rambu diproduksi mengikuti pedoman regulasi resmi." },
    { icon: Headphones, title: "Dukungan Onsite", desc: "Teknisi internal siap membantu instalasi dan kalibrasi alat uji sipil." },
    { icon: Truck, title: "Logistik Kargo Nasional", desc: "Jangkauan pengiriman kargo berat ke seluruh wilayah 38 provinsi." },
  ]

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({ resolver: zodResolver(contactSchema) })

  useEffect(() => {
    if (productParam && skuParam) {
      setValue(
        "message",
        `Halo tim sales ${profile.name || 'CV Globalindo Teknik Mandiri'},\n\nSaya tertarik untuk mengajukan permohonan Surat Penawaran Harga Resmi (RFQ) dan/atau Surat Dukungan Pabrikator untuk produk berikut:\n\n- Nama Produk: ${productParam}\n- Kode SKU: ${skuParam}\n\nMohon lampirkan spesifikasi teknis lengkap serta estimasi waktu produksi. Terima kasih.`
      )
    }
  }, [productParam, skuParam, setValue, profile.name])

  const onSubmit = async (data) => {
    try {
      await api.post('/public/contact', data)
      toast.success("Pesan RFQ berhasil dikirim. Tim tender kami akan segera menghubungi Anda.")
      reset()
    } catch (error) {
      console.error("Error submitting contact form:", error)
      toast.error("Gagal mengirim pesan. Silakan coba kembali beberapa saat lagi.")
    }
  }

  return (
    <>
      <Helmet>
        <title>{`Hubungi Kami — ${profile.name || 'CV Globalindo Teknik Mandiri'}`}</title>
        <meta
          name="description"
          content={`Hubungi tim tender ${profile.name || 'CV Globalindo Teknik Mandiri'} di Bogor. Ajukan surat penawaran harga resmi (RFQ) atau permohonan surat dukungan pabrikator.`}
        />
      </Helmet>

      {/* Page Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto max-w-7xl px-4 md:px-6 lg:px-8 py-12 md:py-16 lg:py-24 text-left">
          <nav className="text-[11px] text-muted-foreground/60 mb-3 flex items-center gap-1.5 font-bold uppercase tracking-wider">
            <Link to="/" className="hover:text-accent transition-colors">Beranda</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-muted-foreground">Hubungi Kami</span>
          </nav>
          <h1 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">Hubungi Kami</h1>
          <p className="text-muted-foreground text-sm leading-relaxed mt-2 max-w-xl">
            Hubungi tim tender dan sales kami untuk permintaan penawaran harga resmi (RFQ), konsultasi spesifikasi teknis, atau pengajuan surat dukungan keagenan proyek.
          </p>
        </div>
      </div>

      {/* Main Grid Area */}
      <div className="bg-background py-12 md:py-16 lg:py-24 text-foreground text-left">
        <div className="container mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">

            {/* Left: Contact Info */}
            <div className="lg:col-span-4 space-y-8">
              <div>
                <h2 className="text-xl font-bold text-foreground mb-6 tracking-tight">Informasi Kantor & Workshop</h2>
                <div className="space-y-6">
                  {/* Address */}
                  {profile.address && (
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-muted border border-border flex items-center justify-center shrink-0 mt-0.5">
                        <MapPin className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Workshop Utama</p>
                        <p className="text-xs text-foreground leading-relaxed font-semibold whitespace-pre-line">
                          {profile.address}
                        </p>
                        {profile.map_url && (() => {
                          let embedUrl = profile.map_url;
                          if (embedUrl.includes('<iframe')) {
                            const match = embedUrl.match(/src="([^"]+)"/);
                            if (match) embedUrl = match[1];
                          }
                          return embedUrl ? (
                            <div className="mt-4 rounded-xl overflow-hidden border border-border h-48 relative bg-muted shadow-sm group">
                              <iframe
                                src={embedUrl}
                                className="absolute inset-0 w-full h-full border-0 group-hover:opacity-95 transition-opacity"
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Lokasi Workshop CV Globalindo"
                              />
                            </div>
                          ) : null;
                        })()}
                      </div>
                    </div>
                  )}

                  {/* Email */}
                  {profile.email && (
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-muted border border-border flex items-center justify-center shrink-0 mt-0.5">
                        <Mail className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Email Sales & RFQ</p>
                        <a
                          href={`mailto:${profile.email}`}
                          className="text-xs text-foreground hover:text-accent transition-colors leading-relaxed font-semibold"
                        >
                          {profile.email}
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Phone */}
                  {(profile.phone || profile.whatsapp_number) && (
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-muted border border-border flex items-center justify-center shrink-0 mt-0.5">
                        <Phone className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Telepon & WhatsApp</p>
                        <div className="space-y-1">
                          {profile.phone && (
                            <p className="text-xs text-foreground leading-relaxed font-semibold">
                              {profile.phone} (Hubungan Kantor)
                            </p>
                          )}
                          {profile.whatsapp_number && (
                            <a
                              href={getWhatsappLink()}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-1.5 text-xs text-foreground hover:text-accent transition-colors font-semibold"
                            >
                              <MessageSquare className="h-3.5 w-3.5 text-accent" />
                              Hubungi via WhatsApp
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Office hours */}
              <div className="surface-card p-6">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Jam Operasional Resmi</p>
                {profile.hours_weekday && <p className="text-xs text-foreground font-semibold">{profile.hours_weekday}</p>}
                {profile.hours_saturday && <p className="text-xs text-foreground font-semibold mt-1">{profile.hours_saturday}</p>}
                {profile.hours_sunday && <p className="text-xs text-muted-foreground font-medium mt-1">{profile.hours_sunday}</p>}
              </div>
            </div>

            {/* Right: Form Form Column */}
            <div className="lg:col-span-8">
              <div className="surface-panel p-6 sm:p-8 lg:p-10">
                <h2 className="text-xl font-bold text-foreground mb-6 tracking-tight">Kirim Pengajuan RFQ / Penawaran</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label htmlFor="fullName" className="text-xs font-bold text-foreground block">
                        Nama Lengkap / Instansi <span className="text-red-500">*</span>
                      </label>
                      <Input
                        id="fullName"
                        placeholder="Nama Anda atau Instansi"
                        {...register("fullName")}
                        className={cn(
                          "h-10 text-xs border-border bg-background text-foreground rounded-lg focus-visible:ring-accent focus-visible:border-accent",
                          errors.fullName && "border-red-400 focus-visible:ring-red-400"
                        )}
                      />
                      {errors.fullName && <p className="text-[10px] text-red-500 mt-1">{errors.fullName.message}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <label htmlFor="email" className="text-xs font-bold text-foreground block">
                        Email Kantor / Personal <span className="text-red-500">*</span>
                      </label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="email@perusahaan.com"
                        {...register("email")}
                        className={cn(
                          "h-10 text-xs border-border bg-background text-foreground rounded-lg focus-visible:ring-accent focus-visible:border-accent",
                          errors.email && "border-red-400 focus-visible:ring-red-400"
                        )}
                      />
                      {errors.email && <p className="text-[10px] text-red-500 mt-1">{errors.email.message}</p>}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="phone" className="text-xs font-bold text-foreground block">
                      Nomor Telepon Seluler <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="pastikan mengisi dengan awal 62 lalu nomor telp tanpa 0 cth: 6281234567890"
                      {...register("phone")}
                      className={cn(
                        "h-10 text-xs border-border bg-background text-foreground rounded-lg focus-visible:ring-accent focus-visible:border-accent",
                        errors.phone && "border-red-400 focus-visible:ring-red-400"
                      )}
                    />
                    {errors.phone && <p className="text-[10px] text-red-500 mt-1">{errors.phone.message}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="message" className="text-xs font-bold text-foreground block">
                      Daftar Kebutuhan Spesifikasi <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      rows={5}
                      {...register("message")}
                      placeholder="Jelaskan kebutuhan pengadaan, tipe mesin, atau surat dukungan yang diajukan..."
                      className={cn(
                        "w-full px-3 py-2 text-xs border rounded-lg bg-background text-foreground placeholder-muted-foreground resize-none focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-colors",
                        errors.message ? "border-red-400 focus:ring-red-400" : "border-border"
                      )}
                    />
                    {errors.message && <p className="text-[10px] text-red-500 mt-1">{errors.message.message}</p>}
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-11 bg-navy hover:bg-navy/90 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
                  >
                    {isSubmitting ? "Mengirim RFQ..." : "Kirim Formulir RFQ"}
                  </Button>

                  <p className="text-center text-[10px] text-slate-400 font-semibold">
                    🔒 Kepatuhan Audit Kemitraan B2B & Keamanan Data
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Commitments list */}
      <section className="bg-muted/20 border-t border-border py-12 md:py-16 lg:py-24 text-foreground">
        <div className="container mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">Kepatuhan Administrasi Kontrak</h2>
            <p className="text-muted-foreground text-xs mt-2 font-bold uppercase tracking-wider">Jaminan standar mutu & respon {profile.name}</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trustItems.map((item, i) => (
              <div key={i} className="surface-card p-7 hover:-translate-y-0.5">
                <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center mb-4 border border-border/40">
                  <item.icon className="h-5 w-5 text-muted-foreground" />
                </div>
                <h3 className="font-bold text-foreground text-xs mb-2">{item.title}</h3>
                <p className="text-[11px] text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
