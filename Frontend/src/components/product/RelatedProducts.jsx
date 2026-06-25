import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Eye, Package } from "lucide-react"
import api from "@/services/axios"
import { getAssetUrl } from "@/lib/utils"

export default function RelatedProducts({ currentId, category }) {
  const [related, setRelated] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const res = await api.get("/public/products")
        const allProducts = res.data || []
        // Filter by category name and exclude current product id
        const filtered = allProducts
          .filter((p) => {
            const catName = p.category?.name || p.category || ""
            const targetCat = category?.name || category || ""
            return catName.toLowerCase() === targetCat.toLowerCase() && p.id !== currentId
          })
          .slice(0, 4)
        setRelated(filtered)
      } catch (err) {
        console.error("Gagal memuat produk terkait", err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchRelated()
  }, [currentId, category])

  if (isLoading || related.length === 0) return null

  const getProductImage = (product) => {
    const img = product.images?.find(i => i.is_primary)?.image_url || product.images?.[0]?.image_url
    return img ? getAssetUrl(img) : null
  }

  const getProductSku = (product) => `GTM-PD-${String(product.id).padStart(3, "0")}`

  return (
    <div className="space-y-6 text-left border-t border-border pt-12">
      <div>
        <h2 className="text-xl font-bold text-foreground tracking-tight">
          Produk Terkait
        </h2>
        <p className="text-xs text-muted-foreground mt-1">
          Peralatan penunjang konstruksi dan manufaktur dengan spesifikasi sejenis.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {related.map((product) => (
          <Link
            key={product.id}
            to={`/products/${product.slug}`}
            className="group bg-card border border-border rounded-xl overflow-hidden flex flex-col h-full hover:shadow-card-hover hover:border-border/80 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
          >
            {/* Image Link */}
            <div className="relative aspect-[4/3] overflow-hidden bg-muted/30 border-b border-border shrink-0 block">
              {getProductImage(product) ? (
                <img
                  src={getProductImage(product)}
                  alt={product.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="h-10 w-10 text-muted-foreground/30" />
                </div>
              )}

              {/* Stock Badge */}
              <div className="absolute top-3 left-3 bg-card/95 backdrop-blur-xs px-2 py-0.5 rounded text-[9px] font-bold tracking-wide uppercase text-foreground border border-border flex items-center gap-1 shadow-soft-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                {product.status === "available" ? "Tersedia" : product.status === "preorder" ? "Pre-Order" : "Custom Made"}
              </div>
            </div>

            {/* Content Area */}
            <div className="p-5 flex flex-col flex-1 justify-between">
              <div>
                {/* Category & SKU */}
                <div className="flex items-center justify-between text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-2">
                  <span>{product.category?.name || "Lainnya"}</span>
                  <span className="text-[9px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground font-mono">
                    {getProductSku(product)}
                  </span>
                </div>

                {/* Product Title */}
                <h3 className="font-bold text-foreground text-sm mb-2 group-hover:text-accent transition-colors line-clamp-1">
                  {product.name}
                </h3>

                {/* Brief Spec */}
                <p className="text-xs text-muted-foreground leading-relaxed mb-4 line-clamp-2">
                  {product.specification || product.description || "-"}
                </p>
              </div>

              {/* Action Button */}
              <div className="pt-4 border-t border-border">
                <div className="w-full text-xs h-9 flex items-center justify-center text-foreground border border-border bg-card hover:bg-muted/50 gap-1.5 rounded-lg shadow-card font-semibold transition-colors">
                  <Eye className="h-3.5 w-3.5" />
                  Detail Spesifikasi
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
