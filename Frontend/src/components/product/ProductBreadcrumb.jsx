import { Link } from "react-router-dom"
import { ChevronRight } from "lucide-react"

export default function ProductBreadcrumb({ category, name }) {
  return (
    <nav className="text-[11px] text-muted-foreground/60 mb-6 flex flex-wrap items-center gap-1.5 font-bold uppercase tracking-wider">
      <Link to="/" className="hover:text-accent transition-colors">Beranda</Link>
      <ChevronRight className="h-3 w-3" />
      <Link to="/produk" className="hover:text-accent transition-colors">Produk</Link>
      {category && (
        <>
          <ChevronRight className="h-3 w-3" />
          <Link to={`/produk?cat=${encodeURIComponent(category)}`} className="hover:text-accent transition-colors">
            {category}
          </Link>
        </>
      )}
      <ChevronRight className="h-3 w-3" />
      <span className="text-muted-foreground truncate max-w-[200px] sm:max-w-xs">{name}</span>
    </nav>
  )
}
