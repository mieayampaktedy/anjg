import { useState, useMemo, useEffect, useRef } from "react"
import { Search, Plus, Pencil, Trash2, ChevronLeft, ChevronRight, Package, Loader2, Image as ImageIcon, Video, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn, getAssetUrl } from "@/lib/utils"
import api from "@/services/axios"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

const ITEMS_PER_PAGE = 5

export default function ManageProducts() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    categoryId: "",
    status: "available",
    youtube_url: "",
    specification: "",
    description: ""
  })
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState("")
  const fileInputRef = useRef(null)

  const fetchInitialData = async () => {
    try {
      Promise.resolve().then(() => setLoading(true))
      const [prodRes, catRes] = await Promise.all([
        api.get("/admin/products"),
        api.get("/admin/categories")
      ])
      setProducts(prodRes.data)
      setCategories(catRes.data)
    } catch (err) {
      console.error("Gagal mengambil data", err)
      toast.error("Gagal mengambil data katalog dari server.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInitialData()
  }, [])

  const handleOpenModal = (product = null) => {
    setImageFile(null)
    if (product) {
      setEditingProduct(product)
      setFormData({
        name: product.name,
        categoryId: product.categoryId.toString(),
        status: product.status,
        youtube_url: product.youtube_url || "",
        specification: product.specification || "",
        description: product.description || ""
      })
      const primaryImg = product.images?.find(img => img.is_primary)?.image_url || product.images?.[0]?.image_url
      setImagePreview(primaryImg ? getAssetUrl(primaryImg) : "")
    } else {
      setEditingProduct(null)
      setFormData({
        name: "",
        categoryId: categories[0]?.id?.toString() || "",
        status: "available",
        youtube_url: "",
        specification: "",
        description: ""
      })
      setImagePreview("")
    }
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingProduct(null)
    setImagePreview("")
    setImageFile(null)
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.name || !formData.categoryId || !formData.description) {
      toast.error("Mohon isi seluruh bidang wajib (*) terlebih dahulu.")
      return
    }

    const data = new FormData()
    data.append("name", formData.name)
    data.append("categoryId", formData.categoryId)
    data.append("status", formData.status)
    data.append("youtube_url", formData.youtube_url)
    data.append("specification", formData.specification)
    data.append("description", formData.description)
    if (imageFile) {
      data.append("image", imageFile)
    }

    try {
      if (editingProduct) {
        await api.put(`/admin/products/${editingProduct.id}`, data, {
          headers: { "Content-Type": "multipart/form-data" }
        })
        toast.success("Produk berhasil diperbarui")
      } else {
        await api.post("/admin/products", data, {
          headers: { "Content-Type": "multipart/form-data" }
        })
        toast.success("Produk berhasil ditambahkan")
      }
      handleCloseModal()
      fetchInitialData()
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal menyimpan data produk")
    }
  }

  const handleDeleteClick = (product) => {
    setEditingProduct(product)
    setIsDeleteOpen(true)
  }

  const handleDeleteConfirm = async () => {
    try {
      await api.delete(`/admin/products/${editingProduct.id}`)
      toast.success("Produk berhasil dihapus")
      setIsDeleteOpen(false)
      fetchInitialData()
    } catch (err) {
      console.error("Gagal menghapus produk", err)
      toast.error("Gagal menghapus produk")
    }
  }

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        (p.category?.name || "").toLowerCase().includes(search.toLowerCase())
      return matchSearch
    })
  }, [products, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE))
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  const getStatusBadge = (status) => {
    const config = {
      available: { label: "Tersedia", className: "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400" },
      preorder: { label: "Pre-Order", className: "bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400" },
      custom: { label: "Custom Made", className: "bg-slate-50 text-slate-800 border-slate-200 dark:bg-slate-500/10 dark:text-slate-400" }
    }
    const current = config[status] || config.available
    return (
      <span className={cn("px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider", current.className)}>
        {current.label}
      </span>
    )
  }

  return (
    <div className="space-y-6 text-left animate-page-fade">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Kelola Produk</h1>
          <p className="text-xs font-semibold text-muted-foreground mt-0.5">Manajemen katalog barang, mesin manufaktur, dan spesifikasi tender.</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold gap-2 h-10 px-4 text-sm shrink-0 rounded-lg cursor-pointer shadow-card">
          <Plus className="h-4 w-4" />
          Tambah Produk
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="bg-card border border-border rounded-xl p-4 shadow-card">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-400" />
          <Input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            placeholder="Cari produk berdasarkan nama atau kategori..."
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
                <th className="text-left px-5 py-3.5 font-semibold text-xs uppercase tracking-wider w-24">Gambar</th>
                <th className="text-left px-5 py-3.5 font-semibold text-xs uppercase tracking-wider">Nama Produk</th>
                <th className="text-left px-5 py-3.5 font-semibold text-xs uppercase tracking-wider hidden sm:table-cell">Kategori</th>
                <th className="text-left px-5 py-3.5 font-semibold text-xs uppercase tracking-wider">Status</th>
                <th className="text-left px-5 py-3.5 font-semibold text-xs uppercase tracking-wider hidden md:table-cell">Tgl Dibuat</th>
                <th className="text-center px-5 py-3.5 font-semibold text-xs uppercase tracking-wider w-24">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-slate-500">
                    <Loader2 className="h-8 w-8 text-primary animate-spin mx-auto mb-3" />
                    <p className="font-bold text-slate-700 dark:text-slate-350">Memuat data produk...</p>
                  </td>
                </tr>
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-slate-500">
                    <Package className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                    <p className="font-bold text-slate-700 dark:text-slate-350">Produk tidak ditemukan</p>
                  </td>
                </tr>
              ) : paginated.map((product) => {
                const primaryImg = product.images?.find(img => img.is_primary)?.image_url || product.images?.[0]?.image_url
                return (
                  <tr key={product.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-5 py-3">
                      <div className="w-12 aspect-[4/3] rounded-lg border border-border overflow-hidden bg-muted flex items-center justify-center shrink-0">
                        {primaryImg ? (
                          <img src={getAssetUrl(primaryImg)} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon className="h-5 w-5 text-muted-foreground/50" />
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div>
                        <div className="font-bold text-slate-900 dark:text-slate-100 line-clamp-1">{product.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">SKU: GTM-PD-{product.id.toString().padStart(2, '0')}</div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-slate-600 dark:text-slate-350 font-semibold hidden sm:table-cell">{product.category?.name || "Lainnya"}</td>
                    <td className="px-5 py-3.5">{getStatusBadge(product.status)}</td>
                    <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400 text-xs font-semibold hidden md:table-cell">
                      {new Date(product.createdAt).toLocaleDateString("id-ID")}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleOpenModal(product)}
                          className="p-2.5 text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                          aria-label="Edit Produk"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(product)}
                          className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors cursor-pointer"
                          aria-label="Hapus Produk"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        {totalPages > 1 && (
          <div className="px-5 py-4 border-t border-border flex items-center justify-between">
            <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold">
              Menampilkan <span className="text-slate-900 dark:text-white">{Math.min((page - 1) * ITEMS_PER_PAGE + 1, filtered.length)}</span> – <span className="text-slate-900 dark:text-white">{Math.min(page * ITEMS_PER_PAGE, filtered.length)}</span> dari <span className="text-slate-900 dark:text-white">{filtered.length}</span> produk
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
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProduct ? "Edit Produk" : "Tambah Produk"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold mb-1 block">Nama Produk <span className="text-red-500">*</span></label>
                <Input
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Masukkan nama produk"
                  className="text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-semibold mb-1 block">Kategori <span className="text-red-500">*</span></label>
                <select
                  required
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                >
                  <option value="" disabled>Pilih Kategori</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold mb-1 block">Status Ketersediaan</label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="available">Tersedia</option>
                  <option value="preorder">Pre-Order</option>
                  <option value="custom">Custom Made</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold mb-1 block flex items-center gap-1">
                  <Video className="h-3.5 w-3.5 text-muted-foreground" />
                  Link Video YouTube (Opsional)
                </label>
                <Input
                  value={formData.youtube_url}
                  onChange={(e) => setFormData({ ...formData, youtube_url: e.target.value })}
                  placeholder="https://youtube.com/watch?v=..."
                  className="text-xs"
                />
              </div>
            </div>

            {/* Image Upload Area */}
            <div>
              <label className="text-xs font-semibold mb-1 block flex items-center gap-1">
                <ImageIcon className="h-3.5 w-3.5 text-muted-foreground" />
                Gambar Produk {editingProduct ? "(Opsional)" : <span className="text-red-500">*</span>}
              </label>
              <div className="flex gap-4 items-center">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-20 aspect-[4/3] rounded-lg border border-dashed border-border hover:border-accent bg-muted flex items-center justify-center shrink-0 overflow-hidden cursor-pointer"
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

            <div>
              <label className="text-xs font-semibold mb-1 block flex items-center gap-1">
                <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                Spesifikasi Teknis <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={3}
                value={formData.specification}
                onChange={(e) => setFormData({ ...formData, specification: e.target.value })}
                placeholder="Rincian dimensi, berat, kapasitas, material..."
                className="w-full px-3 py-2 text-xs border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>

            <div>
              <label className="text-xs font-semibold mb-1 block">Deskripsi Produk <span className="text-red-500">*</span></label>
              <textarea
                required
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Deskripsi fungsi, keunggulan, garansi..."
                className="w-full px-3 py-2 text-xs border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>

            <DialogFooter className="pt-2">
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
            <DialogTitle>Hapus Produk</DialogTitle>
          </DialogHeader>
          <p>Apakah Anda yakin ingin menghapus produk <strong>{editingProduct?.name}</strong>? Gambar terkait juga akan dihapus. Tindakan ini tidak dapat dibatalkan.</p>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsDeleteOpen(false)}>Batal</Button>
            <Button type="button" variant="destructive" onClick={handleDeleteConfirm}>Hapus</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
