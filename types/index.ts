// types.ts
export interface Apartment {
    id: string;
    title: string;
    description: string;
    price: number; 
    location: string;
    images: string[]; // Changé de image? à images[]
    available: boolean;
    rating: number;
    likes: number;
    likedBy: string[];
    createdAt: Date;
    updatedAt: Date;
}
  
export interface Booking {
    id: string;
    apartmentId: string;
    userId: string;
    startDate: string;
    endDate: string;
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