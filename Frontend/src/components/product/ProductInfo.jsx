import { Button } from "@/components/ui/button"
import { CheckCircle2, MessageSquare, FileText } from "lucide-react"
import { Link } from "react-router-dom"
import { useCompanyProfile } from "@/hooks/useCompanyProfile"

export default function ProductInfo({ name, sku, category, stockStatus, shortDescription, description }) {
  const { getWhatsappLink } = useCompanyProfile()

  const stockConfig = {
    available: {
      label: "Tersedia",
      classes: "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20"
    },
    preorder: {
      label: "Siap Produksi (Pre-Order)",
      classes: "bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20"
    },
    custom: {
      label: "Custom Made",
      classes: "bg-slate-50 text-slate-800 border-slate-200 dark:bg-slate-500/10 dark:text-slate-400 dark:border-slate-500/20"
    }
  }

  const currentStock = stockConfig[stockStatus] || stockConfig.available

  // WA Link Generation
  const waMessage = `Halo,\nSaya ingin konsultasi terkait produk:\n\n${name}\nSKU: ${sku}\n\nMohon informasi spesifikasi dan penawaran harga.`
  const waUrl = getWhatsappLink(waMessage)

  // RFQ Link Generation
  const rfqUrl = `/hubungi-kami?product=${encodeURIComponent(name)}&sku=${encodeURIComponent(sku)}`

  const trustIndicators = [
    "Produk Industri",
    "Dukungan Teknis",
    "Pengiriman Nasional",
    "Dokumen Tender"
  ]

  return (
    <div className="space-y-6 text-left">
      {/* Category, SKU, and Stock Status */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[10px] font-bold uppercase tracking-wider bg-muted text-muted-foreground px-2 py-0.5 rounded-md border border-border">
          {category}
        </span>
        <span className="text-[10px] font-mono font-semibold text-muted-foreground px-2 py-0.5 rounded-md border border-border bg-card">
          SKU: {sku}
        </span>
        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md border uppercase tracking-wider flex items-center gap-1 shadow-xs ${currentStock.classes}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse-slow" />
          {currentStock.label}
        </span>
      </div>

      {/* Product Title */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-extrabold text-foreground tracking-tight leading-snug">
          {name}
        </h1>
        <p className="text-xs text-muted-foreground leading-relaxed mt-3 font-semibold">
          {shortDescription}
        </p>
      </div>

      {/* Divider */}
      <div className="border-t border-border" />

      {/* Long Description */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">Deskripsi Lengkap</h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>

      {/* Trust Checklist */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
        {trustIndicators.map((t, idx) => (
          <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
            <CheckCircle2 className="h-4.5 w-4.5 text-accent shrink-0" />
            <span>{t}</span>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="border-t border-border" />

      {/* Call to Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          variant="warning"
          className="flex-1 font-bold text-xs h-11 rounded-lg gap-2 shadow-sm cursor-pointer"
          asChild
        >
          <Link to={rfqUrl}>
            <FileText className="h-4 w-4" />
            Minta Penawaran Harga (RFQ)
          </Link>
        </Button>
        
        <Button
          variant="outline"
          className="flex-1 font-semibold text-xs h-11 rounded-lg gap-2 cursor-pointer"
          asChild
        >
          <a href={waUrl} target="_blank" rel="noreferrer">
            <MessageSquare className="h-4.5 w-4.5 text-emerald-500" />
            Konsultasi Teknis
          </a>
        </Button>
      </div>
    </div>
  )
}
