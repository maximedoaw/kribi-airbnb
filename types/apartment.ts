export interface Apartment {
    id: string
    title: string
    description: string
    price: number
    location: string
    bedrooms: number
    bathrooms: number
    area: number
    images: string[]
    available: boolean
    likes: number
    likedBy: string[]
    createdAt: Date
    updatedAt: Date
    amenities?: string[]
    type?: "apartment" | "house" | "studio" | "loft"
    furnished?: boolean
    petFriendly?: boolean
    parking?: boolean
    favorites?: boolean
  }
  
  export interface ApartmentFormData {
    title: string
    description: string
    price: number
    location: string
    bedrooms: number
    bathrooms: number
    area: number
    available: boolean
    amenities: string[]
    type: "apartment" | "house" | "studio" | "loft"
    furnished: boolean
    petFriendly: boolean
    parking: boolean
  }
  