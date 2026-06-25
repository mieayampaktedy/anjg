import { useState, useEffect } from "react"
import { Play, ChevronLeft, ChevronRight, Search } from "lucide-react"
import useEmblaCarousel from "embla-carousel-react"

import Lightbox from "yet-another-react-lightbox"
import "yet-another-react-lightbox/styles.css"
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails"
import "yet-another-react-lightbox/plugins/thumbnails.css"
import Zoom from "yet-another-react-lightbox/plugins/zoom"
import Counter from "yet-another-react-lightbox/plugins/counter"
import "yet-another-react-lightbox/plugins/counter.css"

function getYoutubeId(url) {
  if (!url) return null
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = url.match(regExp)
  return match && match[2].length === 11 ? match[2] : null
}

export default function ProductGallery({ media = [] }) {
  const items = media.length > 0 ? media : [{
    type: "image",
    url: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800",
  }]

  const [activeIndex, setActiveIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })

  useEffect(() => {
    if (!emblaApi) return
    const onSelect = () => {
      setActiveIndex(emblaApi.selectedScrollSnap())
    }
    emblaApi.on("select", onSelect)
    return () => {
      emblaApi.off("select", onSelect)
    }
  }, [emblaApi])

  const scrollPrev = () => emblaApi && emblaApi.scrollPrev()
  const scrollNext = () => emblaApi && emblaApi.scrollNext()
  const scrollTo = (index) => emblaApi && emblaApi.scrollTo(index)

  const showNavButtons = items.length > 1

  useEffect(() => {
    if (!showNavButtons || !emblaApi) return
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") {
        emblaApi.scrollPrev()
      } else if (e.key === "ArrowRight") {
        emblaApi.scrollNext()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [emblaApi, showNavButtons])

  const getThumbnailUrl = (item) => {
    if (item.type === "image") return item.url
    if (item.type === "youtube") {
      const id = getYoutubeId(item.url)
      return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : ""
    }
    return ""
  }

  // Create slides for lightbox
  const slides = items.map((item) => {
    if (item.type === "youtube") {
      const id = getYoutubeId(item.url)
      return {
        type: "youtube",
        src: id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : "",
        youtubeUrl: item.url,
      }
    }
    return {
      type: "image",
      src: item.url,
    }
  })

  return (
    <div className="space-y-4">
      {/* Main Viewport Container */}
      <div className="relative group w-full h-[320px] min-h-[320px] lg:h-[500px] lg:min-h-[500px] bg-slate-955 rounded-2xl border border-border shadow-sm overflow-hidden flex items-center justify-center bg-slate-950">
        {/* Media Counter */}
        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-xs text-white px-3 py-1 rounded-full text-xs font-bold font-mono tracking-wider select-none z-10 shadow-md">
          {activeIndex + 1} / {items.length}
        </div>

        {/* Zoom Icon Hint at bottom-right */}
        {items[activeIndex] && items[activeIndex].type !== "youtube" && (
          <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-xs text-white px-2.5 py-1 rounded-md text-[11px] font-semibold flex items-center gap-1.5 shadow-sm select-none pointer-events-none transition-opacity duration-200 opacity-0 group-hover:opacity-100 z-10">
            <Search className="h-3.5 w-3.5 text-white" />
            <span>Klik untuk memperbesar</span>
          </div>
        )}

        <div
          ref={emblaRef}
          className="h-full w-full overflow-hidden"
        >
          <div className="flex h-full w-full items-center">
            {items.map((item, index) => {
              const isYoutube = item.type === "youtube"
              const youtubeId = isYoutube ? getYoutubeId(item.url) : null
              const mainUrl = youtubeId
                ? `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`
                : item.url

              return (
                <div
                  key={index}
                  className="flex-[0_0_100%] min-w-0 h-full relative select-none flex items-center justify-center bg-slate-955 bg-slate-955 bg-slate-950 bg-slate-950 bg-slate-950"
                >
                  <div className="w-full h-full flex items-center justify-center relative">
                    <img
                      src={mainUrl}
                      alt={`Product Preview ${index + 1}`}
                      onError={(e) => {
                        if (youtubeId && e.target.src.includes("maxresdefault")) {
                          e.target.src = `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`
                        }
                      }}
                      className={`w-full h-full object-contain select-none transition-transform duration-200 ${
                        isYoutube ? "cursor-pointer" : "cursor-zoom-in"
                      }`}
                      draggable="false"
                      onClick={() => {
                        if (isYoutube) {
                          window.open(item.url, "_blank")
                        } else {
                          setLightboxOpen(true)
                        }
                      }}
                    />

                    {/* YouTube Play Icon and Hover Overlay */}
                    {isYoutube && (
                      <>
                        <div 
                          className="absolute inset-0 bg-black/20 hover:bg-black/35 transition-colors duration-200 flex items-center justify-center cursor-pointer"
                          onClick={() => window.open(item.url, "_blank")}
                        />
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="w-14 h-14 rounded-full bg-warning flex items-center justify-center text-warning-foreground shadow-lg group-hover:scale-105 active:scale-95 transition-transform duration-200">
                            <Play className="h-6 w-6 fill-current ml-1" />
                          </div>
                        </div>
                        <div className="absolute bottom-4 left-4 right-4 text-center pointer-events-none">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-100 bg-black/40 px-2 py-0.5 rounded border border-white/5 backdrop-blur-xs">
                            Klik untuk menonton di YouTube
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Previous and Next Buttons - Vertically Centered */}
        {showNavButtons && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation()
                scrollPrev()
              }}
              className="absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-xl hidden sm:flex items-center justify-center transition-all duration-200 active:scale-95 text-slate-800 dark:text-white hover:bg-white dark:hover:bg-slate-900 z-10 cursor-pointer"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                scrollNext()
              }}
              className="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-xl hidden sm:flex items-center justify-center transition-all duration-200 active:scale-95 text-slate-800 dark:text-white hover:bg-white dark:hover:bg-slate-900 z-10 cursor-pointer"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail Row */}
      {items.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
          {items.map((item, index) => {
            const isActive = index === activeIndex
            const isYoutube = item.type === "youtube"
            const thumbUrl = getThumbnailUrl(item)

            return (
              <button
                key={index}
                onClick={() => scrollTo(index)}
                className={`relative w-20 sm:w-24 aspect-[4/3] rounded-lg border overflow-hidden shrink-0 transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "border-primary ring-2 ring-primary shadow-md opacity-100"
                    : "border-border opacity-60 hover:opacity-100"
                }`}
              >
                <img
                  src={thumbUrl}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                {isYoutube && (
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-warning flex items-center justify-center text-warning-foreground shadow-lg">
                      <Play className="h-4 w-4 fill-current ml-0.5" />
                    </div>
                  </div>
                )}
              </button>
            )
          })}
        </div>
      )}

      {/* Lightbox for full screen inspection */}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={activeIndex}
        slides={slides}
        plugins={[Thumbnails, Zoom, Counter]}
        animation={{ fade: 200, swipe: 200 }}
        controller={{ closeOnBackdropClick: true }}
        on={{
          view: ({ index }) => {
            setActiveIndex(index)
            if (emblaApi) emblaApi.scrollTo(index)
          },
        }}
        render={{
          slide: ({ slide, rect }) => {
            if (slide.type === "youtube") {
              return (
                <div
                  className="relative flex items-center justify-center cursor-pointer select-none"
                  onClick={() => window.open(slide.youtubeUrl, "_blank")}
                  style={{ width: rect.width, height: rect.height }}
                >
                  <img
                    src={slide.src}
                    alt="Video Preview"
                    className="max-w-full max-h-full object-contain"
                  />
                  <div className="absolute inset-0 bg-black/20 hover:bg-black/35 transition-colors duration-200 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-warning flex items-center justify-center text-warning-foreground shadow-lg">
                      <Play className="h-8 w-8 fill-current ml-1" />
                    </div>
                  </div>
                </div>
              )
            }
            return undefined // Use default renderer
          },
        }}
      />
    </div>
  )
}
