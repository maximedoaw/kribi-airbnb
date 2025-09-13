"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { ChevronLeft, ChevronRight, X, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface ImageGalleryProps {
  images: string[]
  onDeleteImage?: (imageUrl: string) => void
  editable?: boolean
  className?: string
}

export function ImageGallery({ images, onDeleteImage, editable = false, className }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isOpen, setIsOpen] = useState(false)

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

  const handleDeleteImage = (imageUrl: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (onDeleteImage) {
      onDeleteImage(imageUrl)
      if (currentIndex >= images.length - 1) {
        setCurrentIndex(Math.max(0, images.length - 2))
      }
    }
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Thumbnail Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {images.map((image, index) => (
          <div key={index} className="relative group">
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <button
                  onClick={() => {
                    setCurrentIndex(index)
                    setIsOpen(true)
                  }}
                  className="relative w-full aspect-square overflow-hidden rounded-lg bg-muted hover:opacity-80 transition-opacity"
                >
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`Image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              </DialogTrigger>

              {/* Lightbox Modal */}
              <DialogContent className="max-w-4xl w-full h-[90vh] p-0">
                <div className="relative w-full h-full bg-black rounded-lg overflow-hidden">
                  {/* Close Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white"
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>

                  {/* Navigation Buttons */}
                  {images.length > 1 && (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white"
                        onClick={prevImage}
                      >
                        <ChevronLeft className="h-6 w-6" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white"
                        onClick={nextImage}
                      >
                        <ChevronRight className="h-6 w-6" />
                      </Button>
                    </>
                  )}

                  {/* Delete Button */}
                  {editable && onDeleteImage && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-4 left-4 z-10 bg-destructive/80 hover:bg-destructive text-destructive-foreground"
                      onClick={(e) => handleDeleteImage(images[currentIndex], e)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}

                  {/* Main Image */}
                  <img
                    src={images[currentIndex] || "/placeholder.svg"}
                    alt={`Image ${currentIndex + 1}`}
                    className="w-full h-full object-contain"
                  />

                  {/* Image Counter */}
                  {images.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                      {currentIndex + 1} / {images.length}
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>

            {/* Delete Button on Thumbnail (for editable mode) */}
            {editable && onDeleteImage && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity bg-destructive/80 hover:bg-destructive text-destructive-foreground h-6 w-6"
                onClick={(e) => handleDeleteImage(image, e)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
