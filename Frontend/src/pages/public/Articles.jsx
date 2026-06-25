import { useState, useMemo, useEffect } from "react"
import { Link } from "react-router-dom"
import { Search, Calendar, ChevronLeft, ChevronRight, BookOpen, Clock, ChevronRight as ChevronRightIcon, Loader2 } from "lucide-react"
import { Helmet } from "react-helmet-async"
import { Button } from "@/components/ui/button"
import { cn, getAssetUrl } from "@/lib/utils"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import api from "@/services/axios"

const ITEMS_PER_PAGE = 6

function formatDate(dateStr) {
  if (!dateStr) return ""
  return new Date(dateStr).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
}

function estimateReadTime(content) {
  if (!content) return "1 Menit"
  const plain = content.replace(/<[^>]+>/g, "").trim()
  const words = plain.split(/\s+/).length
  const minutes = Math.max(1, Math.round(words / 200))
  return `${minutes} Menit`
}

export default function Articles() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [selectedArticle, setSelectedArticle] = useState(null)

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true)
        const res = await api.get("/public/articles")
        setArticles(res.data)
      } catch (err) {
        console.error("Failed to fetch articles:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchArticles()
  }, [])

  const filtered = useMemo(() => {
    return articles.filter((a) => {
      const matchSearch =
        a.title.toLowerCase().includes(search.toLowerCase()) ||
        (a.content || "").toLowerCase().includes(search.toLowerCase())
      return matchSearch
    })
  }, [articles, search])

  const featuredArticle = useMemo(() => {
    if (page === 1 && !search && filtered.length > 0) {
      return filtered[0]
    }
    return null
  }, [page, search, filtered])

  const gridArticles = useMemo(() => {
    if (featuredArticle) {
      return filtered.filter((a) => a.id !== featuredArticle.id)
    }
    return filtered
  }, [filtered, featuredArticle])

  const totalPages = Math.max(1, Math.ceil(gridArticles.length / ITEMS_PER_PAGE))
  const paginated = gridArticles.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  const paginationPages = () => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1)
    const pages = [1]
    if (page > 3) pages.push("...")
    const start = Math.max(2, page - 1)
    const end = Math.min(totalPages - 1, page + 1)
    for (let i = start; i <= end; i++) pages.push(i)
    if (page < totalPages - 2) pages.push("...")
    pages.push(totalPages)
    return pages
  }

  const getImageUrl = (image_url) => {
    if (!image_url) return null
    return getAssetUrl(image_url)
  }

  const getSnippet = (content, maxLen = 160) => {
    if (!content) return ""
    const plain = content.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim()
    return plain.length > maxLen ? plain.slice(0, maxLen) + "…" : plain
  }

  return (
    <>
      <Helmet>
        <title>Knowledge Center & Panduan Teknis — CV Globalindo Teknik Mandiri</title>
        <meta
          name="description"
          content="Jelajahi panduan teknis manufaktur, metode kalibrasi alat laboratorium sipil, dan spesifikasi cat marka jalan dari tim engineering CV Globalindo Teknik Mandiri."
        />
      </Helmet>

      <div className="bg-background min-h-screen text-foreground">
        {/* Page Header */}
        <div className="border-b border-border bg-card">
          <div className="container mx-auto max-w-7xl px-4 md:px-6 lg:px-8 py-12 md:py-16 lg:py-24">
            <nav className="text-[11px] text-muted-foreground/60 mb-3 flex items-center gap-1.5 font-bold uppercase tracking-wider">
              <Link to="/" className="hover:text-accent transition-colors">Beranda</Link>
              <ChevronRightIcon className="h-3 w-3" />
              <span className="text-muted-foreground">Knowledge Center</span>
            </nav>
            <h1 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">Knowledge Center</h1>
            <p className="text-muted-foreground text-sm leading-relaxed mt-2 max-w-xl">
              Dokumentasi teknis, panduan kalibrasi alat uji sipil, dan regulasi marka jalan dari tim engineering CV Globalindo Teknik Mandiri.
            </p>
          </div>
        </div>

        {/* Content Area */}
        <div className="container mx-auto max-w-7xl px-4 md:px-6 lg:px-8 py-12 md:py-16 lg:py-24">
          {/* Search bar */}
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-10 pb-6 border-b border-border">
            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                placeholder="Cari panduan teknis..."
                className="w-full pl-9 pr-4 h-9 border border-border rounded-lg text-xs bg-card text-foreground placeholder-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-colors"
              />
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24">
              <Loader2 className="h-8 w-8 animate-spin text-accent mb-4" />
              <p className="text-sm text-muted-foreground font-semibold">Memuat artikel...</p>
            </div>
          ) : (
            <>
              {/* Featured Article Hero */}
              {featuredArticle && (
                <div className="mb-12">
                  <span className="text-xs font-semibold text-accent uppercase tracking-widest block mb-4">
                    Featured Publication
                  </span>
                  <div
                    onClick={() => setSelectedArticle(featuredArticle)}
                    className="group surface-panel overflow-hidden grid lg:grid-cols-12 hover:shadow-card-hover hover:border-border/80 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
                  >
                    <div className="relative w-full aspect-video min-h-0 lg:col-span-7 lg:aspect-auto lg:min-h-[280px] bg-muted/30 overflow-hidden">
                      {getImageUrl(featuredArticle.image_url) ? (
                        <img
                          src={getImageUrl(featuredArticle.image_url)}
                          alt={featuredArticle.title}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <BookOpen className="h-16 w-16 text-muted-foreground/20" />
                        </div>
                      )}
                    </div>
                    <div className="lg:col-span-5 p-8 lg:p-10 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-3 text-[10px] text-muted-foreground mb-4 font-semibold uppercase tracking-wider">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            <time>{formatDate(featuredArticle.createdAt)}</time>
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            <span>{estimateReadTime(featuredArticle.content)}</span>
                          </span>
                        </div>
                        <h2 className="font-extrabold text-foreground text-xl lg:text-2xl leading-snug mb-4 group-hover:text-accent transition-colors">
                          {featuredArticle.title}
                        </h2>
                        <p className="text-xs text-muted-foreground leading-relaxed mb-6">
                          {getSnippet(featuredArticle.content, 200)}
                        </p>
                      </div>
                      <div className="pt-6 border-t border-border flex items-center justify-between">
                        <span className="text-xs font-bold text-foreground flex items-center gap-1.5 group-hover:text-accent transition-colors">
                          Baca Selengkapnya
                          <ChevronRightIcon className="h-4 w-4" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Articles grid */}
              {paginated.length === 0 && !featuredArticle ? (
                <div className="text-center py-20 border border-dashed border-border rounded-2xl bg-muted/20 max-w-md mx-auto px-6">
                  <BookOpen className="h-10 w-10 text-muted-foreground/60 mx-auto mb-4" />
                  <h3 className="text-xs font-bold text-foreground uppercase tracking-wider mb-2">Artikel Tidak Ditemukan</h3>
                  <p className="text-xs text-muted-foreground mb-6 leading-relaxed">
                    Maaf, kami tidak dapat menemukan panduan teknis yang sesuai dengan pencarian Anda.
                  </p>
                  <Button
                    onClick={() => { setSearch(""); setPage(1) }}
                    className="text-xs h-9 px-4 rounded font-semibold"
                  >
                    Reset Pencarian
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {paginated.map((article) => (
                    <article
                      key={article.id}
                      onClick={() => setSelectedArticle(article)}
                      className="group surface-card overflow-hidden flex flex-col h-full hover:shadow-card-hover hover:border-border/80 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
                    >
                      {/* Thumbnail */}
                      <div className="relative aspect-video overflow-hidden bg-muted/30 border-b border-border shrink-0">
                        {getImageUrl(article.image_url) ? (
                          <img
                            src={getImageUrl(article.image_url)}
                            alt={article.title}
                            loading="lazy"
                            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <BookOpen className="h-10 w-10 text-muted-foreground/20" />
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-5 flex flex-col flex-1 justify-between">
                        <div>
                          <div className="flex items-center gap-3 text-[10px] text-muted-foreground mb-3 font-semibold uppercase tracking-wider">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3.5 w-3.5" />
                              <time>{formatDate(article.createdAt)}</time>
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" />
                              <span>{estimateReadTime(article.content)}</span>
                            </span>
                          </div>
                          <h2 className="font-bold text-foreground text-sm leading-snug mb-3 line-clamp-2">
                            {article.title}
                          </h2>
                          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3 mb-4">
                            {getSnippet(article.content)}
                          </p>
                        </div>

                        <div className="mt-auto pt-4 border-t border-border flex items-center justify-between">
                          <span className="text-xs font-bold text-foreground flex items-center gap-1 group-hover:text-accent transition-colors">
                            Baca Selengkapnya
                            <ChevronRightIcon className="h-3.5 w-3.5" />
                          </span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12 flex items-center justify-center gap-1">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="w-11 h-11 flex items-center justify-center rounded border border-border text-muted-foreground hover:bg-muted/50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>

                  {paginationPages().map((p, i) =>
                    p === "..." ? (
                      <span key={`e-${i}`} className="w-11 h-11 flex items-center justify-center text-sm text-slate-400">···</span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={cn(
                          "w-11 h-11 flex items-center justify-center rounded border text-xs font-bold transition-colors",
                          page === p
                            ? "bg-navy border-navy text-white"
                            : "border-border text-muted-foreground hover:bg-muted/50 hover:border-border/80"
                        )}
                      >
                        {p}
                      </button>
                    )
                  )}

                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="w-11 h-11 flex items-center justify-center rounded border border-border text-muted-foreground hover:bg-muted/50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Article Detail Dialog Modal */}
      {selectedArticle && (
        <Dialog open={!!selectedArticle} onOpenChange={(open) => !open && setSelectedArticle(null)}>
          <DialogContent className="max-w-2xl bg-card border border-border rounded-2xl p-0 overflow-hidden shadow-modal max-h-[90vh] flex flex-col">
            {getImageUrl(selectedArticle.image_url) ? (
              <div className="relative aspect-video w-full overflow-hidden bg-muted shrink-0">
                <img
                  src={getImageUrl(selectedArticle.image_url)}
                  alt={selectedArticle.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                <div className="absolute bottom-5 left-6 right-6 text-white text-left">
                  <DialogTitle className="text-xl font-bold text-white leading-tight">
                    {selectedArticle.title}
                  </DialogTitle>
                  <div className="text-[10px] text-slate-300 mt-1">
                    Dipublikasikan: {formatDate(selectedArticle.createdAt)} | Waktu Baca: {estimateReadTime(selectedArticle.content)}
                  </div>
                </div>
              </div>
            ) : (
              <div className="px-6 pt-6 shrink-0 text-left">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold leading-snug">{selectedArticle.title}</DialogTitle>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    Dipublikasikan: {formatDate(selectedArticle.createdAt)} | Waktu Baca: {estimateReadTime(selectedArticle.content)}
                  </p>
                </DialogHeader>
              </div>
            )}

            {/* Scrollable content body */}
            <div className="p-6 overflow-y-auto flex-1 text-left animate-page-fade">
              {/* Render content — support both plain text and simple HTML */}
              {selectedArticle.content ? (
                <div
                  className="prose prose-sm max-w-none text-foreground prose-headings:font-bold prose-headings:text-foreground prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:text-xs"
                  dangerouslySetInnerHTML={{ __html: selectedArticle.content.replace(/\n/g, "<br/>") }}
                />
              ) : (
                <p className="text-xs text-muted-foreground italic">Konten artikel belum tersedia.</p>
              )}
            </div>

            {/* Fixed footer */}
            <div className="px-6 py-4 border-t border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-muted-foreground bg-card shrink-0 text-left">
              <span className="text-[11px] font-medium">CV Globalindo Teknik Mandiri — Engineering & Quality Assurance</span>
              <DialogClose asChild>
                <Button variant="outline" className="text-xs h-9 rounded-lg shadow-soft-sm shrink-0 cursor-pointer self-end sm:self-auto">
                  Selesai Membaca
                </Button>
              </DialogClose>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}
