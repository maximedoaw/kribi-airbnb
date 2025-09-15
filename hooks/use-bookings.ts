import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  Timestamp,
  getDoc
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Booking, Apartment } from '@/types';
import { useAuthState } from 'react-firebase-hooks/auth';
import { nanoid } from "nanoid";
import { auth } from '@/lib/firebase';

export const useBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user] = useAuthState(auth);

  useEffect(() => {
    if (!user) {
      setBookings([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const bookingsQuery = query(
        collection(db, 'bookings'),
        where('userId', '==', user.uid)
      );
      
      const unsubscribe = onSnapshot(
        bookingsQuery,
        async (snapshot) => {
          try {
            const bookingsData: Booking[] = [];
            
            for (const docSnapshot of snapshot.docs) {
              const bookingData = docSnapshot.data();
              
              // Conversion des timestamps Firestore en Dates
              const startDate = bookingData.startDate instanceof Timestamp 
                ? bookingData.startDate.toDate() 
                : bookingData.startDate;
              
              const endDate = bookingData.endDate instanceof Timestamp 
                ? bookingData.endDate.toDate() 
                : bookingData.endDate;
              
              const createdAt = bookingData.createdAt instanceof Timestamp 
                ? bookingData.createdAt.toDate() 
                : bookingData.createdAt;
              
              const updatedAt = bookingData.updatedAt instanceof Timestamp 
                ? bookingData.updatedAt.toDate() 
                : bookingData.updatedAt;

              const booking: Booking = {
                id: docSnapshot.id,
                apartmentId: bookingData.apartmentId,
                userId: bookingData.userId,
                startDate,
                endDate,
                status: bookingData.status,
                createdAt,
                updatedAt,
                totalPrice: bookingData.totalPrice,
                nights: bookingData.nights
              };
              
              // Récupérer les détails de l'appartement
              if (bookingData.apartmentId) {
                try {
                  const apartmentDoc = await getDoc(doc(db, 'apartments', bookingData.apartmentId));
                  if (apartmentDoc.exists()) {
                    const apartmentData = apartmentDoc.data();
                    booking.apartment = {
                      id: apartmentDoc.id,
                      title: apartmentData.title,
                      description: apartmentData.description,
                      price: apartmentData.price,
                      location: apartmentData.location,
                      bedrooms: apartmentData.bedrooms,
                      bathrooms: apartmentData.bathrooms,
                      area: apartmentData.area,
                      images: apartmentData.images,
                      available: apartmentData.available,
                      likes: apartmentData.likes || 0,
                      likedBy: apartmentData.likedBy || [],
                      createdAt: apartmentData.createdAt?.toDate(),
                      updatedAt: apartmentData.updatedAt?.toDate(),
                      amenities: apartmentData.amenities || [],
                      type: apartmentData.type || "apartment",
                      furnished: apartmentData.furnished || false,
                      petFriendly: apartmentData.petFriendly || false,
                      parking: apartmentData.parking || false
                    };
                  }
                } catch (apartmentError) {
                  console.error("Erreur lors de la récupération de l'appartement:", apartmentError);
                }
              }
              
              bookingsData.push(booking);
            }
            
            // Trier par date de création (descendant) côté client
            bookingsData.sort((a, b) => {
              const dateA = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt as any);
              const dateB = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt as any);
              return dateB.getTime() - dateA.getTime();
            });
            
            setBookings(bookingsData);
            setLoading(false);
          } catch (err) {
            console.error("Erreur lors du traitement des réservations:", err);
            setError("Erreur lors du chargement des réservations");
            setLoading(false);
          }
        },
        (err) => {
          console.error("Erreur de l'écouteur Firestore:", err);
          setError("Erreur de connexion aux données");
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.error("Erreur lors de la configuration de la requête:", err);
      setError("Erreur de configuration");
      setLoading(false);
    }
  }, [user]);

  // Créer une nouvelle réservation
  const createBooking = async (bookingData: Omit<Booking, 'id' | 'createdAt' | 'updatedAt' | 'apartment'>): Promise<string> => {
    try {
      if (!user) throw new Error("Utilisateur non connecté");
      
      const docRef = await addDoc(collection(db, 'bookings'), {
        apartmentId: bookingData.apartmentId,
        username:user.displayName || "Utilisateurs",
        userId: user.uid,
        startDate: Timestamp.fromDate(new Date(bookingData.startDate as Date)),
        endDate: Timestamp.fromDate(new Date(bookingData.endDate as Date)),
        status: bookingData.status,
        totalPrice: bookingData.totalPrice,
        nights: bookingData.nights,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      
      return docRef.id;
    } catch (err) {
      console.error("Erreur lors de la création de la réservation:", err);
      throw new Error("Impossible de créer la réservation");
    }
  };

  // Confirmer une réservation
  const confirmBooking = async (bookingId: string): Promise<void> => {
    try {
      const bookingRef = doc(db, 'bookings', bookingId);
      await updateDoc(bookingRef, {
        status: 'confirmed',
        updatedAt: Timestamp.now()
      });
    } catch (err) {
      console.error("Erreur lors de la confirmation de la réservation:", err);
      throw new Error("Impossible de confirmer la réservation");
    }
  };

  // Annuler une réservation (avec vérification du délai de 48h)
  const cancelBooking = async (bookingId: string): Promise<boolean> => {
    try {
      const booking = bookings.find(b => b.id === bookingId);
      if (!booking) throw new Error("Réservation non trouvée");
      
      // Conversion du timestamp Firestore en Date
      let bookingDate: Date;
      
      if (booking.createdAt instanceof Date) {
        bookingDate = booking.createdAt;
      } else if (booking.createdAt && typeof booking.createdAt === 'object') {
        // Gestion des timestamps Firestore
        const timestamp = booking.createdAt as any;
        
        if (timestamp.toDate) {
          bookingDate = timestamp.toDate();
        } else if (timestamp.seconds) {
          bookingDate = new Date(timestamp.seconds * 1000);
        } else {
          throw new Error("Format de date invalide");
        }
      } else if (typeof booking.createdAt === 'string') {
        bookingDate = new Date(booking.createdAt);
      } else {
        throw new Error("Format de date non supporté");
      }
      
      // Vérification que la date est valide
      if (isNaN(bookingDate.getTime())) {
        throw new Error("Date de réservation invalide");
      }
      
      // Vérifier si l'annulation est dans les 48h
      const now = new Date();
      const timeDiff = now.getTime() - bookingDate.getTime();
      const hoursDiff = timeDiff / (1000 * 3600);
      
      if (hoursDiff > 48) {
        throw new Error("Impossible d'annuler après 48 heures");
      }
      
      const bookingRef = doc(db, 'bookings', bookingId);
      await updateDoc(bookingRef, {
        status: 'cancelled',
        updatedAt: Timestamp.now()
      });
      
      return true;
    } catch (err) {
      console.error("Erreur lors de l'annulation de la réservation:", err);
      throw err;
    }
  };

  // Mettre à jour une réservation
  const updateBooking = async (bookingId: string, updates: Partial<Booking>): Promise<void> => {
    try {
      const bookingRef = doc(db, 'bookings', bookingId);
      await updateDoc(bookingRef, {
        ...updates,
        updatedAt: Timestamp.now()
      });
    } catch (err) {
      console.error("Erreur lors de la mise à jour de la réservation:", err);
      throw new Error("Impossible de mettre à jour la réservation");
    }
  };

  // Supprimer une réservation
  const deleteBooking = async (bookingId: string): Promise<void> => {
    try {
      const bookingRef = doc(db, 'bookings', bookingId);
      await deleteDoc(bookingRef);
    } catch (err) {
      console.error("Erreur lors de la suppression de la réservation:", err);
      throw new Error("Impossible de supprimer la réservation");
    }
  };

  const canCancelBooking = (bookingId: string): boolean => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking || !booking.createdAt) return false;
    
    let bookingDate: Date;
    
    if (booking.createdAt instanceof Date) {
      bookingDate = booking.createdAt;
    } else if (booking.createdAt instanceof Timestamp) {
      bookingDate = booking.createdAt.toDate();
    } else {
      return false;
    }
    
    const now = new Date();
    const hoursDiff = (now.getTime() - bookingDate.getTime()) / (1000 * 3600);
    
    return hoursDiff <= 48;
  };


  return {
    bookings,
    loading,
    error,
    createBooking,
    confirmBooking,
    cancelBooking,
    updateBooking,
    deleteBooking,
    canCancelBooking
  };
};