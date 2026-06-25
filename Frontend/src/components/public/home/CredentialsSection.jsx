import { motion } from "framer-motion";
import { useCompanyProfile } from "@/hooks/useCompanyProfile";
import { FileCheck, ShieldCheck, Scale, Award } from "lucide-react";

export default function CredentialsSection() {
  const { profile } = useCompanyProfile();
  const establishedYear = parseInt(profile.established || '2009', 10);
  const currentYear = new Date().getFullYear();
  const experienceYears = currentYear - establishedYear;

  const stats = [
    { value: `${establishedYear}`, label: "Tahun Didirikan" },
    { value: `${experienceYears}+ Tahun`, label: "Pengalaman Industri" },
    { value: "50+ BUMN & Swasta", label: "Mitra Aktif B2B" },
    { value: "500+ SKU", label: "Katalog Produk Aktif" }
  ];

  return (
    <section className="bg-background py-12 md:py-16 lg:py-24 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.25 }}
          className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-start"
        >
          {/* Left Column - History and Legals */}
          <div className="lg:col-span-7 text-left">
            <span className="text-xs font-semibold text-accent uppercase tracking-widest block mb-3">
              Kredibilitas Hukum & Legalitas
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-6 leading-tight tracking-tight">
              Menjamin Kepatuhan Administrasi dan Keamanan Pengadaan B2B Nasional
            </h2>
            
            <p className="text-slate-650 dark:text-slate-350 text-sm md:text-base leading-relaxed mb-8">
              {profile?.home_credentials_desc || "CV Globalindo Teknik Mandiri adalah badan usaha berbadan hukum resmi yang berkomitmen penuh mendukung kelancaran proyek konstruksi, laboratorium riset, dan permesinan sektor publik maupun swasta. Kami melengkapi setiap transaksi dengan dokumen hukum transparan untuk memudahkan audit."}
            </p>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="flex gap-3">
                <FileCheck className="h-6 w-6 text-accent shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">Status PKP Aktif</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Kami menerbitkan Faktur Pajak E-Faktur resmi untuk setiap pembelian guna kepatuhan perpajakan badan usaha.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <ShieldCheck className="h-6 w-6 text-accent shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">Legalitas BKPM Lengkap</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Dilengkapi NIB & Izin Usaha Industri (IUI) resmi dari OSS BKPM untuk manufaktur baja dan permesinan.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Scale className="h-6 w-6 text-accent shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">Dukungan TKDN Pemerintah</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Mengutamakan perakitan lokal di workshop Bogor guna memenuhi standar minimal TKDN pada tender kementerian.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Award className="h-6 w-6 text-accent shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">Siap Tender LPSE / LKPP</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Kami siap menerbitkan Surat Dukungan Pabrikator resmi yang diakui oleh Pejabat Pembuat Komitmen (PPK) proyek.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Stats Grid */}
          <div className="bg-muted/30 border border-border rounded-2xl p-6 sm:p-8 shadow-card lg:col-span-5 text-left">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-6 pb-4 border-b border-border">
              Fakta & Rekam Jejak Operasional
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {stats.map((stat, idx) => (
                <div key={idx} className="surface-card p-4 sm:p-5 hover:shadow-card-hover transition-all duration-300 cursor-default">
                  <div className="text-2xl lg:text-3xl font-extrabold text-foreground leading-tight">
                    {stat.value}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1 font-medium leading-relaxed">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-border text-xs text-muted-foreground leading-relaxed">
              * Seluruh statistik di atas merujuk pada rekam jejak riil pengiriman alat dan pabrikasi unit kami sejak tahun {establishedYear}.
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
