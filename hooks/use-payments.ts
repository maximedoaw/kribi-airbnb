import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Payment } from '@/types';

export const usePayments = (userId?: string) => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const paymentsQuery = query(
      collection(db, 'payments'),
      where('userId', '==', userId)
    );
    
    const unsubscribe = onSnapshot(paymentsQuery, (snapshot) => {
      const paymentsData: Payment[] = [];
      snapshot.forEach((doc) => {
        paymentsData.push({ id: doc.id, ...doc.data() } as Payment);
      });
      setPayments(paymentsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  return { payments, loading };
};