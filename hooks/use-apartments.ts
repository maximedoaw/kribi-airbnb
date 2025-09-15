"use client"

import type { Apartment, ApartmentFormData } from "@/types"
import { useState, useEffect } from "react"
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  getDoc,
} from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage"
import { db, storage } from "@/lib/firebase"

interface UploadProgress {
  file: File
  progress: number
}

export function useApartments() {
  const [apartments, setApartments] = useState<Apartment[]>([])
  const [loading, setLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [currentUploads, setCurrentUploads] = useState<UploadProgress[]>([])

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "apartments"), (snapshot) => {
      const apartmentsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as Apartment[]

      apartmentsData.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      setApartments(apartmentsData)
    })

    return unsubscribe
  }, [])

  const uploadImages = async (imageFiles: File[]): Promise<string[]> => {
    const uploadPromises = imageFiles.map(async (file, index) => {
      const storageRef = ref(storage, `apartments/${Date.now()}_${index}_${file.name}`)

      setCurrentUploads((prev) => prev.map((upload, i) => (i === index ? { ...upload, progress: 0 } : upload)))

      for (let progress = 0; progress <= 100; progress += 20) {
        await new Promise((resolve) => setTimeout(resolve, 100))
        setCurrentUploads((prev) => prev.map((upload, i) => (i === index ? { ...upload, progress } : upload)))
      }

      const snapshot = await uploadBytes(storageRef, file)
      return await getDownloadURL(snapshot.ref)
    })

    return Promise.all(uploadPromises)
  }

  const addApartment = async (apartmentData: ApartmentFormData, imageFiles: File[]) => {
    setLoading(true)
    setIsUploading(true)

    try {
      setCurrentUploads(imageFiles.map((file) => ({ file, progress: 0 })))

      const imageUrls = await uploadImages(imageFiles)

      const apartmentToSave = {
        ...apartmentData,
        price: typeof apartmentData.price === "string" ? Number.parseFloat(apartmentData.price) : apartmentData.price,
        images: imageUrls,
        favorites: [],
        ratings: {}, // New field for ratings
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }

      await addDoc(collection(db, "apartments"), apartmentToSave)
    } finally {
      setLoading(false)
      setIsUploading(false)
      setCurrentUploads([])
    }
  }

  const updateApartment = async (
    id: string,
    updates: Partial<ApartmentFormData>,
    newImageFiles?: File[],
    imagesToDelete?: string[],
  ) => {
    setLoading(true)
    try {
      let newImages: string[] = []

      if (newImageFiles && newImageFiles.length > 0) {
        setIsUploading(true)
        setCurrentUploads(newImageFiles.map((file) => ({ file, progress: 0 })))
        newImages = await uploadImages(newImageFiles)
        setIsUploading(false)
        setCurrentUploads([])
      }

      if (imagesToDelete && imagesToDelete.length > 0) {
        const deletePromises = imagesToDelete.map(async (imageUrl) => {
          try {
            const imageRef = ref(storage, imageUrl)
            await deleteObject(imageRef)
          } catch (error) {
            console.warn("Error deleting image:", error)
          }
        })
        await Promise.all(deletePromises)
      }

      const currentApartment = apartments.find((apt) => apt.id === id)
      let updatedImages = currentApartment?.images || []

      // Remove deleted images
      if (imagesToDelete && imagesToDelete.length > 0) {
        updatedImages = updatedImages.filter((img) => !imagesToDelete.includes(img))
      }

      // Add new images
      if (newImages.length > 0) {
        updatedImages = [...updatedImages, ...newImages]
      }

      const updateData = {
        ...updates,
        price: typeof updates.price === "string" ? Number.parseFloat(updates.price) : updates.price,
        images: updatedImages,
        updatedAt: serverTimestamp(),
      }

      await updateDoc(doc(db, "apartments", id), updateData)
    } finally {
      setLoading(false)
    }
  }

  const deleteApartment = async (id: string) => {
    setLoading(true)
    try {
      const apartment = apartments.find((apt) => apt.id === id)
      if (apartment?.images) {
        const deletePromises = apartment.images.map(async (imageUrl) => {
          try {
            const imageRef = ref(storage, imageUrl)
            await deleteObject(imageRef)
          } catch (error) {
            console.warn("Error deleting image:", error)
          }
        })
        await Promise.all(deletePromises)
      }

      await deleteDoc(doc(db, "apartments", id))
    } finally {
      setLoading(false)
    }
  }

  const toggleAvailability = async (id: string) => {
    try {
      const apartment = apartments.find((apt) => apt.id === id)
      if (apartment) {
        await updateDoc(doc(db, "apartments", id), {
          available: !apartment.available,
          updatedAt: serverTimestamp(),
        })
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error)
    }
  }

  const toggleFavorite = async (apartmentId: string, userId: string) => {
    try {
      const apartmentRef = doc(db, "apartments", apartmentId)
      const apartmentSnap = await getDoc(apartmentRef)

      if (apartmentSnap.exists()) {
        const apartmentData = apartmentSnap.data() as Apartment
        const isFavorite = apartmentData.favorites?.includes(userId)

        let updatedFavorites: string[] = []

        if (isFavorite) {
          updatedFavorites = apartmentData.favorites.filter((uid) => uid !== userId)
        } else {
          updatedFavorites = [...(apartmentData.favorites || []), userId]
        }

        await updateDoc(apartmentRef, {
          favorites: updatedFavorites,
          updatedAt: serverTimestamp(),
        })
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour des favoris:", error)
    }
  }

  const rateApartment = async (apartmentId: string, userId: string, rating: number) => {
    try {
      if (rating < 1 || rating > 5) {
        console.error("La note doit être entre 1 et 5")
        return
      }

      const apartmentRef = doc(db, "apartments", apartmentId)
      const apartmentSnap = await getDoc(apartmentRef)

      if (apartmentSnap.exists()) {
        const apartmentData = apartmentSnap.data() as Apartment
        const updatedRatings = {
          ...(apartmentData.ratings || {}),
          [userId]: rating,
        }

        await updateDoc(apartmentRef, {
          ratings: updatedRatings,
          updatedAt: serverTimestamp(),
        })
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la note:", error)
    }
  }

  return {
    apartments,
    loading,
    addApartment,
    updateApartment,
    deleteApartment,
    toggleAvailability,
    isUploading,
    currentUploads,
    toggleFavorite,
    rateApartment,
  }
}