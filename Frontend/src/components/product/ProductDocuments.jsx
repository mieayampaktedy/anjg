import { toast } from "sonner"
import { FileText, Download } from "lucide-react"

export default function ProductDocuments({ documents = [] }) {
  if (documents.length === 0) return null

  const handleDownload = (docTitle) => {
    toast.info(`Unduh "${docTitle}": Dokumen akan tersedia setelah backend terintegrasi.`)
  }

  return (
    <div className="space-y-4 text-left">
      <h2 className="text-lg font-bold text-foreground tracking-tight">Dokumen Pendukung & Brosur</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {documents.map((doc, idx) => (
          <div
            key={idx}
            onClick={() => handleDownload(doc.title)}
            className="group surface-card p-4 flex items-center justify-between hover:shadow-card-hover hover:border-border/80 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 flex items-center justify-center shrink-0">
                <FileText className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-foreground text-xs truncate">
                  {doc.title}
                </h4>
                <p className="text-[10px] text-muted-foreground font-mono mt-0.5 uppercase">
                  {doc.type} • {doc.size}
                </p>
              </div>
            </div>
            
            <div className="w-8 h-8 rounded-lg border border-border bg-background flex items-center justify-center shrink-0 text-muted-foreground group-hover:text-accent group-hover:border-accent/30 group-hover:bg-accent/5 transition-all active:scale-90">
              <Download className="h-3.5 w-3.5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
