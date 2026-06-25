import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import api from "@/services/axios"
import { invalidateProfileCache } from "@/hooks/useCompanyProfile"
import { getAssetUrl } from "@/lib/utils"
import {
  Loader2, Save, ChevronDown, ChevronUp,
  LayoutTemplate, BookOpen, Eye, Heart, Image as ImageIcon
} from "lucide-react"

// ── Collapsible Section ─────────────────────────────────────────────────────
function Section({ icon: Icon, title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card shadow-sm">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-muted/40 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
            <Icon className="h-4 w-4 text-primary" />
          </div>
          <span className="font-bold text-sm text-foreground">{title}</span>
        </div>
        {open
          ? <ChevronUp className="h-4 w-4 text-muted-foreground" />
          : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
      </button>
      {open && (
        <div className="px-6 pb-6 pt-2 border-t border-border space-y-4 animate-page-fade">
          {children}
        </div>
      )}
    </div>
  )
}

// ── Field helpers ───────────────────────────────────────────────────────────
function Field({ label, hint, children }) {
  return (
    <div className="space-y-1.5 text-left">
      <label className="text-xs font-bold text-foreground block">{label}</label>
      {children}
      {hint && <p className="text-[10px] text-muted-foreground font-medium">{hint}</p>}
    </div>
  )
}

function TextInput({ value, onChange, placeholder, className = "" }) {
  return (
    <Input
      value={value || ""}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className={`text-xs h-9 border-border rounded-lg bg-background ${className}`}
    />
  )
}

function TextArea({ value, onChange, placeholder, rows = 3 }) {
  return (
    <textarea
      value={value || ""}
      onChange={e => onChange(e.target.value)}
      rows={rows}
      placeholder={placeholder}
      className="w-full px-3 py-2 text-xs border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary resize-none"
    />
  )
}

// ── Main Page ───────────────────────────────────────────────────────────────
export default function ManageAboutPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Hero / Header
  const [name, setName] = useState("")
  const [established, setEstablished] = useState("")
  const [tagline, setTagline] = useState("")

  // Sejarah
  const [history, setHistory] = useState("")

  // Visi & Misi
  const [vision, setVision] = useState("")
  const [mission, setMission] = useState("")

  // Foto About Header
  const [aboutImageFile, setAboutImageFile] = useState(null)
  const [aboutImagePreview, setAboutImagePreview] = useState("")

  // ── Load profile ──────────────────────────────────────────────────────
  useEffect(() => {
    api.get("/admin/profile")
      .then(res => {
        const d = res.data || {}
        setName(d.name || "")
        setEstablished(d.established || "")
        setTagline(d.tagline || "")
        setHistory(d.history || "")
        setVision(d.vision || "")
        setMission(d.mission || "")
        if (d.about_image_url) {
          setAboutImagePreview(getAssetUrl(d.about_image_url))
        }
      })
      .catch(() => {
        toast.error("Gagal memuat data halaman Tentang Kami.")
      })
      .finally(() => setLoading(false))
  }, [])

  // ── Save ──────────────────────────────────────────────────────────────
  const handleSave = async () => {
    setSaving(true)
    try {
      const formData = new FormData()
      formData.append("name", name)
      formData.append("established", established)
      formData.append("tagline", tagline)
      formData.append("history", history)
      formData.append("vision", vision)
      formData.append("mission", mission)
      if (aboutImageFile) {
        formData.append("about_image", aboutImageFile)
      }

      await api.put("/admin/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      })

      invalidateProfileCache()
      toast.success("Konten halaman Tentang Kami berhasil disimpan!")
    } catch (err) {
      console.error(err)
      toast.error("Gagal menyimpan konten.")
    } finally {
      setSaving(false)
    }
  }

  // ── Loading ───────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
        <p className="text-sm font-semibold text-muted-foreground">Memuat data halaman Tentang Kami...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-page-fade max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Kelola Halaman Tentang Kami</h1>
          <p className="text-xs font-semibold text-muted-foreground mt-0.5">
            Edit konten halaman /tentang-kami. Klik seksi untuk membuka editor.
          </p>
        </div>
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-primary hover:bg-primary/90 text-white font-bold text-xs h-10 px-5 rounded-lg gap-2 cursor-pointer"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? "Menyimpan..." : "Simpan Semua"}
        </Button>
      </div>

      {/* ── IDENTITAS PERUSAHAAN ─────────────────────────────────────────── */}
      <Section icon={LayoutTemplate} title="Identitas Perusahaan" defaultOpen={true}>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Nama Perusahaan" hint="Digunakan di judul halaman dan meta SEO.">
            <TextInput value={name} onChange={setName} placeholder="CV Globalindo Teknik Mandiri" />
          </Field>
          <Field label="Tahun Berdiri" hint="Digunakan untuk hitung 'X+ Tahun Pengalaman'.">
            <TextInput value={established} onChange={setEstablished} placeholder="2009" />
          </Field>
        </div>
        <Field label="Tagline Perusahaan" hint="Label kecil yang muncul di berbagai halaman.">
          <TextInput value={tagline} onChange={setTagline} placeholder="Pabrikator & Supplier Peralatan Teknik Industri Nasional" />
        </Field>
      </Section>

      {/* ── FOTO HEADER ─────────────────────────────────────────────────── */}
      <Section icon={ImageIcon} title="Foto Background Header Tentang Kami">
        <Field
          label="Upload Foto Header"
          hint="Foto ini digunakan sebagai background transparan di bagian atas halaman Tentang Kami. Rekomendasi: landscape, min. 1920px lebar."
        >
          <div className="flex items-center gap-4">
            <div className="w-40 h-20 shrink-0 bg-muted border border-border border-dashed rounded-lg overflow-hidden flex items-center justify-center">
              {aboutImagePreview
                ? <img src={aboutImagePreview} alt="Preview" className="w-full h-full object-cover" />
                : <ImageIcon className="h-5 w-5 text-muted-foreground" />
              }
            </div>
            <Input
              type="file"
              accept="image/*"
              onChange={e => {
                const file = e.target.files[0]
                if (file) {
                  setAboutImageFile(file)
                  const reader = new FileReader()
                  reader.onloadend = () => setAboutImagePreview(reader.result)
                  reader.readAsDataURL(file)
                }
              }}
              className="text-xs h-9 border-border file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-[10px] file:font-bold file:bg-muted file:text-foreground hover:file:bg-muted/80 cursor-pointer"
            />
          </div>
        </Field>
      </Section>

      {/* ── SEJARAH & LATAR BELAKANG ─────────────────────────────────────── */}
      <Section icon={BookOpen} title="Sejarah & Latar Belakang Perusahaan">
        <Field
          label="Narasi Sejarah Perusahaan"
          hint="Pisahkan paragraf dengan baris kosong (tekan Enter dua kali). Setiap paragraf akan ditampilkan terpisah di halaman publik."
        >
          <TextArea
            value={history}
            onChange={setHistory}
            rows={10}
            placeholder={`Contoh paragraf 1: CV Globalindo Teknik Mandiri didirikan pada tahun 2009...\n\nContoh paragraf 2: Melalui pengalaman lebih dari 15 tahun...`}
          />
        </Field>
      </Section>

      {/* ── VISI & MISI ──────────────────────────────────────────────────── */}
      <Section icon={Eye} title="Visi Perusahaan">
        <Field label="Pernyataan Visi" hint="Satu kalimat visi utama perusahaan yang ditampilkan di kartu Visi.">
          <TextArea
            value={vision}
            onChange={setVision}
            rows={3}
            placeholder="Menjadi mitra pengadaan peralatan industri dan manufaktur yang paling terpercaya, inovatif, dan berkontribusi pada pembangunan infrastruktur serta kemandirian teknologi di Indonesia."
          />
        </Field>
      </Section>

      <Section icon={Heart} title="Misi Perusahaan">
        <Field
          label="Daftar Misi"
          hint="Tulis setiap poin misi di baris baru. Setiap baris akan ditampilkan sebagai item di daftar misi."
        >
          <TextArea
            value={mission}
            onChange={setMission}
            rows={8}
            placeholder={`1. Memproduksi peralatan teknik yang memenuhi standar kualitas nasional dan internasional.\n2. Memberikan layanan purna jual yang responsif dan solutif bagi seluruh klien.\n3. Terus berinovasi dalam desain produk untuk meningkatkan efisiensi dan keamanan kerja.\n4. Membangun kemitraan jangka panjang yang saling menguntungkan dengan seluruh pemangku kepentingan.`}
          />
        </Field>
      </Section>

      {/* Bottom save */}
      <div className="flex justify-end pt-2 pb-8">
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-primary hover:bg-primary/90 text-white font-bold text-xs h-10 px-6 rounded-lg gap-2 cursor-pointer"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? "Menyimpan..." : "Simpan Semua Perubahan"}
        </Button>
      </div>
    </div>
  )
}
