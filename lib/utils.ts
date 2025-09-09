import { clsx, type ClassValue } from "clsx"
import { Timestamp } from "firebase/firestore";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatFirestoreDate = (timestamp: any): string => {
  if (!timestamp) return 'Date inconnue';
  
  try {
    let date: Date;
    
    // Si c'est un objet Timestamp Firestore
    if (timestamp instanceof Timestamp) {
      date = timestamp.toDate();
    } 
    // Si c'est un objet avec seconds et nanoseconds
    else if (timestamp.seconds !== undefined && timestamp.nanoseconds !== undefined) {
      date = new Timestamp(timestamp.seconds, timestamp.nanoseconds).toDate();
    }
    // Si c'est déjà un objet Date
    else if (timestamp instanceof Date) {
      date = timestamp;
    }
    // Si c'est un string ou number
    else {
      date = new Date(timestamp);
    }
    
    // Vérifier que la date est valide
    if (isNaN(date.getTime())) {
      return 'Date invalide';
    }
    
    // Formater en mois et année en français
    const months = [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];
    
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    
    return `${month} ${year}`;
    
  } catch (error) {
    console.error('Erreur de formatage de date:', error);
    return 'Date invalide';
  }
};

/**
 * Vérifie si une valeur est un timestamp Firestore
 */
export const isFirestoreTimestamp = (value: any): boolean => {
  return (
    value instanceof Timestamp ||
    (typeof value === 'object' && 
     value !== null && 
     'seconds' in value && 
     'nanoseconds' in value)
  );
};