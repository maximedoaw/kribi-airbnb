import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Booking, Apartment } from '@/types';

export const useBookings = (userId?: string) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const bookingsQuery = query(
      collection(db, 'bookings'),
      where('userId', '==', userId)
    );
    
    const unsubscribe = onSnapshot(bookingsQuery, async (snapshot) => {
      const bookingsData: Booking[] = [];
      for (const docSnapshot of snapshot.docs) {
        const booking = { id: docSnapshot.id, ...docSnapshot.data() } as Booking;
        
        // Récupérer les détails de l'appartement
        const apartmentDocRef = doc(db, 'apartments', booking.apartmentId);
        onSnapshot(apartmentDocRef, (apartmentSnapshot : any) => {
          if (apartmentSnapshot.exists()) {
            booking.apartment = { 
              id: apartmentSnapshot.id, 
              ...apartmentSnapshot.data() 
            } as Apartment;
            
            setBookings(prev => {
              const existing = prev.find(b => b.id === booking.id);
              if (existing) {
                return prev.map(b => 
                  b.id === booking.id ? { ...b, apartment: booking.apartment } : b
                );
              } else {
                return [...prev, booking];
              }
            });
          }
        });
        
        bookingsData.push(booking);
      }
      setBookings(bookingsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  return { bookings, loading };
};