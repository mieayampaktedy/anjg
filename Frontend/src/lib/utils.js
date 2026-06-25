import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function getAssetUrl(path) {
  if (!path) return ""
  if (path.startsWith("http")) return path
  if (path.startsWith("/uploads")) {
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api"
    const baseUrl = apiUrl.replace(/\/api$/, "")
    return `${baseUrl}${path}`
  }
  return path
}
