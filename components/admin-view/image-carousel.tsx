"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, X } from "lucide-react"

interface ImageCarouselProps {
  images: string[]
  isOpen: boolean
  onClose: () => void
  initialIndex?: number
  title?: string
}

export function ImageCarousel({ images, isOpen, onClose, initialIndex = 0, title }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)

  useEffect(() => {
    setCurrentIndex(initialIndex)
  }, [initialIndex, isOpen])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return

      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault()
          setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))
          break
        case "ArrowRight":
          e.preventDefault()
          setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))
          break
        case "Escape":
          e.preventDefault()
          onClose()
          break
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown)
      return () => document.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen, images.length, onClose])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
      return () => {
        document.body.style.overflow = "unset"
      }
    }
  }, [isOpen])

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  if (!images || images.length === 0 || !isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      {/* Modal Content */}
      <div className="relative w-full max-w-4xl lg:max-w-5xl max-h-[95vh] bg-black rounded-lg overflow-hidden mx-4 sm:mx-6 md:mx-8">
        {/* Close button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white"
          onClick={onClose}
        >
          <X className="h-4 w-4 hover:text-white" />
        </Button>

        {/* Title */}
        {title && (
          <div className="absolute top-4 left-4 z-10 bg-black/50 text-white px-3 py-1 rounded-md">
            <span className="text-sm font-medium">{title}</span>
          </div>
        )}

        {/* Image counter */}
        <div className="absolute bottom-4 left-4 z-10 bg-black/50 text-white px-3 py-1 rounded-md">
          <span className="text-sm">
            {currentIndex + 1} / {images.length}
          </span>
        </div>

        {/* Main image */}
        <div className="relative h-[70vh] sm:h-[75vh] md:h-[80vh] flex items-center justify-center">
          <img
            src={images[currentIndex] || "/placeholder.svg"}
            alt={`Image ${currentIndex + 1}`}
            className="max-h-full max-w-full object-contain"
          />
        </div>

        {/* Navigation buttons */}
        {images.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
              onClick={goToPrevious}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
              onClick={goToNext}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </>
        )}

        {/* Thumbnail strip */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-black/50 p-2 rounded-lg max-w-[90%] overflow-x-auto">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`flex-shrink-0 w-12 h-12 rounded overflow-hidden border-2 transition-all ${
                  index === currentIndex ? "border-white" : "border-transparent opacity-70 hover:opacity-100"
                }`}
              >
                <img
                  src={image || "/placeholder.svg"}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}