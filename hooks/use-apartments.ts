import { useState, useEffect } from 'react';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Apartment } from '@/types';

export const useApartments = () => {
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apartmentsQuery = query(collection(db, 'apartments'));
    const unsubscribe = onSnapshot(apartmentsQuery, (snapshot) => {
      const apartmentsData: Apartment[] = [];
      snapshot.forEach((doc) => {
        apartmentsData.push({ id: doc.id, ...doc.data() } as Apartment);
      });
      setApartments(apartmentsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { apartments, loading };
};