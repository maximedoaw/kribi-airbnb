"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Upload, X, AlertCircle } from "lucide-react"
import type { Apartment, ApartmentFormData } from "@/types/apartment"
import { useApartments } from "@/hooks/use-apartments"

interface ApartmentFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  apartment?: Apartment
  mode: "edit" | "create"
}

export function ApartmentFormDialog({ open, onOpenChange, apartment, mode }: ApartmentFormDialogProps) {
  const { updateApartment, loading } = useApartments()
  const [priceInput, setPriceInput] = useState<string>("")
  const [priceError, setPriceError] = useState<string>("")
  const [formData, setFormData] = useState<ApartmentFormData>({
    title: "",
    description: "",
    price: "",
    location: "",
    bedrooms: 1,
    bathrooms: 1,
    area: 0,
    type: "apartment",
    available: true,
  })
  const [newImages, setNewImages] = useState<File[]>([])
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([])

  useEffect(() => {
    if (apartment && mode === "edit") {
      setFormData({
        title: apartment.title,
        description: apartment.description,
        price: apartment.price.toString(),
        location: apartment.location,
        bedrooms: apartment.bedrooms,
        bathrooms: apartment.bathrooms,
        area: apartment.area,
        type: apartment.type || "apartment",
        available: apartment.available,
      })
      setPriceInput(apartment.price.toString())
      setNewImages([])
      setImagesToDelete([])
    } else {
      setFormData({
        title: "",
        description: "",
        price: "",
        location: "",
        bedrooms: 1,
        bathrooms: 1,
        area: 0,
        type: "apartment",
        available: true,
      })
      setPriceInput("")
      setNewImages([])
      setImagesToDelete([])
    }
    setPriceError("")
  }, [apartment, mode, open])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return

      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        handleSubmit()
      } else if (e.key === "Escape") {
        e.preventDefault()
        onOpenChange(false)
      }
    }

    if (open) {
      document.addEventListener("keydown", handleKeyDown)
      return () => document.removeEventListener("keydown", handleKeyDown)
    }
  }, [open, formData, newImages, imagesToDelete])

  const validatePrice = (value: string): boolean => {
    if (!value.trim()) {
      setPriceError("Le prix est requis")
      return false
    }

    const numValue = Number.parseFloat(value)
    if (Number.isNaN(numValue) || numValue <= 0) {
      setPriceError("Le prix doit être un nombre positif")
      return false
    }
    setPriceError("")
    return true
  }

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setPriceInput(value)
    setFormData({ ...formData, price: value })
    if (value) {
      validatePrice(value)
    } else {
      setPriceError("")
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setNewImages((prev) => [...prev, ...files])
  }

  const removeNewImage = (index: number) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index))
  }

  const markImageForDeletion = (imageUrl: string) => {
    setImagesToDelete((prev) => [...prev, imageUrl])
  }

  const unmarkImageForDeletion = (imageUrl: string) => {
    setImagesToDelete((prev) => prev.filter((url) => url !== imageUrl))
  }

  const handleSubmit = async () => {
    if (!validatePrice(priceInput) || !apartment?.id) return

    try {
      await updateApartment(apartment.id, formData, newImages, imagesToDelete)
      onOpenChange(false)
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error)
    }
  }

  if (!apartment && mode === "edit") return null

  const currentImages = apartment?.images?.filter((img) => !imagesToDelete.includes(img)) || []

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-purple-600 flex items-center justify-center">
              <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </div>
            {mode === "edit" ? "Modifier l'appartement" : "Créer un appartement"}
          </DialogTitle>
          <DialogDescription>
            {mode === "edit"
              ? "Modifiez les informations de l'appartement en temps réel"
              : "Remplissez les informations pour créer un nouvel appartement"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Titre *</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Nom de l'appartement"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-location">Localisation *</Label>
              <Input
                id="edit-location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Adresse ou quartier"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-description">Description</Label>
            <Textarea
              id="edit-description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Description détaillée de l'appartement"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-price">Prix (FCFA) *</Label>
              <Input
                id="edit-price"
                value={priceInput}
                onChange={handlePriceChange}
                placeholder="50000"
                required
                className={priceError ? "border-red-500" : ""}
              />
              {priceError && (
                <div className="flex items-center gap-1 text-red-500 text-sm">
                  <AlertCircle className="h-3 w-3" />
                  {priceError}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-bedrooms">Chambres</Label>
              <Input
                id="edit-bedrooms"
                type="number"
                min="0"
                value={formData.bedrooms}
                onChange={(e) => setFormData({ ...formData, bedrooms: Number.parseInt(e.target.value) || 0 })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-bathrooms">Salles de bain</Label>
              <Input
                id="edit-bathrooms"
                type="number"
                min="0"
                value={formData.bathrooms}
                onChange={(e) => setFormData({ ...formData, bathrooms: Number.parseInt(e.target.value) || 0 })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-area">Surface (m²)</Label>
              <Input
                id="edit-area"
                type="number"
                min="0"
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: Number.parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-type">Type de logement</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="apartment">Appartement</SelectItem>
                  <SelectItem value="house">Maison</SelectItem>
                  <SelectItem value="studio">Studio</SelectItem>
                  <SelectItem value="loft">Loft</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-available">Disponibilité</Label>
              <Select
                value={formData.available ? "true" : "false"}
                onValueChange={(value) => setFormData({ ...formData, available: value === "true" })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Disponible</SelectItem>
                  <SelectItem value="false">Indisponible</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Current Images */}
          {mode === "edit" && apartment?.images && apartment.images.length > 0 && (
            <div className="space-y-2">
              <Label>Images actuelles</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {apartment.images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`Image ${index + 1}`}
                      className={`w-full h-24 object-cover rounded-lg border-2 transition-all ${
                        imagesToDelete.includes(image)
                          ? "border-red-500 opacity-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                      {imagesToDelete.includes(image) ? (
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={() => unmarkImageForDeletion(image)}
                        >
                          Restaurer
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => markImageForDeletion(image)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    {imagesToDelete.includes(image) && (
                      <Badge variant="destructive" className="absolute top-1 left-1 text-xs">
                        À supprimer
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* New Images */}
          <div className="space-y-2">
            <Label htmlFor="edit-images">Ajouter de nouvelles images</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
              <input
                id="edit-images"
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <Label htmlFor="edit-images" className="cursor-pointer">
                <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">Cliquez pour ajouter des images</p>
              </Label>
            </div>

            {newImages.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                {newImages.map((file, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={URL.createObjectURL(file) || "/placeholder.svg"}
                      alt={`Nouvelle image ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg border-2 border-green-200"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-1 right-1 h-6 w-6 p-0"
                      onClick={() => removeNewImage(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                    <Badge variant="secondary" className="absolute bottom-1 left-1 text-xs">
                      Nouvelle
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Annuler
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              !formData.title ||
              !formData.description ||
              !priceInput ||
              priceError !== "" ||
              !formData.location ||
              loading
            }
            className="bg-purple-700 hover:bg-purple-800"
          >
            {loading ? "Mise à jour..." : "Mettre à jour"}
          </Button>
        </DialogFooter>

        <div className="text-xs text-gray-500 mt-2">Raccourcis : Ctrl+Entrée pour sauvegarder, Échap pour fermer</div>
      </DialogContent>
    </Dialog>
  )
}
