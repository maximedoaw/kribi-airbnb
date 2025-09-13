"use client";

import { useState, useEffect } from 'react';
import { doc, getDoc as getFirestoreDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import type { Apartment } from "@/types/apartment";
import {
  Heart, MapPin, Building, Home, BedDouble, Bath, Square, Star, ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import { useApartments } from '@/hooks/use-apartments';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { ImageGallery } from '../admin-view/image-gallery';

interface ApartmentDetailsProps {
  apartment: Apartment;
}

const ApartmentDetails: React.FC<ApartmentDetailsProps> = ({ apartment: initialApartment }) => {
  const [apartment, setApartment] = useState<Apartment>(initialApartment);
  const [user] = useAuthState(auth);
  const [hoveredRating, setHoveredRating] = useState(0);
  const { toggleFavorite, rateApartment } = useApartments();

  useEffect(() => {
    setApartment(initialApartment);
  }, [initialApartment]);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/50 relative overflow-hidden">
      
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-cyan-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-amber-400/5 to-orange-400/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16 relative z-10">
        
        {/* Back Button and Header */}
        <div className="mb-8 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-800 transition-colors duration-300">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Retour au tableau de bord
          </Link>
          <div className="flex items-center text-gray-500">
            <span className="text-sm font-medium mr-2">Publié le:</span>
            <span className="text-sm font-semibold">{format(apartment.createdAt, 'dd MMMM yyyy')}</span>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl p-4 sm:p-6 lg:p-10 animate-on-scroll">
          
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
            
            {/* Gallery Section */}
            <div className="lg:col-span-1 relative overflow-hidden rounded-2xl shadow-xl">
              <ImageGallery images={apartment.images} className="rounded-2xl h-[400px] md:h-[500px] lg:h-[600px]" />
            </div>

            {/* Details Section */}
            <div className="lg:col-span-1">
              
              {/* Title, Rating & Location */}
              <div className="mb-6 border-b border-gray-200 pb-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2">
                  <div>
                    <div className="flex items-center space-x-2 text-gray-600 mb-1">
                      <Icon className="w-5 h-5 text-cyan-500" />
                      <span className="text-sm font-semibold uppercase">{apartment.type}</span>
                    </div>
                    <h1 className="text-3xl lg:text-4xl font-black text-gray-900">{apartment.title}</h1>
                  </div>
                  
                  {/* Average Rating & Favorites on top */}
                  <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                    {/* Average Rating */}
                    <div className="flex items-center space-x-1 bg-white/20 backdrop-blur-lg px-2.5 py-1 rounded-full border border-white/30 text-gray-700">
                      <Star className="w-4 h-4 text-amber-500 fill-current" />
                      <span className="font-bold text-sm">{averageRating}</span>
                      <span className="text-xs text-gray-500">/ 5</span>
                    </div>
                    {/* Favorites Button */}
                    <button onClick={handleToggleFavorite} className="flex items-center p-2 rounded-full border border-gray-200 hover:bg-gray-100 transition-colors duration-300">
                      <Heart className={`w-6 h-6 transition-all duration-300 ${isFavorite ? 'text-rose-500 fill-rose-500' : 'text-gray-400'}`} />
                    </button>
                  </div>
                </div>

                <div className="flex items-center text-gray-500">
                  <MapPin className="w-4 h-4 mr-2 text-blue-500" />
                  <span className="font-medium text-lg">{apartment.location}</span>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-2">À propos de ce bien</h2>
                <p className="text-gray-600 text-base leading-relaxed">{apartment.description}</p>
              </div>
              
              {/* Stats Section */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Caractéristiques</h3>
                <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-gray-700">
                  <div className="flex items-center space-x-2"><BedDouble className="w-5 h-5 text-blue-500" /><span>{apartment.bedrooms} Chambres</span></div>
                  <div className="flex items-center space-x-2"><Bath className="w-5 h-5 text-blue-500" /><span>{apartment.bathrooms} Salles de bain</span></div>
                  <div className="flex items-center space-x-2"><Square className="w-5 h-5 text-blue-500" /><span>{apartment.area} m²</span></div>
                </div>
              </div>

              {/* User Rating Section */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Laissez votre note</h3>
                <div className="flex items-center space-x-2" onMouseLeave={() => setHoveredRating(0)}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button 
                      key={star} 
                      onClick={() => handleRateApartment(star)} 
                      onMouseEnter={() => setHoveredRating(star)} 
                      className="p-1 transition-transform transform hover:scale-110"
                    >
                      <Star 
                        className={cn("w-6 h-6 transition-all duration-300", 
                          (star <= hoveredRating || star <= userRating) ? "text-amber-500 fill-amber-500" : "text-gray-300"
                        )}
                      />
                    </button>
                  ))}
                  <span className="text-sm text-gray-700 font-bold ml-2">
                    ({Object.keys(apartment.ratings || {}).length} votes)
                  </span>
                </div>
              </div>
              
              {/* Price and Action */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                  <div>
                    <span className="text-2xl lg:text-3xl font-black text-gray-900">{apartment.price.toLocaleString()}</span>
                    <span className="text-sm lg:text-base text-gray-500 font-medium ml-2">FCFA / nuit</span>
                  </div>
                  <button 
                    className="mt-4 sm:mt-0 px-8 py-3 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    Réserver maintenant
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApartmentDetails;