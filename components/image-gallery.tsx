"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X, Trash2, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface ImageGalleryProps {
  images: string[]
  onDeleteImage?: (imageUrl: string) => void
  editable?: boolean
  className?: string
}

export function ImageGallery({ images, onDeleteImage, editable = false, className }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [mainImageIndex, setMainImageIndex] = useState(0)

  if (!images || images.length === 0) {
    return (
      <div className={cn("flex items-center justify-center h-48 bg-muted rounded-lg", className)}>
        <p className="text-muted-foreground">Aucune image disponible</p>
      </div>
    )
  }

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const nextMainImage = () => {
    setMainImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevMainImage = () => {
    setMainImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const handleDeleteImage = (imageUrl: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (onDeleteImage) {
      onDeleteImage(imageUrl)
      if (currentIndex >= images.length - 1) {
        setCurrentIndex(Math.max(0, images.length - 2))
      }
      if (mainImageIndex >= images.length - 1) {
        setMainImageIndex(Math.max(0, images.length - 2))
      }
    }
  }

  const openLightbox = (index: number) => {
    setCurrentIndex(index)
    setIsLightboxOpen(true)
  }

  const closeLightbox = () => {
    setIsLightboxOpen(false)
  }

  const selectMainImage = (index: number) => {
    setMainImageIndex(index)
  }

  // Gestion des événements clavier pour la lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isLightboxOpen) {
        if (e.key === 'Escape') {
          closeLightbox()
        } else if (e.key === 'ArrowRight') {
          nextImage()
        } else if (e.key === 'ArrowLeft') {
          prevImage()
        }
      } else {
        if (e.key === 'ArrowRight') {
          nextMainImage()
        } else if (e.key === 'ArrowLeft') {
          prevMainImage()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isLightboxOpen, currentIndex, mainImageIndex, images.length])

  return (
    <div className={cn("space-y-4", className)}>
      {/* Grande image principale */}
      <div className="relative w-full aspect-[4/3] md:aspect-video rounded-xl overflow-hidden bg-muted shadow-lg group">
        <img
          src={images[mainImageIndex] || "/placeholder.svg"}
          alt={`Image principale ${mainImageIndex + 1}`}
          className="w-full h-full object-cover cursor-pointer transition-transform duration-300 group-hover:scale-105"
          onClick={() => openLightbox(mainImageIndex)}
        />
        
        {/* Navigation pour la grande image */}
        {images.length > 1 && (
          <>
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white h-10 w-10 rounded-full flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100"
              onClick={(e) => {
                e.stopPropagation()
                prevMainImage()
              }}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white h-10 w-10 rounded-full flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100"
              onClick={(e) => {
                e.stopPropagation()
                nextMainImage()
              }}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        {/* Indicateur d'image actuelle */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-medium">
            {mainImageIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Miniatures des images */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
          {images.map((image, index) => (
            <div key={index} className="relative group cursor-pointer">
              <div
                onClick={() => selectMainImage(index)}
                className={cn(
                  "relative w-full aspect-square overflow-hidden rounded-lg bg-muted transition-all duration-300 border-2",
                  index === mainImageIndex 
                    ? "border-blue-500 scale-105 shadow-md" 
                    : "border-transparent hover:border-gray-300 hover:scale-105"
                )}
              >
                <img
                  src={image || "/placeholder.svg"}
                  alt={`Miniature ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                
                {/* Overlay au survol */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 rounded-lg" />
              </div>

              {/* Delete Button on Thumbnail (for editable mode) */}
              {editable && onDeleteImage && (
                <button
                  className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-destructive/90 hover:bg-destructive text-white h-5 w-5 rounded-full flex items-center justify-center text-xs shadow-lg"
                  onClick={(e) => handleDeleteImage(image, e)}
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Modal - Fixe et centré */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300 overflow-hidden">
          {/* Close Button */}
          <button
            className="absolute top-6 right-6 z-50 bg-black/50 hover:bg-black/70 text-white h-10 w-10 rounded-full flex items-center justify-center transition-all duration-300"
            onClick={closeLightbox}
          >
            <X className="h-5 w-5" />
          </button>

          {/* Navigation Buttons */}
          {images.length > 1 && (
            <>
              <button
                className="absolute left-4 top-1/2 -translate-y-1/2 z-50 bg-black/50 hover:bg-black/70 text-white h-12 w-12 rounded-full flex items-center justify-center transition-all duration-300"
                onClick={prevImage}
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 z-50 bg-black/50 hover:bg-black/70 text-white h-12 w-12 rounded-full flex items-center justify-center transition-all duration-300"
                onClick={nextImage}
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          {/* Delete Button */}
          {editable && onDeleteImage && (
            <button
              className="absolute top-6 left-6 z-50 bg-destructive/80 hover:bg-destructive text-white h-10 w-10 rounded-full flex items-center justify-center transition-all duration-300"
              onClick={(e) => handleDeleteImage(images[currentIndex], e)}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}

          {/* Main Image Container - Centré et responsive */}
          <div className="relative w-full max-w-6xl h-full max-h-[80vh] flex items-center justify-center">
            <img
              src={images[currentIndex] || "/placeholder.svg"}
              alt={`Image ${currentIndex + 1}`}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          </div>

          {/* Image Counter */}
          {images.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm font-medium">
              {currentIndex + 1} / {images.length}
            </div>
          )}

          {/* Thumbnail strip at bottom */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 max-w-full overflow-x-auto px-4 pb-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-all duration-200 ${
                    index === currentIndex 
                      ? 'border-white scale-110 shadow-lg' 
                      : 'border-transparent opacity-60 hover:opacity-100 hover:scale-105'
                  }`}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}