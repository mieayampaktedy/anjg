import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import AdminSidebar from "./AdminSidebar"
import { Bell, Menu, Search, User, Sun, Moon, Monitor, MessageSquare } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/contexts/ThemeContext"
import { cn } from "@/lib/utils"
import api from "@/services/axios"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"

export default function AdminTopbar() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const location = useLocation()
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsSheetOpen(false)
  }, [location.pathname])
  const [unreadCount, setUnreadCount] = useState(0)
  const [recentMessages, setRecentMessages] = useState([])

  const fetchNotifications = async () => {
    try {
      const [msgRes, countRes] = await Promise.all([
        api.get("/admin/messages"),
        api.get("/admin/messages/unread-count")
      ])
      
      const now = Date.now()
      const formatBrief = (dateStr) => {
        const date = new Date(dateStr)
        const diffMs = now - date.getTime()
        const diffMins = Math.floor(diffMs / 60000)
        if (diffMins < 1) return `Baru saja`
        if (diffMins < 60) return `${diffMins}m lalu`
        const diffHours = Math.floor(diffMins / 60)
        if (diffHours < 24) return `${diffHours}j lalu`
        return date.toLocaleDateString("id-ID", { day: "numeric", month: "short" })
      }

      setRecentMessages(msgRes.data.slice(0, 5).map(msg => ({
        ...msg,
        timeBrief: formatBrief(msg.createdAt)
      })))
      setUnreadCount(countRes.data.unreadCount)
    } catch (err) {
      console.error("Failed to fetch notification data:", err)
    }
  }

  useEffect(() => {
    const init = async () => {
      await fetchNotifications()
    }
    init()

    // Poll every 30 seconds
    const interval = setInterval(fetchNotifications, 30000)

    // Listen to custom event
    window.addEventListener("unread-messages-updated", fetchNotifications)

    return () => {
      clearInterval(interval)
      window.removeEventListener("unread-messages-updated", fetchNotifications)
    }
  }, [])

  const handleMarkAsRead = async (msg) => {
    if (!msg.isRead) {
      try {
        await api.patch(`/admin/messages/${msg.id}/read`)
        window.dispatchEvent(new Event("unread-messages-updated"))
      } catch (err) {
        console.error("Gagal mengubah status baca:", err)
      }
    }
  }

  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 sticky top-0 z-10 text-foreground">
      <div className="flex items-center gap-4">
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden text-muted-foreground h-10 w-10 rounded-xl border border-border bg-card hover:bg-accent hover:text-foreground transition-all duration-200 focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 cursor-pointer"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-60 border-none bg-navy text-slate-400">
            <AdminSidebar className="h-full w-full border-none" />
          </SheetContent>
        </Sheet>
        <div className="relative hidden sm:block w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
          <Input 
            placeholder="Cari data..." 
            className="pl-9 bg-muted/50 border border-transparent hover:border-border/50 focus-visible:border-border focus-visible:bg-background text-xs text-foreground h-10 rounded-xl transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-0"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Subtle Theme Toggle Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-10 w-10 rounded-xl border transition-all duration-200 shrink-0 cursor-pointer focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2",
                resolvedTheme === 'dark'
                  ? "bg-slate-800 text-yellow-400 border-slate-700 hover:bg-slate-700/80"
                  : "bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100/80"
              )}
              aria-label="Pilih Tema"
            >
              {theme === 'dark' && <Moon className="h-4.5 w-4.5" />}
              {theme === 'light' && <Sun className="h-4.5 w-4.5" />}
              {theme === 'system' && <Monitor className="h-4.5 w-4.5" />}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-popover text-popover-foreground border border-border w-32 shadow-soft-md rounded-xl p-1">
            <DropdownMenuItem onClick={() => setTheme('light')} className={cn(
              "focus:bg-accent focus:text-accent-foreground gap-2 cursor-pointer text-xs py-2 px-2.5 rounded-lg transition-colors",
              theme === 'light' ? "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400 font-medium" : "text-muted-foreground"
            )}>
              <Sun className="h-3.5 w-3.5" />
              <span>Terang</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme('dark')} className={cn(
              "focus:bg-accent focus:text-accent-foreground gap-2 cursor-pointer text-xs py-2 px-2.5 rounded-lg transition-colors",
              theme === 'dark' ? "bg-slate-800 text-yellow-400 dark:bg-slate-800 dark:text-yellow-400 font-medium" : "text-muted-foreground"
            )}>
              <Moon className="h-3.5 w-3.5" />
              <span>Gelap</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme('system')} className={cn(
              "focus:bg-accent focus:text-accent-foreground gap-2 cursor-pointer text-xs py-2 px-2.5 rounded-lg transition-colors",
              theme === 'system' ? "bg-accent/10 text-accent font-medium" : "text-muted-foreground"
            )}>
              <Monitor className="h-3.5 w-3.5" />
              <span>Sistem</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative text-muted-foreground h-10 w-10 rounded-xl border border-border bg-card hover:bg-accent hover:text-foreground transition-all duration-200 focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 cursor-pointer"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-rose-500 text-[9px] font-extrabold text-white border-2 border-card">
                  {unreadCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-popover border border-border text-popover-foreground w-80 shadow-soft-md p-0 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-border bg-muted/20 flex items-center justify-between">
              <span className="font-bold text-xs">Pesan Masuk</span>
              {unreadCount > 0 && (
                <span className="text-[10px] bg-rose-500/10 text-rose-600 dark:text-rose-400 font-extrabold px-2 py-0.5 rounded-full">
                  {unreadCount} Baru
                </span>
              )}
            </div>
            
            <div className="max-h-72 overflow-y-auto divide-y divide-border/60">
              {recentMessages.length === 0 ? (
                <div className="py-8 text-center text-xs text-muted-foreground font-semibold flex flex-col items-center gap-1.5">
                  <MessageSquare className="h-6 w-6 text-slate-300 dark:text-slate-700" />
                  Tidak ada pesan masuk
                </div>
              ) : (
                recentMessages.map((msg) => (
                  <DropdownMenuItem
                    key={msg.id}
                    asChild
                    className="focus:bg-muted focus:text-foreground cursor-pointer text-xs p-3.5 flex items-start gap-2.5 outline-none transition-colors"
                  >
                    <Link to="/admin/pesan" onClick={() => handleMarkAsRead(msg)}>
                      <div className="h-2 w-2 rounded-full bg-accent shrink-0 mt-1.5 opacity-100 font-bold" style={{ opacity: msg.isRead ? 0 : 1 }} />
                      <div className="space-y-0.5 min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-bold text-foreground text-xs truncate">{msg.fullName}</span>
                          <span className="text-[9px] text-muted-foreground/60 shrink-0 font-semibold">{msg.timeBrief}</span>
                        </div>
                        <p className="text-[11px] text-muted-foreground line-clamp-2 leading-normal font-medium">{msg.message}</p>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                ))
              )}
            </div>

            <div className="border-t border-border bg-muted/10">
              <Link
                to="/admin/pesan"
                className="flex items-center justify-center h-10 text-xs font-bold text-accent hover:text-accent/90 transition-colors w-full"
              >
                Lihat Semua Pesan
              </Link>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <div className="flex items-center gap-3 border-l pl-4 border-border">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-muted-foreground">Admin Utama</p>
            <p className="text-xs text-muted-foreground/60">Superadmin</p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-muted border border-border flex items-center justify-center text-muted-foreground shrink-0">
            <User className="h-5 w-5" />
          </div>
        </div>
      </div>
    </header>
  )
}
