import { useState, useMemo, useEffect, useRef } from "react"
import { Search, Plus, Pencil, Trash2, ChevronLeft, ChevronRight, BookOpen, Loader2, Image as ImageIcon, FileText, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn, getAssetUrl } from "@/lib/utils"
import api from "@/services/axios"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

const ITEMS_PER_PAGE = 6

export default function ManageArticles() {
  const [articles, setArticles] = useState([])
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [editingArticle, setEditingArticle] = useState(null)

  // Form states
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    status: "draft"
  })
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState("")
  const fileInputRef = useRef(null)

  const fetchArticles = async () => {
    try {
      Promise.resolve().then(() => setLoading(true))
      const res = await api.get("/admin/articles")
      setArticles(res.data)
    } catch (err) {
      console.error("Gagal mengambil data", err)
      toast.error("Gagal mengambil data artikel dari server.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchArticles()
  }, [])

  const handleOpenModal = (article = null) => {
    setImageFile(null)
    if (article) {
      setEditingArticle(article)
      setFormData({
        title: article.title,
        content: article.content,
        status: article.status
      })
      setImagePreview(article.image_url ? getAssetUrl(article.image_url) : "")
    } else {
      setEditingArticle(null)
      setFormData({ title: "", content: "", status: "draft" })
      setImagePreview("")
    }
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingArticle(null)
    setImagePreview("")
    setImageFile(null)
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => setImagePreview(reader.result)
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.title || !formData.content) {
      toast.error("Judul dan Konten artikel wajib diisi.")
      return
    }

    const data = new FormData()
    data.append("title", formData.title)
    data.append("content", formData.content)
    data.append("status", formData.status)
    if (imageFile) {
      data.append("image", imageFile)
    }

    try {
      if (editingArticle) {
        await api.put(`/admin/articles/${editingArticle.id}`, data, {
          headers: { "Content-Type": "multipart/form-data" }
        })
        toast.success("Artikel berhasil diperbarui")
      } else {
        await api.post("/admin/articles", data, {
          headers: { "Content-Type": "multipart/form-data" }
        })
        toast.success("Artikel berhasil ditambahkan")
      }
      handleCloseModal()
      fetchArticles()
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal menyimpan data artikel")
    }
  }

  const handleDeleteClick = (article) => {
    setEditingArticle(article)
    setIsDeleteOpen(true)
  }

  const handleDeleteConfirm = async () => {
    try {
      await api.delete(`/admin/articles/${editingArticle.id}`)
      toast.success("Artikel berhasil dihapus")
      setIsDeleteOpen(false)
      setEditingArticle(null)
      fetchArticles()
    } catch (err) {
      console.error("Gagal menghapus artikel", err)
      toast.error("Gagal menghapus artikel")
    }
  }

  const filtered = useMemo(() => {
    return articles.filter((a) =>
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      (a.content || "").toLowerCase().includes(search.toLowerCase())
    )
  }, [articles, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE))
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  const getStatusBadge = (status) => {
    const config = {
      published: { label: "Dipublikasi", icon: Eye, className: "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400" },
      draft: { label: "Draft", icon: EyeOff, className: "bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-500/10 dark:text-slate-400" }
    }
    const c = config[status] || config.draft
    const Icon = c.icon
    return (
      <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider", c.className)}>
        <Icon className="h-3 w-3" />
        {c.label}
      </span>
    )
  }

  // Content snippet helper
  const getSnippet = (content, maxLen = 80) => {
    if (!content) return "-"
    const plain = content.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim()
    return plain.length > maxLen ? plain.slice(0, maxLen) + "…" : plain
  }

  return (
    <div className="space-y-6 text-left animate-page-fade">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Kelola Artikel</h1>
          <p className="text-xs font-semibold text-muted-foreground mt-0.5">Manajemen konten knowledge center dan panduan teknis perusahaan.</p>
        </div>
        <Button
          onClick={() => handleOpenModal()}
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold gap-2 h-10 px-4 text-sm shrink-0 rounded-lg cursor-pointer shadow-card"
        >
          <Plus className="h-4 w-4" />
          Tulis Artikel
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="bg-card border border-border rounded-xl p-4 shadow-card">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-400" />
          <Input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            placeholder="Cari artikel berdasarkan judul atau konten..."
            className="pl-9 h-10 text-xs border-border bg-background focus-visible:ring-accent"
          />
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-900/50 text-slate-700 dark:text-slate-300 border-b border-border">
                <th className="text-left px-5 py-3.5 font-semibold text-xs uppercase tracking-wider w-20 hidden sm:table-cell">Gambar</th>
                <th className="text-left px-5 py-3.5 font-semibold text-xs uppercase tracking-wider">Judul & Cuplikan</th>
                <th className="text-left px-5 py-3.5 font-semibold text-xs uppercase tracking-wider">Status</th>
                <th className="text-left px-5 py-3.5 font-semibold text-xs uppercase tracking-wider hidden md:table-cell">Tgl Dibuat</th>
                <th className="text-center px-5 py-3.5 font-semibold text-xs uppercase tracking-wider w-24">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-16 text-slate-500">
                    <Loader2 className="h-8 w-8 text-primary animate-spin mx-auto mb-3" />
                    <p className="font-bold text-slate-700 dark:text-slate-350">Memuat data artikel...</p>
                  </td>
                </tr>
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-16 text-slate-500">
                    <BookOpen className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                    <p className="font-bold text-slate-700 dark:text-slate-350">Artikel tidak ditemukan</p>
                    <p className="text-xs text-slate-400 mt-1">Klik "Tulis Artikel" untuk membuat konten baru.</p>
                  </td>
                </tr>
              ) : paginated.map((article) => (
                <tr key={article.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-5 py-3 hidden sm:table-cell">
                    <div className="w-14 aspect-video rounded-lg border border-border overflow-hidden bg-muted flex items-center justify-center shrink-0">
                      {article.image_url ? (
                        <img
                          src={getAssetUrl(article.image_url)}
                          alt={article.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ImageIcon className="h-5 w-5 text-muted-foreground/50" />
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3.5 max-w-xs">
                    <div className="font-bold text-slate-900 dark:text-slate-100 line-clamp-1">{article.title}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">{getSnippet(article.content)}</div>
                  </td>
                  <td className="px-5 py-3.5">{getStatusBadge(article.status)}</td>
                  <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400 text-xs font-semibold hidden md:table-cell">
                    {new Date(article.createdAt).toLocaleDateString("id-ID")}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => handleOpenModal(article)}
                        className="p-2.5 text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                        aria-label="Edit Artikel"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(article)}
                        className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors cursor-pointer"
                        aria-label="Hapus Artikel"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Footer (Pagination) */}
        {totalPages > 1 && (
          <div className="px-5 py-4 border-t border-border flex items-center justify-between">
            <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold">
              Menampilkan{" "}
              <span className="text-slate-900 dark:text-white">{Math.min((page - 1) * ITEMS_PER_PAGE + 1, filtered.length)}</span>
              {" – "}
              <span className="text-slate-900 dark:text-white">{Math.min(page * ITEMS_PER_PAGE, filtered.length)}</span>
              {" dari "}
              <span className="text-slate-900 dark:text-white">{filtered.length}</span> artikel
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-11 h-11 flex items-center justify-center rounded-lg border border-border text-slate-500 dark:text-slate-400 hover:bg-background disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                aria-label="Halaman Sebelumnya"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={cn(
                    "w-11 h-11 flex items-center justify-center rounded-lg border text-xs font-bold transition-colors cursor-pointer",
                    page === i + 1
                      ? "bg-primary border-primary text-primary-foreground"
                      : "border-border text-muted-foreground hover:bg-muted"
                  )}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="w-11 h-11 flex items-center justify-center rounded-lg border border-border text-slate-500 dark:text-slate-400 hover:bg-background disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                aria-label="Halaman Selanjutnya"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal Add/Edit */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingArticle ? "Edit Artikel" : "Tulis Artikel Baru"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 text-left">

            {/* Title */}
            <div>
              <label className="text-xs font-semibold mb-1 block">Judul Artikel <span className="text-red-500">*</span></label>
              <Input
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Masukkan judul artikel yang menarik..."
                className="text-xs"
              />
            </div>

            {/* Status */}
            <div>
              <label className="text-xs font-semibold mb-1 block">Status Publikasi</label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="draft">Draft (Tersimpan, tidak tampil di publik)</option>
                <option value="published">Dipublikasi (Tampil di halaman artikel)</option>
              </select>
            </div>

            {/* Image Upload */}
            <div>
              <label className="text-xs font-semibold mb-1 flex items-center gap-1">
                <ImageIcon className="h-3.5 w-3.5 text-muted-foreground" />
                Gambar Thumbnail {editingArticle ? "(Opsional — kosongkan jika tidak diganti)" : ""}
              </label>
              <div className="flex gap-4 items-center">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-24 aspect-video rounded-lg border border-dashed border-border hover:border-accent bg-muted flex items-center justify-center shrink-0 overflow-hidden cursor-pointer"
                >
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <Plus className="h-5 w-5 text-muted-foreground/45" />
                  )}
                </div>
                <div className="space-y-1">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs h-8"
                  >
                    Pilih File
                  </Button>
                  <p className="text-[10px] text-muted-foreground">Format JPG, PNG, atau WEBP. Maksimal 2MB.</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div>
              <label className="text-xs font-semibold mb-1 flex items-center gap-1">
                <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                Konten Artikel <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={10}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Tulis konten artikel di sini. Anda bisa menggunakan format teks biasa atau HTML sederhana..."
                className="w-full px-3 py-2 text-xs border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-accent resize-y"
              />
              <p className="text-[10px] text-muted-foreground mt-1">
                Konten ini akan ditampilkan di halaman detail artikel publik.
              </p>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={handleCloseModal}>Batal</Button>
              <Button type="submit">{editingArticle ? "Simpan Perubahan" : "Publikasi Artikel"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Artikel</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Apakah Anda yakin ingin menghapus artikel{" "}
            <strong className="text-foreground">"{editingArticle?.title}"</strong>?
            Gambar terkait juga akan dihapus. Tindakan ini tidak dapat dibatalkan.
          </p>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsDeleteOpen(false)}>Batal</Button>
            <Button type="button" variant="destructive" onClick={handleDeleteConfirm}>Hapus Permanen</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
