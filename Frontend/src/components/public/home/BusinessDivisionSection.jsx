import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { divisionsData } from "@/data/divisions";
import { ArrowUpRight, HelpCircle } from "lucide-react";
import { useCompanyProfile } from "@/hooks/useCompanyProfile";

export default function BusinessDivisionSection() {
  const { profile } = useCompanyProfile();

  // Parse divisions from profile or fallback to divisionsData
  const divisions = (() => {
    if (profile?.home_divisions) {
      try {
        const parsed = JSON.parse(profile.home_divisions);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map(d => {
            const staticDiv = divisionsData.find(sd => sd.id === d.id);
            return {
              ...d,
              icon: staticDiv?.icon || HelpCircle
            };
          });
        }
      } catch (e) {
        console.error("Gagal parse home_divisions", e);
      }
    }
    return divisionsData;
  })();

  return (
    <section className="bg-background py-12 md:py-16 lg:py-24 border-b border-border text-foreground">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="mb-12">
          <span className="text-xs font-semibold text-accent uppercase tracking-widest block mb-2">
            Spesialisasi Teknik
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
            Divisi Unit Bisnas Manufaktur & Suplai Utama
          </h2>
          <p className="text-muted-foreground mt-2 text-base max-w-2xl">
            CV Globalindo Teknik Mandiri mengelompokkan spesialisasi produksinya menjadi 6 divisi teknik terstruktur guna memenuhi kebutuhan tender khusus.
          </p>
        </div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: { staggerChildren: 0.05 }
            }
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
        >
          {divisions.map((div, idx) => {
            const Icon = div.icon;

            return (
              <motion.div
                key={idx}
                variants={{
                  hidden: { opacity: 0, y: 8 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.25 } }
                }}
                className="surface-card p-8 flex flex-col h-full justify-between group cursor-default"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 bg-background border border-border rounded-lg flex items-center justify-center group-hover:bg-accent/10 group-hover:border-accent/20 transition-all">
                      <Icon className="h-6 w-6 text-muted-foreground group-hover:text-accent transition-colors" />
                    </div>
                    <Link
                      to="/produk"
                      className="text-muted-foreground hover:text-accent transition-colors"
                      title="Lihat katalog divisi"
                    >
                      <ArrowUpRight className="h-5 w-5" />
                    </Link>
                  </div>

                  <h3 className="text-lg font-bold text-foreground mb-3 group-hover:text-accent transition-colors">
                    {div.title}
                  </h3>
                  
                  <p className="text-xs text-muted-foreground leading-relaxed mb-6">
                    {div.description}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-2">
                    Suplai Utama:
                  </h4>
                  <ul className="grid grid-cols-1 gap-1">
                    {div.keyProducts.map((prod, pIdx) => (
                      <li key={pIdx} className="text-xs text-muted-foreground flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                        {prod}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
