import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import api from "@/services/axios"
import { invalidateProfileCache } from "@/hooks/useCompanyProfile"
import { getAssetUrl } from "@/lib/utils"
import { divisionsData } from "@/data/divisions"
import { procurementData } from "@/data/procurement"
import {
  Loader2, Save, ChevronDown, ChevronUp,
  LayoutTemplate, Zap, ShieldCheck, Hammer,
  GitBranch, FileCheck, Maximize2
} from "lucide-react"

// ── Collapsible Section component ──────────────────────────────────────────
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

// ── Parse Helper ────────────────────────────────────────────────────────────
function parseOrFallback(jsonStr, fallback) {
  if (!jsonStr) return fallback
  try {
    const parsed = JSON.parse(jsonStr)
    if (Array.isArray(parsed) && parsed.length > 0) return parsed
  } catch {
    // ignore
  }
  return fallback
}

// ── Main Page ───────────────────────────────────────────────────────────────
export default function ManageHomePage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // --- Hero ---
  const [heroTitle, setHeroTitle] = useState("")
  const [heroSubtitle, setHeroSubtitle] = useState("")
  const [tagline, setTagline] = useState("")

  // --- Banner hero image ---
  const [workshopImageFile, setWorkshopImageFile] = useState(null)
  const [workshopImagePreview, setWorkshopImagePreview] = useState("")

  // --- CTA Section ---
  const [ctaTitle, setCtaTitle] = useState("")
  const [ctaDesc, setCtaDesc] = useState("")

  // --- Credentials ---
  const [credDesc, setCredDesc] = useState("")
  const [established, setEstablished] = useState("")

  // --- Workshop ---
  const [workshopLocation, setWorkshopLocation] = useState("")
  const [workshopAcreage, setWorkshopAcreage] = useState("")
  const [facilities, setFacilities] = useState([])

  // --- Divisions ---
  const [divisions, setDivisions] = useState([])

  // --- Procurement ---
  const [workflow, setWorkflow] = useState([])
  const [support, setSupport] = useState([])

  // ── Load profile from API ──────────────────────────────────────────────
  useEffect(() => {
    api.get("/admin/profile")
      .then(res => {
        const d = res.data || {}

        setHeroTitle(d.hero_title || "")
        setHeroSubtitle(d.hero_subtitle || "")
        setTagline(d.tagline || "")
        setEstablished(d.established || "")
        setCtaTitle(d.home_cta_title || "")
        setCtaDesc(d.home_cta_desc || "")
        setCredDesc(d.home_credentials_desc || "")
        setWorkshopLocation(d.home_workshop_location || "")
        setWorkshopAcreage(d.home_workshop_acreage || "")

        if (d.workshop_image_url) {
          setWorkshopImagePreview(getAssetUrl(d.workshop_image_url))
        }

        // Parse array JSON fields with fallback
        setDivisions(parseOrFallback(d.home_divisions, divisionsData))
        setFacilities(parseOrFallback(d.home_workshop_facilities, procurementData.workshop.facilities))
        setWorkflow(parseOrFallback(d.home_procurement_workflow, procurementData.workflow))
        setSupport(parseOrFallback(d.home_procurement_support, procurementData.tenderSupport))
      })
      .catch(() => {
        toast.error("Gagal memuat data halaman beranda.")
        // Fallback to static defaults
        setDivisions(divisionsData)
        setFacilities(procurementData.workshop.facilities)
        setWorkflow(procurementData.workflow)
        setSupport(procurementData.tenderSupport)
      })
      .finally(() => setLoading(false))
  }, [])



  // ── Save handler ────────────────────────────────────────────────────────
  const handleSave = async () => {
    setSaving(true)
    try {
      const formData = new FormData()

      // Simple text fields
      formData.append("hero_title", heroTitle)
      formData.append("hero_subtitle", heroSubtitle)
      formData.append("tagline", tagline)
      formData.append("established", established)
      formData.append("home_cta_title", ctaTitle)
      formData.append("home_cta_desc", ctaDesc)
      formData.append("home_credentials_desc", credDesc)
      formData.append("home_workshop_location", workshopLocation)
      formData.append("home_workshop_acreage", workshopAcreage)

      // JSON arrays
      formData.append("home_divisions", JSON.stringify(divisions))
      formData.append("home_workshop_facilities", JSON.stringify(facilities))
      formData.append("home_procurement_workflow", JSON.stringify(workflow))
      formData.append("home_procurement_support", JSON.stringify(support))

      // Workshop image
      if (workshopImageFile) {
        formData.append("workshop_image", workshopImageFile)
      }

      await api.put("/admin/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      })

      invalidateProfileCache()
      toast.success("Konten halaman beranda berhasil disimpan!")
    } catch (err) {
      console.error(err)
      toast.error("Gagal menyimpan konten beranda.")
    } finally {
      setSaving(false)
    }
  }

  // ── Helpers for array state updates ─────────────────────────────────────
  const updateDiv = (idx, field, val) => {
    setDivisions(prev => {
      const next = [...prev]
      next[idx] = { ...next[idx], [field]: val }
      return next
    })
  }

  const updateFac = (idx, field, val) => {
    setFacilities(prev => {
      const next = [...prev]
      next[idx] = { ...next[idx], [field]: val }
      return next
    })
  }

  const updateFlow = (idx, field, val) => {
    setWorkflow(prev => {
      const next = [...prev]
      next[idx] = { ...next[idx], [field]: val }
      return next
    })
  }

  const updateSupport = (idx, field, val) => {
    setSupport(prev => {
      const next = [...prev]
      next[idx] = { ...next[idx], [field]: val }
      return next
    })
  }

  // ── Loading state ──────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
        <p className="text-sm font-semibold text-muted-foreground">Memuat data halaman beranda...</p>
      </div>
    )
  }

  // ── Render ─────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6 animate-page-fade max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Kelola Halaman Beranda</h1>
          <p className="text-xs font-semibold text-muted-foreground mt-0.5">Edit seluruh konten halaman utama dari sini. Klik seksi untuk membuka editor.</p>
        </div>
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs h-10 px-5 rounded-lg gap-2 cursor-pointer"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? "Menyimpan..." : "Simpan Semua"}
        </Button>
      </div>

      {/* ── HERO SECTION ──────────────────────────────────────────────── */}
      <Section icon={LayoutTemplate} title="Hero — Bagian Atas Halaman Beranda" defaultOpen={true}>
        <Field label="Tagline (Label Kecil di Atas Judul)">
          <TextInput value={tagline} onChange={setTagline} placeholder="Contoh: Pabrikator & Supplier Peralatan Teknik Industri Nasional" />
        </Field>
        <Field label="Judul Utama (Hero Title)">
          <TextArea value={heroTitle} onChange={setHeroTitle} rows={2} placeholder="Mitra Penyedia Peralatan Jalan, Mesin Pertanian, dan Alat Uji Laboratorium..." />
        </Field>
        <Field label="Sub-Judul (Hero Subtitle)">
          <TextArea value={heroSubtitle} onChange={setHeroSubtitle} rows={3} placeholder="Sejak 2009, kami menyuplai kebutuhan pengadaan proyek..." />
        </Field>
        <Field label="Foto Latar Belakang Hero (Workshop)" hint="Gambar ditampilkan sebagai background transparan. Rekomendasi landscape min. 1920px.">
          <div className="flex items-center gap-4">
            <div className="w-28 h-16 shrink-0 bg-muted border border-border border-dashed rounded-lg overflow-hidden flex items-center justify-center">
              {workshopImagePreview
                ? <img src={workshopImagePreview} alt="Preview" className="w-full h-full object-cover" />
                : <Maximize2 className="h-5 w-5 text-muted-foreground" />
              }
            </div>
            <Input
              type="file"
              accept="image/*"
              onChange={e => {
                const file = e.target.files[0]
                if (file) {
                  setWorkshopImageFile(file)
                  const reader = new FileReader()
                  reader.onloadend = () => setWorkshopImagePreview(reader.result)
                  reader.readAsDataURL(file)
                }
              }}
              className="text-xs h-9 border-border file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-[10px] file:font-bold file:bg-muted file:text-foreground hover:file:bg-muted/80 cursor-pointer"
            />
          </div>
        </Field>
      </Section>

      {/* ── CTA SECTION ───────────────────────────────────────────────── */}
      <Section icon={Zap} title="CTA — Ajakan Bertindak (Minta Penawaran)">
        <Field label="Judul CTA">
          <TextInput value={ctaTitle} onChange={setCtaTitle} placeholder="Butuh Penawaran Harga Resmi untuk Kebutuhan Pengadaan/Tender?" />
        </Field>
        <Field label="Deskripsi CTA">
          <TextArea value={ctaDesc} onChange={setCtaDesc} placeholder="Hubungi tim tender dan engineering kami untuk berkonsultasi..." />
        </Field>
      </Section>

      {/* ── CREDENTIALS SECTION ───────────────────────────────────────── */}
      <Section icon={ShieldCheck} title="Legalitas & Kredibilitas Perusahaan">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Tahun Berdiri">
            <TextInput value={established} onChange={setEstablished} placeholder="2009" />
          </Field>
        </div>
        <Field label="Deskripsi Legalitas & Komitmen Perusahaan">
          <TextArea value={credDesc} onChange={setCredDesc} rows={4} placeholder="CV Globalindo Teknik Mandiri adalah badan usaha berbadan hukum resmi yang berkomitmen penuh..." />
        </Field>
      </Section>

      {/* ── WORKSHOP SECTION ──────────────────────────────────────────── */}
      <Section icon={Hammer} title="Workshop & Fasilitas Produksi">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Lokasi Workshop">
            <TextInput value={workshopLocation} onChange={setWorkshopLocation} placeholder="Cibadak, Tanah Sareal, Kota Bogor, Jawa Barat" />
          </Field>
          <Field label="Luas Area Workshop">
            <TextInput value={workshopAcreage} onChange={setWorkshopAcreage} placeholder="±1.200 meter persegi (Area Kantor, Gudang, & Fabrikasi)" />
          </Field>
        </div>

        <div className="space-y-2 pt-2">
          <p className="text-xs font-bold text-foreground">Fasilitas Workshop (4 Item)</p>
          <div className="grid md:grid-cols-2 gap-3">
            {facilities.map((fac, idx) => (
              <div key={idx} className="p-3 border border-border rounded-lg bg-muted/20 space-y-2">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Fasilitas #{idx + 1}</p>
                <TextInput value={fac.title} onChange={v => updateFac(idx, "title", v)} placeholder="Nama Fasilitas" />
                <TextArea value={fac.desc} onChange={v => updateFac(idx, "desc", v)} rows={2} placeholder="Deskripsi singkat fasilitas" />
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── DIVISI UNIT BISNIS ────────────────────────────────────────── */}
      <Section icon={GitBranch} title="Divisi Unit Bisnis (6 Kartu)">
        <div className="grid md:grid-cols-2 gap-4">
          {divisions.map((div, idx) => (
            <div key={idx} className="p-4 border border-border rounded-lg bg-muted/20 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Divisi #{idx + 1}
                </span>
              </div>
              <Field label="Nama Divisi">
                <TextInput value={div.title} onChange={v => updateDiv(idx, "title", v)} placeholder="Nama Divisi" />
              </Field>
              <Field label="Deskripsi Singkat">
                <TextArea value={div.description} onChange={v => updateDiv(idx, "description", v)} rows={2} placeholder="Deskripsi divisi..." />
              </Field>
              <Field label="Suplai Utama" hint="Pisahkan setiap item dengan tanda koma ( , )">
                <TextInput
                  value={Array.isArray(div.keyProducts) ? div.keyProducts.join(", ") : (div.keyProducts || "")}
                  onChange={v => updateDiv(idx, "keyProducts", v.split(",").map(s => s.trim()))}
                  placeholder="Mesin Marka GTM-Sprayer, Cat Thermoplastic, ..."
                />
              </Field>
            </div>
          ))}
        </div>
      </Section>

      {/* ── PROCUREMENT SECTION ───────────────────────────────────────── */}
      <Section icon={FileCheck} title="Alur Kerja Sama B2B & Dokumen Tender">
        {/* Workflow Steps */}
        <div className="space-y-2">
          <p className="text-xs font-bold text-foreground">Alur Kerja Sama B2B (5 Langkah)</p>
          <div className="space-y-2">
            {workflow.map((flow, idx) => (
              <div key={idx} className="p-3 border border-border rounded-lg bg-muted/20 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-bold text-primary shrink-0 font-mono">
                  {flow.step || `0${idx + 1}`}
                </div>
                <div className="grid sm:grid-cols-2 gap-2 w-full">
                  <TextInput value={flow.title} onChange={v => updateFlow(idx, "title", v)} placeholder="Judul langkah" />
                  <TextInput value={flow.desc} onChange={v => updateFlow(idx, "desc", v)} placeholder="Deskripsi singkat" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tender Support Items */}
        <div className="space-y-2 pt-3 border-t border-border">
          <p className="text-xs font-bold text-foreground">Dukungan Dokumen Tender (4 Item)</p>
          <div className="grid md:grid-cols-2 gap-3">
            {support.map((sup, idx) => (
              <div key={idx} className="p-3 border border-border rounded-lg bg-muted/20 space-y-2">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Item #{idx + 1}</p>
                <TextInput value={sup.title} onChange={v => updateSupport(idx, "title", v)} placeholder="Judul item dukungan" />
                <TextArea value={sup.desc} onChange={v => updateSupport(idx, "desc", v)} rows={2} placeholder="Deskripsi..." />
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Bottom save button */}
      <div className="flex justify-end pt-2 pb-8">
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs h-10 px-6 rounded-lg gap-2 cursor-pointer"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? "Menyimpan..." : "Simpan Semua Perubahan"}
        </Button>
      </div>
    </div>
  )
}
