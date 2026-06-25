import { Helmet } from "react-helmet-async";
import HeroSection from "@/components/public/home/HeroSection";
import CredentialsSection from "@/components/public/home/CredentialsSection";
import WorkshopSection from "@/components/public/home/WorkshopSection";
import BusinessDivisionSection from "@/components/public/home/BusinessDivisionSection";
import FeaturedProductsSection from "@/components/public/home/FeaturedProductsSection";
import ProcurementSection from "@/components/public/home/ProcurementSection";
import CTASection from "@/components/public/home/CTASection";

export default function Home() {
  return (
    <>
      <Helmet>
        <title>Pabrikator & Supplier Teknik Industri Nasional — CV Globalindo Teknik Mandiri</title>
        <meta
          name="description"
          content="Produsen lokal alat marka jalan GTM-Sprayer, alat laboratorium sipil, dan mesin pertanian perkebunan sejak 2009. Workshop di Cibadak Kota Bogor."
        />
      </Helmet>

      <HeroSection />
      <CredentialsSection />
      <WorkshopSection />
      <BusinessDivisionSection />
      <FeaturedProductsSection />
      <ProcurementSection />
      <CTASection />
    </>
  );
}
