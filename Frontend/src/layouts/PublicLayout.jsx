import { Outlet, useLocation } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import Navbar from "@/components/public/Navbar"
import Footer from "@/components/public/Footer"

export default function PublicLayout() {
  const location = useLocation()
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground overflow-x-hidden w-full max-w-full">
      <Navbar />
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className="flex-1 min-w-0 w-full"
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>
      <Footer />
    </div>
  )
}

