import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import {
  LayoutDashboard,
  Package,
  Tags,
  FileText,
  Users,
  Settings,
  LogOut,
  KeyRound,
  Info,
  MessageSquare,
  Home,
} from "lucide-react"
import { cn, getAssetUrl } from "@/lib/utils"
import { useAuth } from "@/contexts/AuthContext"
import { useCompanyProfile } from "@/hooks/useCompanyProfile"
import api from "@/services/axios"

const menuItems = [
  { label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Kelola Beranda", path: "/admin/beranda", icon: Home },
  { label: "Kelola Tentang Kami", path: "/admin/tentang", icon: Info },
  { label: "Kelola Produk", path: "/admin/produk", icon: Package },
  { label: "Kelola Kategori", path: "/admin/kategori", icon: Tags },
  { label: "Kelola Artikel", path: "/admin/artikel", icon: FileText },
  { label: "Pesan Masuk", path: "/admin/pesan", icon: MessageSquare },
  { label: "Manajemen User", path: "/admin/user", icon: Users },
  { label: "Pengaturan", path: "/admin/pengaturan", icon: Settings },
]

export default function AdminSidebar({ className }) {
  const { pathname } = useLocation()
  const { user, logout } = useAuth()
  const { profile } = useCompanyProfile()
  const [unreadCount, setUnreadCount] = useState(0)

  const isActive = (path) => pathname === path || pathname.startsWith(path + "/")

  const fetchUnreadCount = async () => {
    try {
      const res = await api.get('/admin/messages/unread-count')
      setUnreadCount(res.data.unreadCount)
    } catch (err) {
      console.error('Failed to fetch unread count:', err)
    }
  }

  useEffect(() => {
    fetchUnreadCount()
    
    // Poll every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000)

    // Listen to custom event
    window.addEventListener("unread-messages-updated", fetchUnreadCount)

    return () => {
      clearInterval(interval)
      window.removeEventListener("unread-messages-updated", fetchUnreadCount)
    }
  }, [])

  // Filter menus based on user role
  const visibleMenuItems = menuItems.filter(item => {
    if (item.path === '/admin/user' || item.path === '/admin/pengaturan') {
      return user?.role === 'SUPERADMIN';
    }
    return true;
  });

  return (
    <aside className={cn("w-60 bg-navy text-slate-400 flex flex-col shrink-0 h-screen sticky top-0 overflow-y-auto sidebar-scrollbar", className)}>
      {/* Brand */}
      <div className="px-5 py-5 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <img 
            src={profile.logo_url ? getAssetUrl(profile.logo_url) : "/logo.png"} 
            alt="CV Globalindo Teknik Mandiri" 
            className="h-7 w-auto object-contain" 
          />
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-3">
        <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest px-3 mb-3">
          Menu Utama
        </p>
        <ul className="space-y-0.5">
          {visibleMenuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={cn(
                  "flex items-center justify-between px-3 py-2.5 rounded-md text-sm font-medium transition-colors w-full",
                  isActive(item.path)
                    ? "bg-accent/20 text-white font-semibold"
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="h-4 w-4 shrink-0" />
                  <span>{item.label}</span>
                </div>
                {item.path === "/admin/pesan" && unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-extrabold tracking-tight">
                    {unreadCount}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom links */}
      <div className="p-3 border-t border-slate-800 space-y-0.5">
        <Link
          to="/admin/ganti-password"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
            isActive('/admin/ganti-password')
              ? "bg-accent/20 text-white font-semibold"
              : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
          )}
        >
          <KeyRound className="h-4 w-4 shrink-0" />
          Ganti Password
        </Link>
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors w-full text-left cursor-pointer"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          Keluar
        </button>
      </div>
    </aside>
  )
}
