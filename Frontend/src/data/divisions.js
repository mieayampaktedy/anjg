import { TrafficCone, ShieldCheck, Microscope, Tractor, Compass, Flame } from "lucide-react";

export const divisionsData = [
  {
    id: "marka-jalan",
    title: "Divisi Marka Jalan",
    description: "Pabrikasi mesin marka jalan tipe sprayer (GTM-Sprayer) dan mesin preheater pengaduk cat marka jalan, serta suplai cat Thermoplastic AASHTO.",
    keyProducts: ["Mesin Marka GTM-Sprayer", "Mesin Preheater Pengaduk Cat", "Mesin Penghapus Marka", "Cat Thermoplastic & Glass Beads"],
    icon: TrafficCone
  },
  {
    id: "safety-jalan",
    title: "Peralatan Safety Jalan",
    description: "Penyedia perlengkapan jalan raya berstandar Kemenhub/PUPR untuk kebutuhan rambu tol, pengarah jalan, dan pembatas area proyek.",
    keyProducts: ["Road Barrier Polyethylene", "Delineator Post Plastik/Baja", "Rambu Lalu Lintas SNI", "Traffic Light & Convex Mirror"],
    icon: ShieldCheck
  },
  {
    id: "lab-uji-sipil",
    title: "Laboratorium & Alat Uji Sipil",
    description: "Manufaktur furniture laboratorium teknik (Fume Hood & Island Bench) dan penyedia instrumen pengujian material sipil tanah, aspal, dan beton.",
    keyProducts: ["Compression Machine Uji Beton", "Lemari Asam (Fume Hood)", "Meja Island Bench Lab", "Soil Auger & Core Drill"],
    icon: Microscope
  },
  {
    id: "pertanian-sadap",
    title: "Mesin Pertanian & Sadap Karet",
    description: "Pabrikator mesin sadap getah karet, wood chipper, serta peralatan pemrosesan pasca panen komoditas perkebunan nasional.",
    keyProducts: ["Mesin Sadap Karet Motorized", "Mangkok Sadap & Pembeku Getah", "Mesin Wood Chipper", "Mesin Pengolah Kopi/Kakao"],
    icon: Tractor
  },
  {
    id: "survey-geodesi",
    title: "Peralatan Survey & Geodesi",
    description: "Suplai instrumen ukur geodetik, pemantauan cuaca otomatis (klimatologi), serta sensor pemantauan debit air hidrologi.",
    keyProducts: ["Automatic Weather Station (AWS)", "Water Level Recorder", "Alat Ukur Geodesi & Teodolit", "Klimatologi & Barometer"],
    icon: Compass
  },
  {
    id: "rescue-kebencanaan",
    title: "Rescue & Penanggulangan Bencana",
    description: "Suplai perlengkapan evakuasi darurat Basarnas, baju tahan api/panas, pemadam kebakaran hutan (Karhutla), dan safety gear industri.",
    keyProducts: ["Mesin Pemadam Karhutla Portabel", "Safety Baju B3 & Pemadam", "Peralatan Evakuasi & Rescue", "Masker Respirator Gas Racun"],
    icon: Flame
  }
];
