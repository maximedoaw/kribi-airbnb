export interface Apartment {
    id: string;
    title: string;
    description: string;
    price: number;
    location: string;
    images: string[];
    available: boolean;
    rating: number;
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