import { useState, useMemo, useEffect } from "react"
import { Search, Plus, Pencil, Trash2, ChevronLeft, ChevronRight, Tags, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import api from "@/services/axios"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

const ITEMS_PER_PAGE = 5

export default function ManageCategories() {
  const [categories, setCategories] = useState([])
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)

  // Form state
  const [formData, setFormData] = useState({ name: "" })

  const fetchCategories = async () => {
    try {
      Promise.resolve().then(() => setLoading(true))
      const res = await api.get("/admin/categories")
      setCategories(res.data)
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal mengambil data kategori")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const handleOpenModal = (category = null) => {
    if (category) {
      setEditingCategory(category)
      setFormData({ name: category.name })
    } else {
      setEditingCategory(null)
      setFormData({ name: "" })
    }
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingCategory(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (formData.name.trim().length < 3) {
      toast.error("Nama kategori minimal 3 karakter")
      return
    }

    try {
      if (editingCategory) {
        await api.put(`/admin/categories/${editingCategory.id}`, formData)
        toast.success("Kategori berhasil diperbarui")
      } else {
        await api.post("/admin/categories", formData)
        toast.success("Kategori berhasil ditambahkan")
      }
      handleCloseModal()
      fetchCategories()
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal menyimpan kategori")
    }
  }

  const handleDeleteClick = (category) => {
    setEditingCategory(category)
    setIsDeleteOpen(true)
  }

  const handleDeleteConfirm = async () => {
    try {
      await api.delete(`/admin/categories/${editingCategory.id}`)
      toast.success("Kategori berhasil dihapus")
      setIsDeleteOpen(false)
      fetchCategories()
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal menghapus kategori")
    }
  }

  const filtered = useMemo(() => {
    return categories.filter((c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.slug.toLowerCase().includes(search.toLowerCase())
    )
  }, [categories, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE))
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  return (
    <div className="space-y-6 text-left animate-page-fade">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Kelola Kategori</h1>
          <p className="text-xs font-semibold text-muted-foreground mt-0.5">Manajemen kategori produk untuk klasifikasi katalog.</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold gap-2 h-10 px-4 text-sm shrink-0 rounded-lg cursor-pointer shadow-card">
          <Plus className="h-4 w-4" />
          Tambah Kategori
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="bg-card border border-border rounded-xl p-4 shadow-card">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-400" />
          <Input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            placeholder="Cari kategori berdasarkan nama atau slug..."
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
                <th className="text-left px-5 py-3.5 font-semibold text-xs uppercase tracking-wider w-16 hidden md:table-cell">ID</th>
                <th className="text-left px-5 py-3.5 font-semibold text-xs uppercase tracking-wider">Nama Kategori</th>
                <th className="text-left px-5 py-3.5 font-semibold text-xs uppercase tracking-wider hidden md:table-cell">Slug URL</th>
                <th className="text-left px-5 py-3.5 font-semibold text-xs uppercase tracking-wider">Jumlah Produk</th>
                <th className="text-left px-5 py-3.5 font-semibold text-xs uppercase tracking-wider hidden sm:table-cell">Tanggal Dibuat</th>
                <th className="text-center px-5 py-3.5 font-semibold text-xs uppercase tracking-wider w-24">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-slate-500">
                    <Loader2 className="h-8 w-8 text-primary animate-spin mx-auto mb-3" />
                    <p className="font-bold text-slate-700 dark:text-slate-350">Memuat data kategori...</p>
                  </td>
                </tr>
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-slate-500">
                    <Tags className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                    <p className="font-bold text-slate-700 dark:text-slate-350">Kategori tidak ditemukan</p>
                  </td>
                </tr>
              ) : paginated.map((category) => (
                <tr key={category.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-5 py-3.5 font-semibold text-slate-500 dark:text-slate-400 hidden md:table-cell">{category.id}</td>
                  <td className="px-5 py-3.5 font-bold text-slate-900 dark:text-slate-100">{category.name}</td>
                  <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400 font-mono text-xs hidden md:table-cell">{category.slug}</td>
                  <td className="px-5 py-3.5 text-slate-700 dark:text-slate-350 font-semibold">
                    {category.products ? category.products.length : 0} Produk
                  </td>
                  <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400 text-xs font-semibold hidden sm:table-cell">
                    {new Date(category.createdAt).toLocaleDateString("id-ID")}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => handleOpenModal(category)}
                        className="p-2.5 text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                        aria-label="Edit Kategori"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(category)}
                        className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors cursor-pointer"
                        aria-label="Hapus Kategori"
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

        {/* Table Footer */}
        {totalPages > 1 && (
          <div className="px-5 py-4 border-t border-border flex items-center justify-between">
            <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold">
              Menampilkan <span className="text-slate-900 dark:text-white">{Math.min((page - 1) * ITEMS_PER_PAGE + 1, filtered.length)}</span> – <span className="text-slate-900 dark:text-white">{Math.min(page * ITEMS_PER_PAGE, filtered.length)}</span> dari <span className="text-slate-900 dark:text-white">{filtered.length}</span> kategori
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingCategory ? "Edit Kategori" : "Tambah Kategori"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div>
              <label className="text-sm font-semibold mb-1 block">Nama Kategori</label>
              <Input
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Masukkan nama kategori"
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseModal}>Batal</Button>
              <Button type="submit">Simpan</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Kategori</DialogTitle>
          </DialogHeader>
          <p>Apakah Anda yakin ingin menghapus kategori <strong>{editingCategory?.name}</strong>? Seluruh produk dalam kategori ini juga dapat terpengaruh. Tindakan ini tidak dapat dibatalkan.</p>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsDeleteOpen(false)}>Batal</Button>
            <Button type="button" variant="destructive" onClick={handleDeleteConfirm}>Hapus</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
