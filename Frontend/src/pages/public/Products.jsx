import { useState, useMemo, useEffect } from "react"
import { Search, ChevronLeft, ChevronRight, SlidersHorizontal, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Skeleton } from "@/components/ui/skeleton"
import { Helmet } from "react-helmet-async"
import { Link, useSearchParams } from "react-router-dom"
import { cn, getAssetUrl } from "@/lib/utils"
import api from "@/services/axios"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"


const STOCK_STATUS_MAP = {
  available: "Tersedia",
  preorder: "Pre-Order",
  custom: "Custom Made"
}

const STOCK_OPTIONS = Object.values(STOCK_STATUS_MAP)
const ITEMS_PER_PAGE = 9

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearch] = useState("")
  const [selectedCategories, setSelectedCategories] = useState([])
  const [selectedStock, setSelectedStock] = useState([])
  const [page, setPage] = useState(1)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const [productsData, setProductsData] = useState([])
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          api.get("/public/products"),
          api.get("/public/categories")
        ])
        setProductsData(prodRes.data)
        setCategories(catRes.data.map(c => c.name))
      } catch (err) {
        console.error("Gagal memuat produk", err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    const urlCat = searchParams.get("cat")
    const target = urlCat ? [urlCat] : []
    const isDifferent = 
      selectedCategories.length !== target.length ||
      selectedCategories.some((cat, i) => cat !== target[i])

    if (isDifferent) {
      const timer = setTimeout(() => {
        setSelectedCategories(target)
        setPage(1)
      }, 0)
      return () => clearTimeout(timer)
    }
  }, [searchParams, selectedCategories])

  const toggleFilter = (val, list, setList) => {
    setList(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val])
    setPage(1)
  }

  const toggleCategoryFilter = (val) => {
    const catParam = searchParams.get("cat")
    if (catParam === val) {
      searchParams.delete("cat")
    } else {
      searchParams.set("cat", val)
    }
    setSearchParams(searchParams)
  }

  const filtered = useMemo(() => {
    return productsData.filter(p => {
      const catName = p.category?.name || ""
      const spec = p.specification || ""
      const statusLabel = STOCK_STATUS_MAP[p.status] || p.status
      const matchSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        spec.toLowerCase().includes(search.toLowerCase()) ||
        catName.toLowerCase().includes(search.toLowerCase())
      const matchCat = selectedCategories.length === 0 || selectedCategories.includes(catName)
      const matchStock = selectedStock.length === 0 || selectedStock.includes(statusLabel)
      return matchSearch && matchCat && matchStock
    })
  }, [productsData, search, selectedCategories, selectedStock])

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE))
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  const paginationPages = () => {
    const pages = []
    const delta = 1
    const left = Math.max(2, page - delta)
    const right = Math.min(totalPages - 1, page + delta)
    pages.push(1)
    if (left > 2) pages.push("...")
    for (let i = left; i <= right; i++) pages.push(i)
    if (right < totalPages - 1) pages.push("...")
    if (totalPages > 1) pages.push(totalPages)
    return pages
  }

  const getProductImage = (product) => {
    const img = product.images?.find(i => i.is_primary)?.image_url || product.images?.[0]?.image_url
    return img ? getAssetUrl(img) : null
  }

  const getProductSku = (product) => `GTM-PD-${String(product.id).padStart(3, "0")}`





  const renderFilters = () => (
    <div className="space-y-6">
      <div>
        <label className="text-xs font-semibold text-foreground uppercase tracking-wider block mb-2">Cari Katalog</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
            placeholder="Cari nama, spesifikasi, SKU..."
            className="pl-9 h-9 text-xs border-border bg-background text-foreground"
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold text-foreground uppercase tracking-wider block mb-3">Kategori</label>
        <div className="space-y-2.5">
          {categories.map(cat => (
            <label key={cat} className="flex items-center gap-2.5 cursor-pointer group">
              <Checkbox
                id={`cat-${cat}`}
                checked={selectedCategories.includes(cat)}
                onCheckedChange={() => toggleCategoryFilter(cat)}
                className="border-border data-[state=checked]:bg-emerald-600 dark:data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-600 dark:data-[state=checked]:border-emerald-500 rounded h-4 w-4"
              />
              <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">{cat}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold text-foreground uppercase tracking-wider block mb-3">Status Ketersediaan</label>
        <div className="space-y-2.5">
          {STOCK_OPTIONS.map(s => (
            <label key={s} className="flex items-center gap-2.5 cursor-pointer group">
              <Checkbox
                id={`stock-${s}`}
                checked={selectedStock.includes(s)}
                onCheckedChange={() => toggleFilter(s, selectedStock, setSelectedStock)}
                className="border-border data-[state=checked]:bg-emerald-600 dark:data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-600 dark:data-[state=checked]:border-emerald-500 rounded h-4 w-4"
              />
              <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">{s}</span>
            </label>
          ))}
        </div>
      </div>

      {(selectedCategories.length > 0 || selectedStock.length > 0 || search) && (
        <button
          onClick={() => { setSelectedCategories([]); setSelectedStock([]); setSearch(""); setPage(1) }}
          className="text-xs text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 font-semibold transition-colors cursor-pointer"
        >
          Hapus semua filter
        </button>
      )}
    </div>
  )

  return (
    <>
      <Helmet>
        <title>Katalog Pengadaan Alat Teknik & Manufaktur — CV Globalindo Teknik Mandiri</title>
        <meta
          name="description"
          content="Katalog resmi pengadaan alat marka jalan, perlengkapan keselamatan jalan, meja laboratorium, dan mesin pertanian perkebunan CV Globalindo Teknik Mandiri."
        />
      </Helmet>

      <div className="bg-background text-foreground min-h-screen">
        {/* Page Header */}
        <div className="border-b border-border bg-card">
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16 lg:py-24">
            <nav className="text-[11px] text-muted-foreground mb-3 flex items-center gap-1.5 font-bold uppercase tracking-wider">
              <Link to="/" className="hover:text-accent transition-colors">Beranda</Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-foreground">Produk</span>
            </nav>
            <h1 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">Katalog Produk </h1>
            <p className="text-muted-foreground text-sm leading-relaxed mt-2 max-w-xl">
              Spesifikasi peralatan industri resmi siap suplai untuk tender kementerian, proyek konstruksi nasional, BUMN, dan laboratorium riset universitas.
            </p>
          </div>
        </div>

        {/* Content Area */}
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row gap-10">

            {/* Sidebar Desktop */}
            <aside className="w-60 shrink-0 hidden lg:block">
              <div className="sticky top-24 border border-border rounded-xl p-6 bg-card">
                <h2 className="text-xs font-bold text-foreground mb-5 pb-3 border-b border-border uppercase tracking-wider">Filter Katalog</h2>
                {renderFilters()}
              </div>
            </aside>

            {/* Main content */}
            <div className="flex-1 min-w-0">
              {/* Toolbar */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
                <p className="text-xs text-muted-foreground font-medium">
                  {isLoading ? "Memuat produk..." : (
                    <>Menampilkan <span className="font-bold text-foreground">{filtered.length}</span> produk aktif</>
                  )}
                </p>
                <div className="flex items-center gap-3">
                  <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                    <SheetTrigger asChild>
                      <button
                        className="lg:hidden flex items-center gap-2 text-xs font-semibold text-foreground border border-border rounded-lg px-3 py-2 hover:bg-muted/50 transition-colors h-9 cursor-pointer"
                      >
                        <SlidersHorizontal className="h-4 w-4" />
                        Filter
                      </button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-80 bg-card border-r border-border p-6 shadow-modal overflow-y-auto text-left">
                      <h2 className="text-sm font-bold text-foreground mb-6 pb-3 border-b border-border uppercase tracking-wider">Filter Katalog</h2>
                      {renderFilters()}
                    </SheetContent>
                  </Sheet>
                  <div className="text-xs text-muted-foreground font-medium border border-border rounded-lg px-3 py-2 bg-card select-none">
                    Status: Siap Tender
                  </div>
                </div>
              </div>

              {/* Product Grid */}
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="border border-border rounded-xl overflow-hidden bg-card shadow-sm">
                      <Skeleton className="w-full aspect-[4/3] bg-muted animate-pulse" />
                      <div className="p-5 space-y-3">
                        <Skeleton className="h-5 w-3/4 bg-muted animate-pulse" />
                        <Skeleton className="h-3 w-1/3 bg-muted animate-pulse" />
                        <Skeleton className="h-4 w-full bg-muted animate-pulse" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : paginated.length === 0 ? (
                <div className="text-center py-20 border border-dashed border-border rounded-xl bg-muted/20 max-w-lg mx-auto px-6">
                  <Package className="h-10 w-10 text-muted-foreground/30 mx-auto mb-4" />
                  <h3 className="text-xs font-bold text-foreground uppercase tracking-wider mb-2">Produk Tidak Ditemukan</h3>
                  <p className="text-xs text-muted-foreground mb-6 leading-relaxed">
                    Maaf, tidak ada produk aktif yang cocok dengan kata kunci pencarian atau filter saat ini.
                  </p>
                  <Button
                    onClick={() => { setSelectedCategories([]); setSelectedStock([]); setSearch(""); setPage(1) }}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs h-9 px-4 rounded font-semibold cursor-pointer"
                  >
                    Atur Ulang Filter
                  </Button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {paginated.map(product => (
                      <Link
                        key={product.id}
                        to={`/products/${product.slug}`}
                        className="group bg-card border border-border rounded-xl overflow-hidden flex flex-col h-full shadow-sm hover:shadow-md hover:border-border/80 hover:-translate-y-1 transition-all duration-300"
                      >
                        {/* Image */}
                        <div className="relative aspect-[4/3] overflow-hidden bg-muted/30 border-b border-border shrink-0">
                          {getProductImage(product) ? (
                            <img
                              src={getProductImage(product)}
                              alt={product.name}
                              loading="lazy"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="h-12 w-12 text-muted-foreground/30" />
                            </div>
                          )}
                          <div className="absolute top-3 left-3 bg-background/95 px-2 py-0.5 rounded text-[9px] font-bold tracking-wide uppercase text-foreground border border-border flex items-center gap-1 shadow-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-500" />
                            {STOCK_STATUS_MAP[product.status] || product.status}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-5 flex flex-col flex-1 justify-between">
                          <div>
                            <div className="flex items-center justify-between text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-2">
                              <span>{product.category?.name || "Lainnya"}</span>
                              <span className="text-[9px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground font-mono">{getProductSku(product)}</span>
                            </div>
                            <h3 className="font-bold text-foreground text-sm mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-1">{product.name}</h3>
                            <p className="text-xs text-muted-foreground leading-relaxed mb-4 line-clamp-2">{product.specification || product.description || "-"}</p>
                          </div>
                          <div className="pt-4 border-t border-border">
                            <div className="w-full text-xs h-9 text-muted-foreground border border-border hover:bg-muted/50 gap-1.5 rounded flex items-center justify-center font-medium transition-colors">
                              Detail Spesifikasi
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="mt-12 flex items-center justify-center gap-1">
                      <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="w-11 h-11 flex items-center justify-center rounded border border-border text-muted-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      {paginationPages().map((p, i) =>
                        p === "..." ? (
                          <span key={`e-${i}`} className="w-11 h-11 flex items-center justify-center text-sm text-muted-foreground/50">···</span>
                        ) : (
                          <button
                            key={p}
                            onClick={() => setPage(p)}
                            className={cn(
                              "w-11 h-11 flex items-center justify-center rounded border text-xs font-bold transition-colors cursor-pointer",
                              page === p ? "bg-primary border-primary text-primary-foreground" : "border-border text-muted-foreground hover:bg-muted hover:border-border"
                            )}
                          >
                            {p}
                          </button>
                        )
                      )}
                      <button
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="w-11 h-11 flex items-center justify-center rounded border border-border text-muted-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
