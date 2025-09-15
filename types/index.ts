import { Timestamp } from "firebase/firestore"

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
    ratings?: Record<string, number> 
    kitchen?: boolean 
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

export interface Booking {
    id: string;
    username? : string;
    apartmentId: string;
    userId: string;
    createdAt: Date | Timestamp;
    updatedAt: Date | Timestamp;
    startDate: Date | Timestamp;
    endDate: Date | Timestamp; // Changé de string à Date | Timestamp
    totalPrice: number;
    nights: number;
    status: 'pending' | 'confirmed' | 'cancelled';
    apartment?: Apartment;
}

export interface Payment {
    id: string;
    userId: string;
    amount: number;
    date: string;
    status: 'completed' | 'pending' | 'failed';
    bookingId: string;
}

export interface UserData {
    uid: string;
    displayName: string | null;
    email: string | null;
    role: string;
    createdAt: any;
    photoURL?: string | null;
    phoneNumber?: string | null;
}