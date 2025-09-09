// hooks/useGetCurrentUser.ts
import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface UserData {
  uid: string;
  displayName: string | null;
  email: string | null;
  role: string;
  createdAt: any;
  photoURL?: string | null;
  phoneNumber?: string | null;
}

export const useGetCurrentUser = (currentUser: User | null | undefined) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Gestion explicite du cas undefined
    if (currentUser === undefined) {
      setLoading(true);
      return;
    }

    if (!currentUser) {
      setUserData(null);
      setLoading(false);
      // Nettoyer le cache quand l'utilisateur se déconnecte
      localStorage.removeItem('currentUserData');
      return;
    }

    // Vérifier d'abord le cache local
    const cachedUserData = localStorage.getItem('currentUserData');
    if (cachedUserData) {
      try {
        const parsedData = JSON.parse(cachedUserData);
        // Vérifier que les données en cache correspondent à l'utilisateur actuel
        if (parsedData.uid === currentUser.uid) {
          setUserData(parsedData);
          setLoading(false);
          
          // Rafraîchir les données en arrière-plan sans bloquer l'UI
          fetchFreshData(currentUser);
          return;
        }
      } catch (e) {
        console.error('Erreur lors du parsing des données en cache:', e);
        // Continuer avec une requête réseau si le cache est corrompu
      }
    }

    fetchFreshData(currentUser);
  }, [currentUser]);

  const fetchFreshData = async (user: User) => {
    try {
      setLoading(true);
      setError(null);
      
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      
      let userData: UserData;

      if (userDoc.exists()) {
        const data = userDoc.data();
        userData = {
          uid: user.uid,
          displayName: data.displayName || user.displayName || "Utilisateur",
          email: data.email || user.email,
          role: data.role || 'user',
          createdAt: data.createdAt,
          photoURL: data.photoURL || user.photoURL,
          phoneNumber: data.phoneNumber || user.phoneNumber
        };
      } else {
        // Si le document n'existe pas, utiliser les données de base
        userData = {
          uid: user.uid,
          displayName: user.displayName || "Utilisateur",
          email: user.email,
          role: 'user',
          createdAt: null,
          photoURL: user.photoURL,
          phoneNumber: user.phoneNumber
        };
      }

      setUserData(userData);
      
      // Mettre en cache avec une date d'expiration (1 heure)
      const cacheData = {
        ...userData,
        _cachedAt: Date.now()
      };
      localStorage.setItem('currentUserData', JSON.stringify(cacheData));
      
    } catch (err) {
      console.error('Erreur lors de la récupération des données utilisateur:', err);
      setError('Impossible de charger les données utilisateur');
    } finally {
      setLoading(false);
    }
  };

  return { userData, loading, error };
};

