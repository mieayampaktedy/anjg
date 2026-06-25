import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, FileText, CheckCircle2 } from "lucide-react";
import { useCompanyProfile } from "@/hooks/useCompanyProfile";
import { getAssetUrl } from "@/lib/utils";

export default function HeroSection() {
  const { profile } = useCompanyProfile();

  const bgImage = profile.workshop_image_url
    ? getAssetUrl(profile.workshop_image_url)
    : "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop";

  return (
    <section className="relative bg-navy overflow-hidden min-h-[85vh] flex items-center">
      {/* Background image with low opacity for manufacturing texture */}
      <div className="absolute inset-0">
        <img
          src={bgImage}
          alt={`Workshop Manufaktur ${profile.name}`}
          className="w-full h-full object-cover opacity-15"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/95 to-navy/70" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16 lg:py-24">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="max-w-3xl"
        >
          {/* Tagline */}
          {profile.tagline && (
            <span className="block text-xs font-bold text-warning uppercase tracking-widest mb-4">
              {profile.tagline}
            </span>
          )}

          {/* Headline */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-6 leading-tight tracking-tight">
            {profile.hero_title}
          </h1>

          {/* Subheadline */}
          <p className="text-slate-400 text-sm md:text-base leading-relaxed mb-10 max-w-2xl">
            {profile.hero_subtitle}
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
            <Button
              size="lg"
              className="bg-warning hover:bg-warning/90 text-warning-foreground px-6 h-11 text-sm font-semibold rounded-lg w-full sm:w-auto justify-center"
              asChild
            >
              <Link to="/produk">
                Lihat Katalog Produk
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-slate-700 text-slate-300 bg-transparent hover:bg-white/5 hover:text-white px-6 h-11 text-sm rounded-lg w-full sm:w-auto justify-center"
              asChild
            >
              <Link to="/hubungi-kami">
                <FileText className="mr-2 h-4 w-4" />
                Minta Penawaran Resmi (RFQ)
              </Link>
            </Button>
          </div>

          {/* Trust Metadata */}
          <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-wrap items-center gap-6 text-sm text-slate-400">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-4.5 w-4.5 text-warning" /> Terdaftar di E-Katalog LKPP
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-4.5 w-4.5 text-warning" /> Standar SNI & Kementerian
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-4.5 w-4.5 text-warning" /> Faktur Pajak Resmi
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
