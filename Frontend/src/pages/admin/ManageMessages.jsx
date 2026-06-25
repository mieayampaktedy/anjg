import { useState, useMemo, useEffect } from "react"
import { Search, Trash2, ChevronLeft, ChevronRight, MessageSquare, Mail, Phone, Calendar, CheckCircle2, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import api from "@/services/axios"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

const ITEMS_PER_PAGE = 8

export default function ManageMessages() {
  const [messages, setMessages] = useState([])
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("all") // 'all', 'unread', 'read'
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)

  // Modals
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [messageToDelete, setMessageToDelete] = useState(null)

  const fetchMessages = async () => {
    try {
      Promise.resolve().then(() => setLoading(true))
      const res = await api.get("/admin/messages")
      setMessages(res.data)
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal mengambil data pesan")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMessages()
  }, [])

  const handleOpenDetail = async (msg) => {
    setSelectedMessage(msg)
    setIsDetailOpen(true)

    // If message is unread, mark it as read on the backend
    if (!msg.isRead) {
      try {
        await api.patch(`/admin/messages/${msg.id}/read`)
        // Update local state instantly
        setMessages((prev) =>
          prev.map((m) => (m.id === msg.id ? { ...m, isRead: true } : m))
        )
        // Trigger a custom event to notify AdminTopbar to update its bell count
        window.dispatchEvent(new Event("unread-messages-updated"))
      } catch (err) {
        console.error("Gagal mengubah status baca:", err)
      }
    }
  }

  const handleDeleteClick = (msg, e) => {
    e.stopPropagation() // Prevent opening detail modal
    setMessageToDelete(msg)
    setIsDeleteOpen(true)
  }

  const handleDeleteConfirm = async () => {
    try {
      await api.delete(`/admin/messages/${messageToDelete.id}`)
      toast.success("Pesan berhasil dihapus")
      setIsDeleteOpen(false)
      setMessageToDelete(null)
      fetchMessages()
      // Trigger update for AdminTopbar
      window.dispatchEvent(new Event("unread-messages-updated"))
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal menghapus pesan")
    }
  }

  // Filter & Search Logic
  const processedMessages = useMemo(() => {
    return messages
      .filter((msg) => {
        // Tab filters
        if (filter === "unread") return !msg.isRead
        if (filter === "read") return msg.isRead
        return true
      })
      .filter((msg) => {
        // Search filter
        const s = search.toLowerCase()
        return (
          msg.fullName.toLowerCase().includes(s) ||
          msg.email.toLowerCase().includes(s) ||
          msg.phone.toLowerCase().includes(s) ||
          msg.message.toLowerCase().includes(s)
        )
      })
  }, [messages, filter, search])

  // Pagination
  const totalPages = Math.max(1, Math.ceil(processedMessages.length / ITEMS_PER_PAGE))
  const paginated = useMemo(() => {
    return processedMessages.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)
  }, [processedMessages, page])



  const formatDate = (dateStr) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    }
    return new Date(dateStr).toLocaleDateString('id-ID', options)
  }

  return (
    <div className="space-y-6 text-left animate-page-fade">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Pesan Masuk</h1>
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
          Kelola pesan penawaran, konsultasi, dan pengajuan RFQ dari formulir kontak.
        </p>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-card p-4 rounded-xl border border-border">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground/60" />
          <Input
            placeholder="Cari pengirim atau isi pesan..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="pl-9 h-9 text-xs"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex bg-muted p-1 rounded-lg w-full sm:w-auto self-stretch sm:self-auto">
          {[
            { id: "all", label: "Semua" },
            { id: "unread", label: "Belum Dibaca" },
            { id: "read", label: "Sudah Dibaca" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setFilter(tab.id); setPage(1); }}
              className={cn(
                "flex-1 sm:flex-initial px-4 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer",
                filter === tab.id
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.label}
              {tab.id === "unread" && messages.filter(m => !m.isRead).length > 0 && (
                <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-rose-500 text-white text-[9px] font-bold">
                  {messages.filter(m => !m.isRead).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Message List */}
      <div className="surface-panel rounded-xl overflow-hidden shadow-card border border-border">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-muted-foreground">
            <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mb-3"></div>
            <p className="text-xs font-semibold">Memuat data pesan...</p>
          </div>
        ) : paginated.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-center text-muted-foreground px-4">
            <MessageSquare className="h-10 w-10 text-slate-300 dark:text-slate-700 mb-3" />
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Tidak ada pesan</p>
            <p className="text-xs mt-1 max-w-xs leading-relaxed">
              Tidak ada pesan masuk yang memenuhi kriteria pencarian atau filter Anda.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {paginated.map((msg) => (
              <div
                key={msg.id}
                onClick={() => handleOpenDetail(msg)}
                className={cn(
                  "p-5 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center hover:bg-muted/30 transition-colors cursor-pointer text-left relative",
                  !msg.isRead && "bg-accent/5 dark:bg-accent/5 font-semibold"
                )}
              >
                {/* Unread Indicator strip */}
                {!msg.isRead && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent" />
                )}

                <div className="space-y-1.5 max-w-2xl flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-bold text-foreground">
                      {msg.fullName}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full border bg-muted text-muted-foreground truncate max-w-[150px] sm:max-w-none">
                      {msg.email}
                    </span>
                    {!msg.isRead ? (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold flex items-center gap-1">
                        <Clock className="h-3 w-3" /> Baru
                      </span>
                    ) : (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" /> Dibaca
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-1 leading-relaxed">
                    {msg.message}
                  </p>
                  <div className="flex items-center gap-4 text-[10px] text-muted-foreground/60 font-semibold">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {formatDate(msg.createdAt)}
                    </span>
                    {msg.phone && (
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {msg.phone}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-stretch md:self-auto justify-end border-t md:border-t-0 pt-3 md:pt-0 border-border/40 shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-11 text-xs font-bold gap-1 cursor-pointer border-border hover:bg-muted"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleOpenDetail(msg)
                    }}
                  >
                    Buka Pesan
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-11 w-11 text-muted-foreground hover:text-rose-600 hover:bg-rose-500/10 cursor-pointer rounded-lg flex items-center justify-center"
                    onClick={(e) => handleDeleteClick(msg, e)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination controls */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-xs text-muted-foreground">
            Menampilkan <span className="font-semibold">{Math.min(processedMessages.length, (page - 1) * ITEMS_PER_PAGE + 1)}-{Math.min(processedMessages.length, page * ITEMS_PER_PAGE)}</span> dari <span className="font-semibold">{processedMessages.length}</span> pesan
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-11 w-11 cursor-pointer flex items-center justify-center"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {[...Array(totalPages)].map((_, i) => (
              <Button
                key={i}
                variant={page === i + 1 ? "default" : "outline"}
                size="sm"
                className={cn("h-11 w-11 text-xs cursor-pointer flex items-center justify-center", page === i + 1 ? "bg-primary text-primary-foreground font-bold" : "hover:bg-muted")}
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </Button>
            ))}
            <Button
              variant="outline"
              size="icon"
              className="h-11 w-11 cursor-pointer flex items-center justify-center"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Message Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto bg-card text-foreground border border-border rounded-xl">
          {selectedMessage && (
            <>
              <DialogHeader className="text-left border-b border-border pb-4">
                <div className="flex items-center gap-2.5 mb-1.5">
                  <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <div>
                    <DialogTitle className="text-base font-extrabold tracking-tight">Detail Pesan Masuk</DialogTitle>
                    <p className="text-[10px] text-muted-foreground/60 font-semibold uppercase tracking-wider">
                      ID Pesan: #{selectedMessage.id}
                    </p>
                  </div>
                </div>
              </DialogHeader>

              {/* Message Details */}
              <div className="space-y-5 py-4 text-xs">
                {/* Meta details grid */}
                <div className="grid grid-cols-2 gap-4 bg-muted/40 p-4 rounded-xl border border-border/30">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Nama Pengirim</p>
                    <p className="font-bold text-foreground">{selectedMessage.fullName}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Tanggal Diterima</p>
                    <p className="font-bold text-foreground">{formatDate(selectedMessage.createdAt)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Email</p>
                    <p className="font-bold text-foreground break-all">{selectedMessage.email}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Nomor Telepon</p>
                    <p className="font-bold text-foreground">{selectedMessage.phone || "-"}</p>
                  </div>
                </div>

                {/* Content Message */}
                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Isi Pesan / Spesifikasi Pengajuan</p>
                  <div className="bg-muted/20 border border-border p-4 rounded-xl whitespace-pre-line leading-relaxed text-xs text-foreground font-medium overflow-y-auto max-h-60 custom-scrollbar">
                    {selectedMessage.message}
                  </div>
                </div>
              </div>

              {/* Action Buttons to Reply */}
              <DialogFooter className="border-t border-border pt-4 flex-col sm:flex-row gap-2">
                <div className="flex flex-wrap gap-2 w-full justify-between items-center">
                  <div className="flex gap-2">
                    {/* Reply WhatsApp */}
                    {selectedMessage.phone && (
                      <a
                        href={`https://wa.me/${selectedMessage.phone.replace(/[^0-9]/g, "")}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg text-xs font-bold bg-emerald-500 hover:bg-emerald-600 text-white transition-colors"
                      >
                        <MessageSquare className="h-4 w-4" />
                        Balas WA
                      </a>
                    )}
                    {/* Reply Email */}
                    <a
                      href={`mailto:${selectedMessage.email}?subject=Balasan Kontak - CV Globalindo Teknik Mandiri`}
                      className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg text-xs font-bold bg-primary hover:bg-primary/90 text-primary-foreground transition-colors"
                    >
                      <Mail className="h-4 w-4" />
                      Balas Email
                    </a>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setIsDetailOpen(false)}
                    className="h-9 px-4 text-xs border-border hover:bg-muted font-bold cursor-pointer"
                  >
                    Tutup
                  </Button>
                </div>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="max-w-sm bg-card text-foreground border border-border rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-base font-extrabold text-left tracking-tight">Hapus Pesan</DialogTitle>
          </DialogHeader>
          <div className="py-2 text-xs text-muted-foreground leading-relaxed text-left">
            Apakah Anda yakin ingin menghapus pesan dari <span className="font-bold text-foreground">{messageToDelete?.fullName}</span>? Tindakan ini tidak dapat dibatalkan.
          </div>
          <DialogFooter className="gap-2 justify-end">
            <Button
              variant="outline"
              className="h-9 text-xs border-border hover:bg-muted font-bold cursor-pointer"
              onClick={() => setIsDeleteOpen(false)}
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              className="h-9 text-xs bg-rose-600 hover:bg-rose-700 text-white font-bold cursor-pointer"
              onClick={handleDeleteConfirm}
            >
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
