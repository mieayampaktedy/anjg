import { Link, useLocation } from "react-router-dom"
import { Menu, MessageSquare, X, Sun, Moon, Monitor, Package } from "lucide-react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn, getAssetUrl } from "@/lib/utils"
import { useTheme } from "@/contexts/ThemeContext"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { useCompanyProfile } from "@/hooks/useCompanyProfile"
import api from "@/services/axios"

const navLinks = [
  { name: "Beranda", path: "/" },
  { name: "Profil", path: "/tentang-kami" },
  { name: "Produk", path: "/produk" },
  { name: "Artikel", path: "/artikel" },
  { name: "Hubungi Kami", path: "/hubungi-kami" },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [categories, setCategories] = useState([])
  const location = useLocation()
  const { theme, setTheme } = useTheme()
  const { profile, getWhatsappLink } = useCompanyProfile()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    api.get("/public/categories")
      .then(res => setCategories(res.data || []))
      .catch(() => setCategories([]))
  }, [])

  const mobileMenuKey = location.pathname

  const isActive = (path) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path)

  // Scroll ke atas jika mengklik link halaman yang sedang aktif
  const handleNavClick = (path) => {
    if (isActive(path)) {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  // Split categories into 2 columns for mega menu
  const half = Math.ceil(categories.length / 2)
  const leftCats = categories.slice(0, half)
  const rightCats = categories.slice(half)

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-navy/80 backdrop-blur-md shadow-card border-b border-white/5"
          : "bg-navy"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <img
              src={profile.logo_url ? getAssetUrl(profile.logo_url) : "/logo.png"}
              alt={profile.name}
              className="h-8 md:h-10 w-auto object-contain"
            />
            {profile.name && (
              <span className="font-bold text-warning text-xs md:text-sm tracking-tight leading-tight text-left max-w-[150px] md:max-w-none">
                {profile.name}
              </span>
            )}
          </Link>

          {/* Desktop Nav - centered */}
          <nav className="hidden lg:flex items-center gap-1 ml-auto mr-6">
            {navLinks.map((link) => {
              if (link.name === "Produk") {
                return (
                  <div key={link.path} className="group relative">
                    <Link
                      to={link.path}
                      onClick={() => handleNavClick(link.path)}
                      className={cn(
                        "relative px-4 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-1",
                        isActive(link.path)
                          ? "text-white"
                          : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                      )}
                    >
                      {link.name}
                      <span className={cn(
                        "absolute bottom-0 left-4 right-4 h-[2px] bg-warning rounded-full transition-all duration-300 transform origin-center",
                        isActive(link.path) ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"
                      )} />
                    </Link>
                    
                    {/* Mega Menu Dropdown - dynamic from API */}
                    {categories.length > 0 && (
                      <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200 z-50">
                        <div className={cn(
                          "bg-navy border border-slate-800 rounded-xl shadow-dropdown p-6",
                          categories.length > 1 ? "grid grid-cols-2 gap-6 min-w-[480px]" : "min-w-[260px]"
                        )}>
                          {/* Left column */}
                          {leftCats.length > 0 && (
                            <div>
                              <h4 className="text-xs font-bold text-warning uppercase tracking-wider mb-3 border-b border-slate-800 pb-1">
                                Kategori Produk
                              </h4>
                              <div className="space-y-1">
                                {leftCats.map(cat => (
                                  <Link
                                    key={cat.id}
                                    to={`/produk?cat=${encodeURIComponent(cat.name)}`}
                                    className="block p-2 rounded-lg hover:bg-white/5 transition-colors group/item text-left"
                                  >
                                    <div className="flex items-center gap-2">
                                      <Package className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                                      <div className="text-xs font-bold text-white group-hover/item:text-warning transition-colors line-clamp-1">{cat.name}</div>
                                    </div>
                                  </Link>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Right column */}
                          {rightCats.length > 0 && (
                            <div>
                              <h4 className="text-xs font-bold text-warning uppercase tracking-wider mb-3 border-b border-slate-800 pb-1">
                                &nbsp;
                              </h4>
                              <div className="space-y-1">
                                {rightCats.map(cat => (
                                  <Link
                                    key={cat.id}
                                    to={`/produk?cat=${encodeURIComponent(cat.name)}`}
                                    className="block p-2 rounded-lg hover:bg-white/5 transition-colors group/item text-left"
                                  >
                                    <div className="flex items-center gap-2">
                                      <Package className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                                      <div className="text-xs font-bold text-white group-hover/item:text-warning transition-colors line-clamp-1">{cat.name}</div>
                                    </div>
                                  </Link>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Footer link */}
                          <div className={cn("border-t border-slate-800 pt-3 mt-1", categories.length > 1 ? "col-span-2" : "")}>
                            <Link
                              to="/produk"
                              className="flex items-center gap-1.5 text-[11px] font-semibold text-warning hover:text-yellow-300 transition-colors"
                            >
                              Lihat Semua Produk →
                            </Link>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )
              }

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => handleNavClick(link.path)}
                  className={cn(
                    "relative px-4 py-2 text-sm font-medium rounded-md transition-colors",
                    isActive(link.path)
                      ? "text-white"
                      : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                  )}
                >
                  {link.name}
                  <span className={cn(
                    "absolute bottom-0 left-4 right-4 h-[2px] bg-warning rounded-full transition-all duration-300 transform origin-center",
                    isActive(link.path) ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"
                  )} />
                </Link>
              )
            })}
          </nav>

          {/* Desktop Right Actions */}
          <div className="hidden lg:flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-slate-400 hover:text-white hover:bg-white/5 h-8 w-8 rounded-lg shrink-0 cursor-pointer"
                  aria-label="Pilih Tema"
                >
                  {theme === 'dark' && <Moon className="h-4 w-4 transition-all text-warning" />}
                  {theme === 'light' && <Sun className="h-4 w-4 transition-all text-warning" />}
                  {theme === 'system' && <Monitor className="h-4 w-4 transition-all text-warning" />}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-popover border border-border text-popover-foreground w-32 shadow-dropdown">
                <DropdownMenuItem onClick={() => setTheme('light')} className="focus:bg-accent focus:text-accent-foreground gap-2 cursor-pointer text-xs py-2">
                  <Sun className="h-3.5 w-3.5" />
                  <span>Terang</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('dark')} className="focus:bg-accent focus:text-accent-foreground gap-2 cursor-pointer text-xs py-2">
                  <Moon className="h-3.5 w-3.5" />
                  <span>Gelap</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('system')} className="focus:bg-accent focus:text-accent-foreground gap-2 cursor-pointer text-xs py-2">
                  <Monitor className="h-3.5 w-3.5" />
                  <span>Sistem</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="ghost"
              size="sm"
              className="text-slate-400 hover:text-white hover:bg-white/5 gap-1.5 text-sm h-8 cursor-pointer"
              asChild
            >
              <a href={getWhatsappLink()} target="_blank" rel="noreferrer">
                <MessageSquare className="h-4 w-4" />
                WhatsApp
              </a>
            </Button>
            <Button
              variant="warning"
              size="sm"
              className="font-semibold text-sm px-4 h-8 rounded-lg cursor-pointer shadow-card"
              asChild
            >
              <Link to="/hubungi-kami">Hubungi Kami</Link>
            </Button>
          </div>

          {/* Mobile: Sheet trigger */}
          <Sheet key={mobileMenuKey} open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <button className="lg:hidden text-slate-400 hover:text-white p-3 rounded-md transition-colors cursor-pointer">
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 bg-background border-l border-border p-0 shadow-modal">
              <div className="flex flex-col h-full text-left text-foreground">
                {/* Mobile header */}
                <div className="px-6 py-5 border-b border-border">
                  <span className="font-semibold text-sm">
                    {profile.name}
                  </span>
                </div>

                {/* Mobile nav links */}
                <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                  {navLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => {
                        handleNavClick(link.path)
                        setMobileOpen(false)
                      }}
                      className={cn(
                        "flex items-center px-4 py-3.5 text-sm font-medium rounded-lg transition-colors",
                        isActive(link.path)
                          ? "bg-accent text-warning"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      )}
                    >
                      {link.name}
                    </Link>
                  ))}

                  {/* Mobile Category sub-list under Produk */}
                  {categories.length > 0 && (
                    <div className="pl-4 space-y-0.5 pt-1">
                      {categories.map(cat => (
                        <Link
                          key={cat.id}
                          to={`/produk?cat=${encodeURIComponent(cat.name)}`}
                          className="flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg text-muted-foreground/80 hover:text-foreground hover:bg-muted transition-colors"
                        >
                          <Package className="h-3 w-3 shrink-0" />
                          {cat.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </nav>

                {/* Mobile CTA */}
                <div className="px-4 pb-6 space-y-3 border-t border-border pt-4">
                  <div className="space-y-2 px-4 py-3 bg-muted/50 rounded-lg">
                    <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider block">Pilihan Tema</span>
                    <div className="grid grid-cols-3 gap-1">
                      <Button
                        variant={theme === 'light' ? 'secondary' : 'ghost'}
                        size="sm"
                        onClick={() => setTheme('light')}
                        className={cn(
                          "h-11 text-xs font-semibold rounded-md cursor-pointer",
                          theme === 'light' ? "bg-accent text-accent-foreground hover:bg-accent/80" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        )}
                      >
                        <Sun className="h-3.5 w-3.5 mr-1" />
                        Terang
                      </Button>
                      <Button
                        variant={theme === 'dark' ? 'secondary' : 'ghost'}
                        size="sm"
                        onClick={() => setTheme('dark')}
                        className={cn(
                          "h-11 text-xs font-semibold rounded-md cursor-pointer",
                          theme === 'dark' ? "bg-accent text-accent-foreground hover:bg-accent/80" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        )}
                      >
                        <Moon className="h-3.5 w-3.5 mr-1" />
                        Gelap
                      </Button>
                      <Button
                        variant={theme === 'system' ? 'secondary' : 'ghost'}
                        size="sm"
                        onClick={() => setTheme('system')}
                        className={cn(
                          "h-11 text-xs font-semibold rounded-md cursor-pointer",
                          theme === 'system' ? "bg-accent text-accent-foreground hover:bg-accent/80" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        )}
                      >
                        <Monitor className="h-3.5 w-3.5 mr-1" />
                        Sistem
                      </Button>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full text-muted-foreground border-border bg-transparent hover:bg-muted hover:text-foreground gap-2 text-sm cursor-pointer h-11 rounded-lg"
                    asChild
                  >
                    <a href={getWhatsappLink()} target="_blank" rel="noreferrer">
                      <MessageSquare className="h-4 w-4" />
                      WhatsApp
                    </a>
                  </Button>
                  <Button variant="warning" className="w-full font-semibold text-sm h-11 rounded-lg cursor-pointer" asChild>
                    <Link to="/hubungi-kami">Hubungi Kami</Link>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>

        </div>
      </div>
    </header>
  )
}
