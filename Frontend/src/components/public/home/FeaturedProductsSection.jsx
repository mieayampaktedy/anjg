import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import api from "@/services/axios";
import { Button } from "@/components/ui/button";
import { Eye, ShieldCheck } from "lucide-react";
import { getAssetUrl } from "@/lib/utils";

const STOCK_STATUS_MAP = {
  available: "Tersedia",
  preorder: "Pre-Order",
  custom: "Custom Made"
};

const getProductImage = (product) => {
  const img = product.images?.find(i => i.is_primary)?.image_url || product.images?.[0]?.image_url;
  return img ? getAssetUrl(img) : null;
};

const getProductSku = (product) => `GTM-PD-${String(product.id).padStart(3, "0")}`;

const getTechnicalMeta = (product) => {
  const meta = {
    kapasitas: "N/A",
    standar: "Standar Manufaktur",
    tkdn: "Dalam Proses",
  }

  if (product.id === "gtm-mj-01") {
    meta.kapasitas = "Cat 100 kg / Honda GX160"
    meta.standar = "SNI Rambu & Marka"
    meta.tkdn = "TKDN 42.15% (Sertifikat)"
  } else if (product.id === "gtm-lu-20") {
    meta.kapasitas = "2000 kN (200 Ton)"
    meta.standar = "ASTM C-39 / SNI 1974"
    meta.tkdn = "TKDN 40.50% (Sertifikat)"
  } else if (product.id === "gtm-lf-08") {
    meta.kapasitas = "Dimensi 3000x1500x850mm"
    meta.standar = "ISO 9001 & SEFA 8"
    meta.tkdn = "TKDN Lini Lokal 45%"
  } else if (product.id === "gtm-mp-12") {
    meta.kapasitas = "DC 12V / Lithium 2000mAh"
    meta.standar = "Uji Alat Kementan"
    meta.tkdn = "TKDN Lini Lokal 41%"
  } else if (product.id === "gtm-bt-03") {
    meta.kapasitas = "Bor manual Kedalaman 3M"
    meta.standar = "Uji Geoteknik Sipil"
    meta.tkdn = "TKDN Lini Lokal 48%"
  } else if (product.id === "gtm-pj-02") {
    meta.kapasitas = "Air 150 L / Dimensi 1.2M"
    meta.standar = "Kemenhub / SNI PE"
    meta.tkdn = "TKDN 46.80% (Sertifikat)"
  } else if (product.id === "gtm-pj-05") {
    meta.kapasitas = "Tinggi 1200mm / HDPE"
    meta.standar = "Kemenhub SNI"
    meta.tkdn = "TKDN 43.20% (Sertifikat)"
  } else if (product.id === "gtm-lf-12") {
    meta.kapasitas = "Centrifugal Blower 1/2 HP"
    meta.standar = "SEFA 1 Fume Hoods"
    meta.tkdn = "TKDN Lini Lokal 45%"
  }

  return meta
}

export default function FeaturedProductsSection() {
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get('/public/products');
        setFeaturedProducts(res.data.slice(0, 4));
      } catch (error) {
        console.error("Gagal memuat produk unggulan", error);
      }
    };
    fetchProducts();
  }, []);

  return (
    <section className="bg-muted/10 py-12 md:py-16 lg:py-24 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-semibold text-warning uppercase tracking-widest block mb-2">
              Katalog Unggulan (Tender Ready)
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight text-left">
              Peralatan Konstruksi & Laboratorium Terpopuler
            </h2>
            <p className="text-muted-foreground mt-2 text-base max-w-xl text-left">
              Daftar produk dengan volume permintaan tender tertinggi yang diproduksi sesuai standar regulasi nasional.
            </p>
          </div>
          <Button
            variant="outline"
            className="border-border text-foreground bg-card hover:bg-muted/50 text-sm h-10 shrink-0 shadow-card cursor-pointer"
            asChild
          >
            <Link to="/produk">Lihat Semua Produk</Link>
          </Button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.25 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {featuredProducts.map((prod) => {
            const techMeta = getTechnicalMeta(prod)

            return (
              <div
                key={prod.id}
                className="bg-card border border-border rounded-xl overflow-hidden flex flex-col h-full shadow-card hover:shadow-card-hover hover:border-border/80 hover:-translate-y-1 transition-all duration-300 group cursor-default"
              >
                {/* Product Image */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted/30 border-b border-border shrink-0">
                  {getProductImage(prod) ? (
                    <img
                      src={getProductImage(prod)}
                      alt={prod.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-muted/20">
                      <span className="text-xs text-muted-foreground">Tidak Ada Foto</span>
                    </div>
                  )}
                  <div className="absolute top-3 left-3 bg-background/95 px-2 py-0.5 rounded text-[9px] font-bold tracking-wide uppercase text-foreground border border-border flex items-center gap-1 shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-500" />
                    {STOCK_STATUS_MAP[prod.status] || prod.status}
                  </div>
                </div>

                {/* Product Details */}
                <div className="p-5 flex-1 flex flex-col justify-between text-left">
                  <div>
                    <h3 className="font-bold text-foreground text-sm mb-3 group-hover:text-warning transition-colors line-clamp-1">
                      {prod.name}
                    </h3>

                    {/* Industrial Catalog Spec Table */}
                    <div className="space-y-1.5 text-[11px] border-t border-border pt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground/80 font-bold uppercase tracking-wide text-[9px]">SKU</span>
                        <span className="font-mono text-foreground font-semibold">{getProductSku(prod)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground/80 font-bold uppercase tracking-wide text-[9px]">Kategori</span>
                        <span className="text-muted-foreground font-medium truncate max-w-[140px]">{prod.category?.name || "Lainnya"}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground/80 font-bold uppercase tracking-wide text-[9px]">Kapasitas</span>
                        <span className="text-muted-foreground font-medium truncate max-w-[140px]">{techMeta.kapasitas}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground/80 font-bold uppercase tracking-wide text-[9px]">Standar</span>
                        <span className="text-muted-foreground font-medium truncate max-w-[140px]">{techMeta.standar}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground/80 font-bold uppercase tracking-wide text-[9px]">TKDN</span>
                        <span className="text-muted-foreground font-medium flex items-center gap-0.5">
                          <ShieldCheck className="h-3 w-3 text-emerald-500 shrink-0" />
                          {techMeta.tkdn.split(' ')[0]}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-border">
                    <Button
                      variant="outline"
                      className="w-full text-xs h-8 text-foreground border-border hover:bg-muted/50 gap-1.5 rounded-lg shadow-card cursor-pointer"
                      asChild
                    >
                      <Link to={`/products/${prod.slug}`}>
                        <Eye className="h-3.5 w-3.5" />
                        Detail Spesifikasi
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </motion.div>
      </div>
    </section>
  );
}
