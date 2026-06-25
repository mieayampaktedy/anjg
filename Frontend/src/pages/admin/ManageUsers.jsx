import { useState, useMemo, useEffect } from "react"
import { Plus, Search, Pencil, Trash2, ShieldAlert } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import api from "@/services/axios"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

export default function ManageUsers() {
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  
  // Form state
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "ADMIN"
  })

  const fetchUsers = async () => {
    try {
      Promise.resolve().then(() => setLoading(true))
      const res = await api.get('/admin/users')
      setUsers(res.data)
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal mengambil data user")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleOpenModal = (user = null) => {
    if (user) {
      setEditingUser(user)
      setFormData({ username: user.username, password: "", role: user.role })
    } else {
      setEditingUser(null)
      setFormData({ username: "", password: "", role: "ADMIN" })
    }
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingUser(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingUser) {
        const payload = { username: formData.username, role: formData.role }
        if (formData.password) payload.password = formData.password
        await api.put(`/admin/users/${editingUser.id}`, payload)
        toast.success("User berhasil diupdate")
      } else {
        if (!formData.password) {
          toast.error("Password wajib diisi untuk user baru")
          return
        }
        await api.post('/admin/users', formData)
        toast.success("User berhasil ditambahkan")
      }
      handleCloseModal()
      fetchUsers()
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal menyimpan user")
    }
  }

  const handleDeleteClick = (user) => {
    setEditingUser(user)
    setIsDeleteOpen(true)
  }

  const handleDeleteConfirm = async () => {
    try {
      await api.delete(`/admin/users/${editingUser.id}`)
      toast.success("User berhasil dihapus")
      setIsDeleteOpen(false)
      fetchUsers()
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal menghapus user")
    }
  }

  const filtered = useMemo(() => {
    return users.filter((u) => {
      return (
        u.username.toLowerCase().includes(search.toLowerCase()) ||
        u.role.toLowerCase().includes(search.toLowerCase())
      )
    })
  }, [users, search])

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Manajemen User</h1>
          <p className="text-xs font-semibold text-muted-foreground mt-0.5">Kelola hak akses administrator, editor, dan staf internal.</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold gap-2 h-10 px-4 text-sm shrink-0 rounded-lg cursor-pointer shadow-card">
          <Plus className="h-4 w-4" />
          Tambah User
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="bg-card border border-border rounded-xl p-4 shadow-card">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari user berdasarkan username atau peran..."
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
                <th className="text-left px-5 py-3.5 font-semibold text-xs uppercase tracking-wider">Username</th>
                <th className="text-left px-5 py-3.5 font-semibold text-xs uppercase tracking-wider hidden sm:table-cell">Peran Akses</th>
                <th className="text-left px-5 py-3.5 font-semibold text-xs uppercase tracking-wider hidden md:table-cell">Dibuat Pada</th>
                <th className="text-center px-5 py-3.5 font-semibold text-xs uppercase tracking-wider w-24">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={4} className="text-center py-16 text-slate-500">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                    <p className="font-bold text-slate-700 dark:text-slate-350">Memuat data...</p>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-16 text-slate-500">
                    <ShieldAlert className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                    <p className="font-bold text-slate-700 dark:text-slate-350">User tidak ditemukan</p>
                  </td>
                </tr>
              ) : filtered.map((u) => (
                <tr key={u.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-600 dark:text-slate-300 shrink-0 uppercase">
                        {u.username.substring(0, 2)}
                      </div>
                      <span className="font-bold text-slate-900 dark:text-slate-100">{u.username}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-slate-700 dark:text-slate-350 font-semibold hidden sm:table-cell">{u.role}</td>
                  <td className="px-5 py-3.5 text-slate-600 dark:text-slate-400 font-medium text-xs hidden md:table-cell">
                    {new Date(u.createdAt).toLocaleDateString('id-ID')}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => handleOpenModal(u)}
                        className="p-2.5 text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                        aria-label="Edit User"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(u)}
                        className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors cursor-pointer"
                        aria-label="Hapus User"
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
      </div>

      {/* Modal Add/Edit */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingUser ? "Edit User" : "Tambah User"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-semibold mb-1 block">Username</label>
              <Input
                required
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="Masukkan username"
              />
            </div>
            <div>
              <label className="text-sm font-semibold mb-1 block">
                Password {editingUser && <span className="text-slate-400 font-normal">(Kosongkan jika tidak ingin mengubah)</span>}
              </label>
              <Input
                type="password"
                required={!editingUser}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Masukkan password"
              />
            </div>
            <div>
              <label className="text-sm font-semibold mb-1 block">Peran Akses</label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <option value="ADMIN">ADMIN</option>
                <option value="SUPERADMIN">SUPERADMIN</option>
              </select>
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
            <DialogTitle>Hapus User</DialogTitle>
          </DialogHeader>
          <p>Apakah Anda yakin ingin menghapus user <strong>{editingUser?.username}</strong>? Tindakan ini tidak dapat dibatalkan.</p>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsDeleteOpen(false)}>Batal</Button>
            <Button type="button" variant="destructive" onClick={handleDeleteConfirm}>Hapus</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
