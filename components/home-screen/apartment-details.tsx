"use client";

import { useState, useEffect } from 'react';
import { doc, getDoc as getFirestoreDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import type { Apartment, Booking } from "@/types";
import {
  Heart, MapPin, Building, Home, BedDouble, Bath, Square, Star, ArrowLeft,
  Calendar, User, Shield, Wifi, Car, Coffee, Bell, CalendarDays
} from 'lucide-react';
import Link from 'next/link';
import { useApartments } from '@/hooks/use-apartments';
import { format, addDays, isAfter, isBefore, isWithinInterval } from 'date-fns';
import { cn } from '@/lib/utils';
import { ImageGallery } from '../image-gallery';
import { PaymentModal } from '../payment-modal';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface ApartmentDetailsProps {
  apartment: Apartment;
}

const ApartmentDetails: React.FC<ApartmentDetailsProps> = ({ apartment: initialApartment }) => {
  const [apartment, setApartment] = useState<Apartment>(initialApartment);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState<Date>(new Date());
  const [selectedEndDate, setSelectedEndDate] = useState<Date>(() => addDays(new Date(), 1));
  const [nights, setNights] = useState(1);
  const [user] = useAuthState(auth);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isApartmentOccupied, setIsApartmentOccupied] = useState(false);
  const [occupiedUntil, setOccupiedUntil] = useState<Date | null>(null);
  const [alertActive, setAlertActive] = useState(false);
  const { toggleFavorite, rateApartment } = useApartments();

  useEffect(() => {
    setApartment(initialApartment);
    checkApartmentAvailability();
  }, [initialApartment]);

  useEffect(() => {
    calculateNights();
    checkApartmentAvailability();
  }, [selectedStartDate, selectedEndDate]);

  // Vérifier la disponibilité de l'appartement
  const checkApartmentAvailability = async () => {
    try {
      setIsLoading(true);
      
      // Vérifier les réservations existantes pour cet appartement
      const bookingsRef = collection(db, 'bookings');
      const q = query(
        bookingsRef,
        where('apartmentId', '==', initialApartment.id),
        where('status', 'in', ['pending', 'confirmed'])
      );
      
      const querySnapshot = await getDocs(q);
      const currentDate = new Date();
      let isOccupied = false;
      let latestEndDate: Date | null = null;

      querySnapshot.forEach((doc) => {
        const booking = doc.data() as Booking;
        const startDate = booking.startDate instanceof Date ? booking.startDate : booking.startDate.toDate();
        const endDate = booking.endDate instanceof Date ? booking.endDate : booking.endDate.toDate();
        
        // Vérifier si l'appartement est actuellement occupé
        if (isWithinInterval(currentDate, { start: startDate, end: endDate })) {
          isOccupied = true;
          if (!latestEndDate || isAfter(endDate, latestEndDate)) {
            latestEndDate = endDate;
          }
        }
        
        // Vérifier si les dates sélectionnées chevauchent une réservation existante
        if (selectedStartDate && selectedEndDate) {
          const selectedInterval = { start: selectedStartDate, end: selectedEndDate };
          const bookingInterval = { start: startDate, end: endDate };
          
          if (
            isWithinInterval(selectedStartDate, bookingInterval) ||
            isWithinInterval(selectedEndDate, bookingInterval) ||
            (isBefore(selectedStartDate, startDate) && isAfter(selectedEndDate, endDate))
          ) {
            isOccupied = true;
            if (!latestEndDate || isAfter(endDate, latestEndDate)) {
              latestEndDate = endDate;
            }
          }
        }
      });

      setIsApartmentOccupied(isOccupied);
      setOccupiedUntil(latestEndDate);
    } catch (error) {
      console.error('Erreur lors de la vérification de la disponibilité:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateNights = () => {
    if (!selectedStartDate || !selectedEndDate) {
      setNights(0);
      return;
    }
    
    // S'assurer que la date de fin n'est pas avant la date de début
    if (isBefore(selectedEndDate, selectedStartDate)) {
      setSelectedEndDate(addDays(selectedStartDate, 1));
      return;
    }
    
    const diffTime = Math.abs(selectedEndDate.getTime() - selectedStartDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    setNights(diffDays);
  };

  const handleToggleFavorite = async () => {
    if (!user) return;
    
    await toggleFavorite(apartment.id, user.uid);
    
    const docRef = doc(db, "apartments", apartment.id);
    const docSnap = await getFirestoreDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      const updatedApartmentData = {
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as Apartment;
      setApartment(updatedApartmentData);
    }
  };

  const handlePaymentSuccess = () => {
    toast.success("Paiement réussi et réservation créée!");
    setAlertActive(false);
  };

  const handleRateApartment = async (rating: number) => {
    if (!user) return;
    
    await rateApartment(apartment.id, user.uid, rating);
    
    const docRef = doc(db, "apartments", apartment.id);
    const docSnap = await getFirestoreDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      const updatedApartmentData = {
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as Apartment;
      setApartment(updatedApartmentData);
    }
  };

  const handleAlertActivation = () => {
    setAlertActive(true);
    toast.success("Vous serez alerté lorsque cet appartement sera disponible !");
  };

  const isFavorite = apartment?.favorites?.includes(user?.uid || '') ?? false;
  const userRating = apartment?.ratings?.[user?.uid || ''] ?? 0;
  const Icon = apartment?.type === "house" ? Home : Building;

  const getAverageRating = () => {
    const ratings = apartment.ratings || {};
    const ratingValues = Object.values(ratings) as number[];
    if (ratingValues.length === 0) return 0;
    const sum = ratingValues.reduce((a, b) => a + b, 0);
    return (sum / ratingValues.length).toFixed(1);
  };
  
  const averageRating = getAverageRating();

  // Fonction pour formater la date
  const formatDate = (date: Date) => {
    return format(date, 'dd MMM yyyy');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/50">
      
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-cyan-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        
        {/* Back Button and Header */}
        <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <Link href="/" className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-800 transition-colors duration-300">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Retour au tableau de bord
          </Link>
          <div className="flex items-center text-gray-500 text-sm">
            <Calendar className="w-4 h-4 mr-2" />
            Publié le {format(apartment.createdAt, 'dd MMMM yyyy')}
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-6 lg:p-8">
          
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            
            {/* Gallery Section */}
            <div className="lg:col-span-1">
              <div className="rounded-2xl overflow-hidden shadow-lg">
                <ImageGallery 
                  images={apartment.images} 
                  className="h-auto max-h-[500px]"
                />
              </div>
              
              {/* Mini stats under gallery */}
              <div className="grid grid-cols-3 gap-4 mt-6 p-4 bg-blue-50/50 rounded-xl">
                <div className="text-center">
                  <BedDouble className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <div className="text-lg font-bold text-gray-900">{apartment.bedrooms}</div>
                  <div className="text-sm text-gray-600">Chambres</div>
                </div>
                <div className="text-center">
                  <Bath className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <div className="text-lg font-bold text-gray-900">{apartment.bathrooms}</div>
                  <div className="text-sm text-gray-600">Salles de bain</div>
                </div>
                <div className="text-center">
                  <Square className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <div className="text-lg font-bold text-gray-900">{apartment.area}m²</div>
                  <div className="text-sm text-gray-600">Surface</div>
                </div>
              </div>
            </div>

            {/* Details Section */}
            <div className="lg:col-span-1 space-y-6">
              
              {/* Header avec titre et actions */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <Icon className="w-5 h-5 text-cyan-500" />
                    <span className="text-sm font-semibold uppercase">{apartment.type}</span>
                  </div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
                    {apartment.title}
                  </h1>
                  <div className="flex items-center text-gray-500 mt-2">
                    <MapPin className="w-4 h-4 mr-2 text-blue-500" />
                    <span className="font-medium">{apartment.location}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  {/* Rating */}
                  <div className="flex items-center bg-white px-3 py-1 rounded-full border border-gray-200 shadow-sm">
                    <Star className="w-4 h-4 text-amber-500 fill-current mr-1" />
                    <span className="font-bold text-sm">{averageRating}</span>
                  </div>
                  {/* Favorite */}
                  <button 
                    onClick={handleToggleFavorite}
                    className="p-2 rounded-full border border-gray-200 hover:bg-rose-50 transition-colors duration-300"
                  >
                    <Heart className={`w-5 h-5 transition-all duration-300 ${
                      isFavorite ? 'text-rose-500 fill-rose-500' : 'text-gray-400'
                    }`} />
                  </button>
                </div>
              </div>

              {/* Indicateur de disponibilité */}
              {isApartmentOccupied && occupiedUntil && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <div className="flex items-center text-amber-800">
                    <Shield className="w-5 h-5 mr-2" />
                    <span className="font-semibold">Appartement occupé</span>
                  </div>
                  <p className="text-amber-700 text-sm mt-1">
                    Disponible à partir du {formatDate(occupiedUntil)}
                  </p>
                </div>
              )}

              {/* Sélection des dates avec Calendar shadcn/ui */}
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Sélectionnez vos dates</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Arrivée</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !selectedStartDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarDays className="mr-2 h-4 w-4" />
                          {selectedStartDate ? format(selectedStartDate, "PPP") : "Sélectionnez une date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <CalendarComponent
                          mode="single"
                          selected={selectedStartDate}
                          onSelect={(date) => date && setSelectedStartDate(date)}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Départ</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !selectedEndDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarDays className="mr-2 h-4 w-4" />
                          {selectedEndDate ? format(selectedEndDate, "PPP") : "Sélectionnez une date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <CalendarComponent
                          mode="single"
                          selected={selectedEndDate}
                          onSelect={(date) => date && setSelectedEndDate(date)}
                          disabled={(date) => date <= selectedStartDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                
                <div className="mt-3 text-sm text-gray-600">
                  {nights} nuit(s) - du {formatDate(selectedStartDate)} au {formatDate(selectedEndDate)}
                </div>
              </div>

              {/* Price Highlight */}
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-xl border border-blue-100">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <div className="text-2xl lg:text-3xl font-black text-blue-900">
                      {(apartment.price * nights).toLocaleString()} FCFA
                    </div>
                    <div className="text-sm text-blue-600 font-medium">
                      {nights} nuit(s) × {apartment.price.toLocaleString()} FCFA
                    </div>
                  </div>
                </div>
                
                {isApartmentOccupied ? (
                  <div className="space-y-3">
                    <Button
                      className="w-full py-3 bg-gray-400 text-white font-bold rounded-lg cursor-not-allowed"
                      disabled
                    >
                      Indisponible pour ces dates
                    </Button>
                    <Button
                      onClick={handleAlertActivation}
                      className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg transition-all duration-300"
                      disabled={alertActive}
                    >
                      <Bell className="w-4 h-4 mr-2" />
                      {alertActive ? 'Alerte activée' : 'Être alerté de la disponibilité'}
                    </Button>
                  </div>
                ) : (
                  <Button
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                    onClick={() => setIsPaymentModalOpen(true)}
                    disabled={nights === 0}
                  >
                    Réserver maintenant
                  </Button>
                )}
              </div>

              {/* Description */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Description</h2>
                <p className="text-gray-600 leading-relaxed">{apartment.description}</p>
              </div>
              
              {/* Équipements */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Équipements</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Wifi className="w-5 h-5 text-blue-600" />
                    <span className="text-gray-700">Wi-Fi</span>
                  </div>
                  {apartment.parking && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Car className="w-5 h-5 text-blue-600" />
                      <span className="text-gray-700">Parking</span>
                    </div>
                  )}
                  {apartment.kitchen && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Coffee className="w-5 h-5 text-blue-600" />
                      <span className="text-gray-700">Cuisine équipée</span>
                    </div>
                  )}
                </div>
              </div>

              {/* User Rating Section */}
              <div className="pt-6 border-t border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Donnez votre avis</h3>
                <div className="flex items-center gap-3" onMouseLeave={() => setHoveredRating(0)}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button 
                      key={star} 
                      onClick={() => handleRateApartment(star)} 
                      onMouseEnter={() => setHoveredRating(star)} 
                      className="p-1 transition-transform hover:scale-110"
                    >
                      <Star 
                        className={cn("w-7 h-7 transition-all duration-200", 
                          (star <= hoveredRating || star <= userRating) 
                            ? "text-amber-500 fill-amber-500" 
                            : "text-gray-300"
                        )}
                      />
                    </button>
                  ))}
                  <span className="text-sm text-gray-600 ml-2">
                    ({Object.keys(apartment.ratings || {}).length} avis)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Payment Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        amount={apartment.price * nights}
        onPaymentSuccess={handlePaymentSuccess}
        apartment={apartment}
        startDate={selectedStartDate}
        endDate={selectedEndDate}
        nights={nights}
      />
    </div>
  );
};

export default ApartmentDetails;