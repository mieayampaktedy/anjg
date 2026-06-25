import { motion } from "framer-motion";
import { procurementData } from "@/data/procurement";
import { Hammer, Settings2, ShieldCheck, MapPin } from "lucide-react";
import { useCompanyProfile } from "@/hooks/useCompanyProfile";
import { getAssetUrl } from "@/lib/utils";

export default function WorkshopSection() {
  const { workshop } = procurementData;
  const { profile } = useCompanyProfile();

  const location = profile?.home_workshop_location || workshop.location;
  const acreage = profile?.home_workshop_acreage || workshop.acreage;

  const facilities = (() => {
    if (profile?.home_workshop_facilities) {
      try {
        const parsed = JSON.parse(profile.home_workshop_facilities);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {
        console.error("Gagal parse home_workshop_facilities", e);
      }
    }
    return workshop.facilities;
  })();

  return (
    <section className="bg-white dark:bg-slate-900/20 py-12 md:py-16 lg:py-24 border-b border-slate-100 dark:border-slate-800/40">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.25 }}
          className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-center"
        >
          {/* Left Column: Workshop Details */}
          <div className="lg:col-span-7">
            <span className="text-xs font-semibold text-accent uppercase tracking-widest block mb-3">
              Fasilitas Produksi
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-6 leading-tight tracking-tight">
              Kapasitas Manufaktur Mandiri & Workshop Bogor
            </h2>
            <p className="text-slate-650 dark:text-slate-350 text-base leading-relaxed mb-8">
              Pabrikasi produk teknik kami dilakukan sepenuhnya di workshop fisik kami yang berlokasi di {location}. Dengan area seluas {acreage}, kami mengendalikan kualitas secara penuh dari pemotongan baja hingga kalibrasi akhir.
            </p>

            <div className="space-y-4">
              {facilities.map((fac, idx) => {
                // Return icons based on indices
                let Icon = Settings2;
                if (idx === 0) Icon = Hammer;
                if (idx === 3) Icon = ShieldCheck;

                return (
                  <div key={idx} className="flex gap-4 p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl shadow-card hover:shadow-card-hover hover:border-slate-200 dark:hover:border-slate-700 transition-all duration-300 cursor-default group">
                    <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-accent/10 group-hover:border-accent/20 transition-all">
                      <Icon className="h-5 w-5 text-slate-600 dark:text-slate-350 group-hover:text-accent transition-colors" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">{fac.title}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{fac.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Physical Image / Blueprint layout */}
          <div className="lg:col-span-5 relative">
            <div className="relative border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden shadow-card">
              <img
                src={profile.workshop_image_url ? getAssetUrl(profile.workshop_image_url) : "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=800&auto=format&fit=crop"}
                alt="Fasilitas Pabrik CV Globalindo Teknik Mandiri"
                className="w-full aspect-[4/3] object-cover"
                loading="lazy"
              />
              
              {/* Badge Overlay */}
              <div className="absolute bottom-4 left-4 right-4 bg-slate-950/90 backdrop-blur-sm border border-slate-800/80 rounded-lg p-3 text-white flex items-center gap-2 shadow-card-hover">
                <MapPin className="h-4.5 w-4.5 text-accent shrink-0" />
                <div className="text-xs">
                  <span className="font-bold block text-white">Workshop Cibadak, Bogor</span>
                  <span className="text-slate-300">Akses inspeksi fisik terbuka untuk auditor pengadaan tender.</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
