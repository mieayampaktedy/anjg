import { Button } from "@/components/ui/button"
import { Helmet } from "react-helmet-async"
import { Link } from "react-router-dom"

export default function NotFound() {
  return (
    <>
      <Helmet>
        <title>Halaman Tidak Ditemukan - Global Indo Teknik Mandiri</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-9xl font-extrabold text-slate-200">404</h1>
        <h2 className="text-3xl font-bold text-slate-800 mt-4">Halaman Tidak Ditemukan</h2>
        <p className="text-slate-500 mt-2 max-w-md">
          Maaf, halaman yang Anda tuju mungkin telah dihapus, namanya berubah, atau untuk sementara tidak tersedia.
        </p>
        <Button asChild className="mt-8">
          <Link to="/">Kembali ke Beranda</Link>
        </Button>
      </div>
    </>
  )
}
