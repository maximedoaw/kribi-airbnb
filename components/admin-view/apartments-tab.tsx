"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Edit, Trash2, ToggleLeft, ToggleRight, Search, Filter } from "lucide-react"
import type { Apartment } from "@/types"
import { ConfirmationDialog } from "./confirmation-dialog"
import { ApartmentFormDialog } from "./apartment-form-dialog"
import { ImageCarousel } from "../image-carousel"

interface ApartmentsTabProps {
  apartments: Apartment[]
  searchTerm: string
  loading: boolean
  onToggleAvailability: (id: string) => void
  onDeleteApartment: (id: string) => void
  onUpdateApartment: (id: string, updates: any, newImages?: File[], imagesToDelete?: string[]) => void
}

export function ApartmentsTab({
  apartments,
  searchTerm,
  loading,
  onToggleAvailability,
  onDeleteApartment,
  onUpdateApartment,
}: ApartmentsTabProps) {
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; apartmentId: string; apartmentTitle: string }>({
    open: false,
    apartmentId: "",
    apartmentTitle: "",
  })
  const [editDialog, setEditDialog] = useState<{ open: boolean; apartment?: Apartment }>({
    open: false,
    apartment: undefined,
  })
  const [carouselDialog, setCarouselDialog] = useState<{
    open: boolean
    images: string[]
    title: string
    initialIndex: number
  }>({
    open: false,
    images: [],
    title: "",
    initialIndex: 0,
  })

  const [localSearchTerm, setLocalSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [availabilityFilter, setAvailabilityFilter] = useState<string>("all")
  const [priceRange, setPriceRange] = useState<string>("all")

  const filteredApartments = useMemo(() => {
    return apartments.filter((apartment) => {
      // Text search
      const matchesSearch =
        apartment.title.toLowerCase().includes((searchTerm || localSearchTerm).toLowerCase()) ||
        apartment.location.toLowerCase().includes((searchTerm || localSearchTerm).toLowerCase()) ||
        apartment.description.toLowerCase().includes((searchTerm || localSearchTerm).toLowerCase())

      // Type filter
      const matchesType = typeFilter === "all" || apartment.type === typeFilter

      // Availability filter
      const matchesAvailability =
        availabilityFilter === "all" ||
        (availabilityFilter === "available" && apartment.available) ||
        (availabilityFilter === "unavailable" && !apartment.available)

      // Price range filter
      let matchesPrice = true
      if (priceRange !== "all") {
        const price = apartment.price
        switch (priceRange) {
          case "0-50000":
            matchesPrice = price <= 50000
            break
          case "50000-100000":
            matchesPrice = price > 50000 && price <= 100000
            break
          case "100000-200000":
            matchesPrice = price > 100000 && price <= 200000
            break
          case "200000+":
            matchesPrice = price > 200000
            break
        }
      }

      return matchesSearch && matchesType && matchesAvailability && matchesPrice
    })
  }, [apartments, searchTerm, localSearchTerm, typeFilter, availabilityFilter, priceRange])

  const handleDeleteClick = (apartment: Apartment) => {
    setDeleteDialog({
      open: true,
      apartmentId: apartment.id,
      apartmentTitle: apartment.title,
    })
  }

  const handleDeleteConfirm = () => {
    onDeleteApartment(deleteDialog.apartmentId)
    setDeleteDialog({ open: false, apartmentId: "", apartmentTitle: "" })
  }

  const handleEditClick = (apartment: Apartment) => {
    setEditDialog({ open: true, apartment })
  }

  const handleViewImages = (apartment: Apartment, initialIndex = 0) => {
    setCarouselDialog({
      open: true,
      images: apartment.images || [],
      title: apartment.title,
      initialIndex,
    })
  }

  return (
    <>
      <Card className="border-orange-100 shadow-sm">
        <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-t-lg border-b border-orange-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle className="text-orange-800 flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-orange-600 flex items-center justify-center">
                  <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                </div>
                Gestion des Appartements
              </CardTitle>
              <CardDescription className="text-orange-600">
                Gérez vos appartements : modifier, supprimer, changer la disponibilité
              </CardDescription>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-white border-orange-200 text-orange-700">
                  {filteredApartments.length} appartement(s)
                </Badge>
                <Badge variant="outline" className="bg-green-50 border-green-200 text-green-700">
                  {filteredApartments.filter((apt) => apt.available).length} disponible(s)
                </Badge>
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-orange-800">
              <Filter className="h-4 w-4" />
              Filtres de recherche
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher..."
                  value={localSearchTerm}
                  onChange={(e) => setLocalSearchTerm(e.target.value)}
                  className="pl-10 bg-white border-orange-200 focus:border-orange-400"
                />
              </div>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="bg-white border-orange-200 focus:border-orange-400">
                  <SelectValue placeholder="Type de logement" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  <SelectItem value="apartment">Appartement</SelectItem>
                  <SelectItem value="house">Maison</SelectItem>
                  <SelectItem value="studio">Studio</SelectItem>
                  <SelectItem value="loft">Loft</SelectItem>
                </SelectContent>
              </Select>

              <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
                <SelectTrigger className="bg-white border-orange-200 focus:border-orange-400">
                  <SelectValue placeholder="Disponibilité" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes</SelectItem>
                  <SelectItem value="available">Disponible</SelectItem>
                  <SelectItem value="unavailable">Indisponible</SelectItem>
                </SelectContent>
              </Select>

              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger className="bg-white border-orange-200 focus:border-orange-400">
                  <SelectValue placeholder="Gamme de prix" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les prix</SelectItem>
                  <SelectItem value="0-50000">0 - 50 000 FCFA</SelectItem>
                  <SelectItem value="50000-100000">50 000 - 100 000 FCFA</SelectItem>
                  <SelectItem value="100000-200000">100 000 - 200 000 FCFA</SelectItem>
                  <SelectItem value="200000+">200 000+ FCFA</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center gap-2 text-muted-foreground">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-600"></div>
                Chargement des appartements...
              </div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-gradient-to-r from-orange-50 to-amber-50">
                    <TableRow className="border-orange-100">
                      <TableHead className="text-orange-800 font-semibold">Appartement</TableHead>
                      <TableHead className="text-orange-800 font-semibold hidden md:table-cell">Localisation</TableHead>
                      <TableHead className="text-orange-800 font-semibold">Prix</TableHead>
                      <TableHead className="text-orange-800 font-semibold hidden lg:table-cell">Détails</TableHead>
                      <TableHead className="text-orange-800 font-semibold">Statut</TableHead>
                      <TableHead className="text-right text-orange-800 font-semibold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredApartments.map((apartment) => (
                      <TableRow key={apartment.id} className="hover:bg-orange-50/30 transition-colors border-orange-50">
                        <TableCell className="py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className="relative h-16 w-16 md:h-20 md:w-20 flex-shrink-0 rounded-xl overflow-hidden border-2 border-orange-100 shadow-sm cursor-pointer hover:border-orange-300 transition-colors"
                              onClick={() => handleViewImages(apartment, 0)}
                            >
                              <img
                                src={apartment.images?.[0] || "/placeholder.svg?height=80&width=80&query=apartment"}
                                alt={apartment.title}
                                className="h-full w-full object-cover"
                              />
                              {apartment.images && apartment.images.length > 1 && (
                                <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded-full">
                                  +{apartment.images.length - 1}
                                </div>
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="font-semibold text-gray-900 truncate">{apartment.title}</div>
                              <div className="text-sm text-muted-foreground line-clamp-2 md:line-clamp-1">
                                {apartment.description}
                              </div>
                              <div className="md:hidden text-sm text-gray-600 mt-1">{apartment.location}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-600 hidden md:table-cell">
                          <div className="flex flex-col">
                            <span className="font-medium">{apartment.location}</span>
                            <span className="text-sm text-muted-foreground">
                              {apartment.bedrooms}ch • {apartment.bathrooms}sdb • {apartment.area}m²
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-bold text-orange-700 text-lg">
                            {apartment.price.toLocaleString()} FCFA
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {Math.round(apartment.price / apartment.area).toLocaleString()} FCFA/m²
                          </div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1 text-sm">
                              <span className="text-muted-foreground">Type:</span>
                              <Badge variant="outline" className="text-xs">
                                {apartment.type || "apartment"}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-1 text-sm">
                              <span className="text-muted-foreground">Likes:</span>
                              <span className="font-medium text-pink-600">{apartment.likes || 0}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={apartment.available ? "default" : "secondary"}
                            className={
                              apartment.available
                                ? "bg-green-100 text-green-800 hover:bg-green-100 border-green-200 shadow-sm"
                                : "bg-red-100 text-red-800 hover:bg-red-100 border-red-200 shadow-sm"
                            }
                          >
                            <div
                              className={`w-2 h-2 rounded-full mr-2 ${apartment.available ? "bg-green-500" : "bg-red-500"}`}
                            />
                            {apartment.available ? "Disponible" : "Indisponible"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 justify-end">
                            <Button
                              variant="outline"
                              size="sm"
                              className={`transition-all duration-200 shadow-sm hover:shadow-md ${
                                apartment.available
                                  ? "border-orange-200 text-orange-700 hover:bg-orange-50 hover:border-orange-300 bg-gradient-to-r from-orange-50 to-orange-100"
                                  : "border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300 bg-gradient-to-r from-green-50 to-green-100"
                              }`}
                              onClick={() => onToggleAvailability(apartment.id)}
                            >
                              {apartment.available ? (
                                <ToggleRight className="h-4 w-4 sm:mr-1" />
                              ) : (
                                <ToggleLeft className="h-4 w-4 sm:mr-1" />
                              )}
                              <span className="hidden sm:inline">{apartment.available ? "Désactiver" : "Activer"}</span>
                            </Button>

                            <Button
                              variant="outline"
                              size="sm"
                              className="border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300 hover:shadow-md transition-all duration-200 shadow-sm bg-gradient-to-r from-purple-50 to-purple-100"
                              onClick={() => handleEditClick(apartment)}
                            >
                              <Edit className="h-4 w-4 sm:mr-1" />
                              <span className="hidden sm:inline">Modifier</span>
                            </Button>

                            <Button
                              variant="outline"
                              size="sm"
                              className="border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300 hover:shadow-md transition-all duration-200 shadow-sm bg-gradient-to-r from-red-50 to-red-100"
                              onClick={() => handleDeleteClick(apartment)}
                            >
                              <Trash2 className="h-4 w-4 sm:mr-1" />
                              <span className="hidden sm:inline">Supprimer</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {filteredApartments.length === 0 && (
                <div className="text-center py-16">
                  <div className="mx-auto h-24 w-24 rounded-full bg-orange-50 flex items-center justify-center mb-4">
                    <svg className="h-12 w-12 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                  </div>
                  <p className="text-lg font-medium text-gray-900 mb-2">Aucun appartement trouvé</p>
                  <p className="text-muted-foreground">Essayez de modifier vos critères de recherche</p>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <ConfirmationDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}
        onConfirm={handleDeleteConfirm}
        title="Supprimer l'appartement"
        description={`Êtes-vous sûr de vouloir supprimer "${deleteDialog.apartmentTitle}" ? Cette action est irréversible.`}
        confirmText="Supprimer définitivement"
        cancelText="Annuler"
        variant="destructive"
      />

      <ApartmentFormDialog
        open={editDialog.open}
        onOpenChange={(open) => setEditDialog({ open, apartment: open ? editDialog.apartment : undefined })}
        apartment={editDialog.apartment}
        mode="edit"
      />

      <ImageCarousel
        images={carouselDialog.images}
        isOpen={carouselDialog.open}
        onClose={() => setCarouselDialog({ ...carouselDialog, open: false })}
        initialIndex={carouselDialog.initialIndex}
        title={carouselDialog.title}
      />
    </>
  )
}
