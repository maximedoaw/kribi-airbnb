"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle } from "lucide-react";
import type { Apartment } from "@/types";

interface AddApartmentDialogProps {
  onAddApartment: (
    apartment: Omit<Apartment, "id">,
    imageFiles: File[]
  ) => Promise<void>;
  isUploading: boolean;
  loading: boolean;
  currentUploads: Array<{ file: File; progress: number }>;
}

export function AddApartmentDialog({
  onAddApartment,
  isUploading,
  loading,
  currentUploads,
}: AddApartmentDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [priceInput, setPriceInput] = useState<string>("");
  const [priceError, setPriceError] = useState<string>("");
  const [newApartment, setNewApartment] = useState<Partial<Apartment>>({
    title: "",
    description: "",
    location: "",
    bedrooms: 1,
    bathrooms: 1,
    area: 50,
    images: [],
    available: true,
    amenities: [],
    type: "apartment",
    furnished: false,
    petFriendly: false,
    parking: false,
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        handleAddApartment();
      } else if (e.key === "Escape") {
        e.preventDefault();
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, newApartment, priceInput, imageFiles]);

  const validatePrice = (value: string): boolean => {
    if (!value.trim()) {
      setPriceError("Le prix est requis");
      return false;
    }

    const numValue = Number.parseFloat(value);
    if (Number.isNaN(numValue) || numValue <= 0) {
      setPriceError("Le prix doit être un nombre positif");
      return false;
    }
    setPriceError("");
    return true;
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPriceInput(value);
    if (value) {
      validatePrice(value);
    } else {
      setPriceError("");
    }
  };

  const handleImageUpload = async (files: FileList | null) => {
    if (!files) return;

    const newFiles = Array.from(files);
    const newPreviews = newFiles.map((file) => URL.createObjectURL(file));

    setImageFiles((prev) => [...prev, ...newFiles]);
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleImageUpload(e.target.files);
    e.target.value = "";
  };

  const removeImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));

    if (selectedImageIndex === index) {
      setSelectedImageIndex((prev) =>
        prev > 0 ? prev - 1 : Math.max(0, imagePreviews.length - 2)
      );
    } else if (selectedImageIndex > index) {
      setSelectedImageIndex((prev) => prev - 1);
    }
  };

  const handleAddApartment = async () => {
    if (!validatePrice(priceInput)) {
      return;
    }

    try {
      const apartmentData = {
        ...newApartment,
        price: Number.parseFloat(priceInput),
      } as Omit<Apartment, "id">;

      await onAddApartment(apartmentData, imageFiles);
      setIsOpen(false);
      // Reset form
      setNewApartment({
        title: "",
        description: "",
        location: "",
        bedrooms: 1,
        bathrooms: 1,
        area: 50,
        images: [],
        available: true,
        amenities: [],
        type: "apartment",
        furnished: false,
        petFriendly: false,
        parking: false,
      });
      setPriceInput("");
      setPriceError("");
      setImageFiles([]);
      setImagePreviews([]);
      setSelectedImageIndex(0);
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'appartement:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-orange-700 hover:bg-orange-800 text-white shadow-md border-0 font-medium">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          Ajouter un appartement
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-800">
            Ajouter un nouvel appartement
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Remplissez les informations pour ajouter un nouvel appartement à
            votre catalogue.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-gray-700">
                  Titre *
                </Label>
                <Input
                  id="title"
                  value={newApartment.title}
                  onChange={(e) =>
                    setNewApartment({
                      ...newApartment,
                      title: e.target.value,
                    })
                  }
                  className="w-full"
                  placeholder="Nom de l'appartement"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-gray-700">
                  Description *
                </Label>
                <Textarea
                  id="description"
                  value={newApartment.description}
                  onChange={(e) =>
                    setNewApartment({
                      ...newApartment,
                      description: e.target.value,
                    })
                  }
                  className="w-full min-h-[100px]"
                  placeholder="Description détaillée de l'appartement"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price" className="text-gray-700">
                  Prix (FCFA) *
                </Label>
                <Input
                  id="price"
                  type="text"
                  value={priceInput}
                  onChange={handlePriceChange}
                  className={`w-full ${priceError ? "border-red-500" : ""}`}
                  placeholder="Prix en FCFA (ex: 125000)"
                />
                {priceError && (
                  <div className="flex items-center gap-1 text-red-500 text-sm">
                    <AlertCircle className="h-3 w-3" />
                    {priceError}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="location" className="text-gray-700">
                  Localisation *
                </Label>
                <Input
                  id="location"
                  value={newApartment.location}
                  onChange={(e) =>
                    setNewApartment({
                      ...newApartment,
                      location: e.target.value,
                    })
                  }
                  className="w-full"
                  placeholder="Adresse complète"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="bedrooms" className="text-gray-700">
                    Chambres
                  </Label>
                  <Input
                    id="bedrooms"
                    type="number"
                    min="0"
                    value={newApartment.bedrooms}
                    onChange={(e) =>
                      setNewApartment({
                        ...newApartment,
                        bedrooms: Number(e.target.value),
                      })
                    }
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bathrooms" className="text-gray-700">
                    Salles de bain
                  </Label>
                  <Input
                    id="bathrooms"
                    type="number"
                    min="0"
                    value={newApartment.bathrooms}
                    onChange={(e) =>
                      setNewApartment({
                        ...newApartment,
                        bathrooms: Number(e.target.value),
                      })
                    }
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="area" className="text-gray-700">
                    Surface (m²)
                  </Label>
                  <Input
                    id="area"
                    type="number"
                    min="1"
                    value={newApartment.area}
                    onChange={(e) =>
                      setNewApartment({
                        ...newApartment,
                        area: Number(e.target.value),
                      })
                    }
                    className="w-full"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="available"
                  checked={newApartment.available}
                  onCheckedChange={(checked) =>
                    setNewApartment({
                      ...newApartment,
                      available: checked,
                    })
                  }
                />
                <Label
                  htmlFor="available"
                  className="text-gray-700 cursor-pointer"
                >
                  Disponible immédiatement
                </Label>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="images" className="text-gray-700">
                  Images de l'appartement *
                </Label>

                {/* Zone de drop et sélection */}
                <div className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg border-gray-300 bg-gray-50 hover:bg-gray-100 relative overflow-hidden cursor-pointer mb-4">
                  <input
                    type="file"
                    id="images"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg
                      className="w-8 h-8 mb-4 text-gray-500"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 20 16"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                      />
                    </svg>
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">
                        Cliquez pour ajouter des images
                      </span>
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, JPEG (MAX. 5MB par image)
                    </p>
                  </div>
                </div>

                {imagePreviews.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600">
                      {imagePreviews.length} image(s) sélectionnée(s)
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {imagePreviews.map((preview, index) => (
                        <div
                          key={index}
                          className={`relative group ${
                            index === 0 ? "ring-2 ring-orange-500" : ""
                          }`}
                        >
                          <img
                            src={preview || "/placeholder.svg"}
                            alt={`Preview ${index + 1}`}
                            className="w-16 h-16 object-cover rounded-md border-2 border-gray-300 cursor-pointer"
                            onClick={() => setSelectedImageIndex(index)}
                          />
                          {index === 0 && (
                            <div className="absolute -top-2 -left-2 bg-orange-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                              1
                            </div>
                          )}
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Visionneuse d'image principale */}
                    <div className="relative bg-gray-100 rounded-lg p-4">
                      <img
                        src={
                          imagePreviews[selectedImageIndex] ||
                          "/placeholder.svg"
                        }
                        alt="Preview principale"
                        className="w-full h-48 object-contain rounded-md"
                      />

                      {/* Navigation entre images */}
                      {imagePreviews.length > 1 && (
                        <>
                          <button
                            type="button"
                            onClick={() =>
                              setSelectedImageIndex((prev) =>
                                prev > 0 ? prev - 1 : imagePreviews.length - 1
                              )
                            }
                            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full w-8 h-8 flex items-center justify-center"
                          >
                            ‹
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setSelectedImageIndex((prev) =>
                                prev < imagePreviews.length - 1 ? prev + 1 : 0
                              )
                            }
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full w-8 h-8 flex items-center justify-center"
                          >
                            ›
                          </button>

                          {/* Indicateur de position */}
                          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-xs">
                            {selectedImageIndex + 1} / {imagePreviews.length}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* Barres de progression individuelles */}
                {currentUploads.map((upload, index) => (
                  <div key={index} className="space-y-1 mt-3">
                    <p className="text-sm text-gray-600 truncate">
                      {upload.file.name}
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${upload.progress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-blue-600">
                      {Math.round(upload.progress)}%
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="submit"
            onClick={handleAddApartment}
            className="bg-orange-700 hover:bg-orange-800 text-white font-medium"
            disabled={
              !newApartment.title ||
              !newApartment.description ||
              !priceInput ||
              priceError !== "" ||
              !newApartment.location ||
              imageFiles.length === 0 ||
              isUploading ||
              loading
            }
          >
            {isUploading ? (
              <div className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Upload en cours...
              </div>
            ) : loading ? (
              "Ajout en cours..."
            ) : (
              `Ajouter l'appartement (${imageFiles.length} image(s))`
            )}
          </Button>
        </DialogFooter>

        <div className="text-xs text-gray-500 mt-2">
          Raccourcis : Ctrl+Entrée pour ajouter, Échap pour fermer
        </div>
      </DialogContent>
    </Dialog>
  );
}
