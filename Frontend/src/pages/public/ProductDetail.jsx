import { useParams, Navigate } from "react-router-dom"
import { Helmet } from "react-helmet-async"
import { useState, useEffect } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import api from "@/services/axios"
import { getAssetUrl } from "@/lib/utils"

import ProductBreadcrumb from "@/components/product/ProductBreadcrumb"
import ProductGallery from "@/components/product/ProductGallery"
import ProductInfo from "@/components/product/ProductInfo"
import ProductSpecs from "@/components/product/ProductSpecs"
import RelatedProducts from "@/components/product/RelatedProducts"

export default function ProductDetail() {
  const { slug } = useParams()
  const [product, setProduct] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true)
      setError(false)
      try {
        const res = await api.get(`/public/products/${slug}`)
        setProduct(res.data)
      } catch (err) {
        console.error("Gagal memuat detail produk", err)
        setError(true)
      } finally {
        setIsLoading(false)
      }
    }
    fetchProduct()
  }, [slug])

  if (error) {
    return <Navigate to="/404" replace />
  }

  if (isLoading) {
    return (
      <div className="bg-background min-h-screen text-foreground">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16 lg:py-24 space-y-8 animate-pulse">
          <Skeleton className="h-4 w-48 bg-muted" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            <div className="lg:col-span-7">
              <Skeleton className="w-full aspect-[4/3] rounded-2xl bg-muted" />
            </div>
            <div className="lg:col-span-5 space-y-4">
              <Skeleton className="h-8 w-3/4 bg-muted" />
              <Skeleton className="h-4 w-1/4 bg-muted" />
              <Skeleton className="h-6 w-full bg-muted" />
              <Skeleton className="h-24 w-full bg-muted" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return <Navigate to="/404" replace />
  }

  // Construct media items for ProductGallery
  const media = []
  if (product.images && product.images.length > 0) {
    product.images.forEach(img => {
      media.push({
        type: "image",
        url: getAssetUrl(img.image_url)
      })
    })
  } else {
    media.push({
      type: "image",
      url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-iKPMqwz7G27fyHxvGAEq2CkH1hW3PGaByP8YiP6VeA&s=10"
    })
  }
  if (product.youtube_url) {
    media.push({
      type: "youtube",
      url: product.youtube_url
    })
  }

  // Format specifications for ProductSpecs if product.specification is a string
  const specifications = []
  if (product.specification) {
    const lines = product.specification.split("\n").filter(l => l.trim())
    lines.forEach(line => {
      const parts = line.split(":")
      if (parts.length >= 2) {
        specifications.push({
          label: parts[0].trim(),
          value: parts.slice(1).join(":").trim()
        })
      } else {
        specifications.push({
          label: "Spesifikasi",
          value: line.trim()
        })
      }
    })
  }

  return (
    <>
      <Helmet>
        <title>{`${product.name} — CV Globalindo Teknik Mandiri`}</title>
        <meta name="description" content={product.specification || product.description} />
      </Helmet>

      <div className="bg-background min-h-screen text-foreground animate-page-fade">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16 lg:py-24">
          {/* 1. Breadcrumb */}
          <ProductBreadcrumb category={product.category?.name} name={product.name} />

          {/* 2 & 3. Main Detail Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Left: Product Gallery (col-span-7) */}
            <div className="lg:col-span-7">
              <ProductGallery media={media} />
            </div>

            {/* Right: Product Information (col-span-5) */}
            <div className="lg:col-span-5">
              <ProductInfo
                name={product.name}
                sku={`GTM-PD-${String(product.id).padStart(3, "0")}`}
                category={product.category?.name || "Lainnya"}
                stockStatus={product.status}
                shortDescription={product.specification?.split("\n")[0] || ""}
                description={product.description}
              />
            </div>
          </div>

          {/* Spacing wrapper */}
          <div className="mt-16 space-y-16">
            {/* 4. Technical Specifications */}
            {specifications.length > 0 && (
              <ProductSpecs specifications={specifications} />
            )}

            {/* 5. Related Products */}
            <RelatedProducts currentId={product.id} category={product.category?.name} />
          </div>
        </div>
      </div>
    </>
  )
}
