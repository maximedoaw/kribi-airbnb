import { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Booking } from '@/types';

interface BookingsTabProps {
  bookings: Booking[];
}

const BookingsTab: React.FC<BookingsTabProps> = ({ bookings }) => {
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const updateBookingStatus = async (bookingId: string, status: string) => {
    setUpdatingId(bookingId);
    try {
      const bookingRef = doc(db, 'bookings', bookingId);
      await updateDoc(bookingRef, { status });
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Mes réservations</h2>
      
      <div className="space-y-6">
        {bookings.map(booking => (
          <div key={booking.id} className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/4">
                {booking.apartment?.images && booking.apartment.images.length > 0 && (
                  <img 
                    src={booking.apartment.images[0]} 
                    alt={booking.apartment.title} 
                    className="w-full h-48 object-cover"
                  />
                )}
              </div>
              
              <div className="flex-1 p-4">
                <h3 className="text-lg font-medium text-gray-800">{booking.apartment?.title}</h3>
                <p className="text-gray-600 mb-2">{booking.apartment?.location}</p>
                <p className="text-gray-700 mb-2">
                  Du {new Date(booking.startDate).toLocaleDateString()} au {new Date(booking.endDate).toLocaleDateString()}
                </p>
                <p className="text-gray-700 font-medium mb-2">Prix: {booking.apartment?.price?.toLocaleString()} FCFA/nuit</p>
                
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(booking.status)}`}>
                  {booking.status === 'pending' && 'En attente'}
                  {booking.status === 'confirmed' && 'Confirmé'}
                  {booking.status === 'cancelled' && 'Annulé'}
                </span>
              </div>
              
              <div className="p-4 flex flex-col justify-center space-y-2">
                {booking.status === 'pending' && (
                  <>
                    <button 
                      onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                      disabled={updatingId === booking.id}
                      className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50"
                    >
                      {updatingId === booking.id ? 'Traitement...' : 'Confirmer'}
                    </button>
                    <button 
                      onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                      disabled={updatingId === booking.id}
                      className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50"
                    >
                      {updatingId === booking.id ? 'Traitement...' : 'Annuler'}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {bookings.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Aucune réservation trouvée</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingsTab;