import { Apartment } from "@/types";
import { ArrowRight, Heart, MapPin, Star } from "lucide-react";
import Link from 'next/link';
import React from "react";

interface ApartmentCardProps {
  apartment: Apartment;
  index: number;
}

const ApartmentCard: React.FC<ApartmentCardProps> = ({ apartment, index }) => {
  const getAverageRating = () => {
    const ratings = apartment.ratings || {};
    const ratingValues = Object.values(ratings) as number[];
    if (ratingValues.length === 0) return 0;
    const sum = ratingValues.reduce((a, b) => a + b, 0);
    return (sum / ratingValues.length).toFixed(1);
  };

  const averageRating = getAverageRating();
  
  return (
    <Link 
      href={`/about/${apartment.id}`}
      passHref
      className="group cursor-pointer animate-on-scroll block" 
      style={{ animationDelay: `${index * 150}ms` }}
    >
      <div className="relative bg-white/70 backdrop-blur-xl rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/20 hover:border-white/40 transform hover:-translate-y-1">
        
        {/* Image Container with single image display */}
        <div className="relative overflow-hidden aspect-video">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10"></div>
          <img 
            src={apartment.images[0]} 
            alt={apartment.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Favorite Button (no action here, for display) */}
          <div className="absolute top-3 left-3 z-20 w-9 h-9 bg-white/20 backdrop-blur-lg rounded-full flex items-center justify-center border border-white/30 transition-all duration-300">
            <Heart className="w-4 h-4 text-white fill-white" />
          </div>

          {/* Availability Badge */}
          <div className="absolute bottom-3 left-3 z-20">
            <div className={`px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-lg shadow-lg ${apartment.available 
              ? 'bg-emerald-500/90 text-white border border-emerald-400/50' 
              : 'bg-rose-500/90 text-white border border-rose-400/50'
            }`}>
              {apartment.available ? 'Disponible' : 'Occupé'}
            </div>
          </div>
          
          {/* Rating Badge */}
          <div className="absolute top-3 right-3 z-20">
            <div className="flex items-center space-x-1 bg-white/20 backdrop-blur-lg px-2.5 py-1 rounded-full border border-white/30">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-current" />
              <span className="text-white font-bold text-xs">{averageRating}</span>
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-4">
          <div className="mb-2">
            <h3 className="font-bold text-gray-900 text-base line-clamp-2 mb-1 group-hover:text-blue-600 transition-colors duration-300">
              {apartment.title}
            </h3>
            <div className="flex items-center text-gray-500 text-xs">
              <MapPin className="w-3.5 h-3.5 mr-1.5 text-cyan-500" />
              <span className="font-medium line-clamp-1">{apartment.location}</span>
            </div>
          </div>
          
          {/* Price and Action - Flex layout */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex flex-col">
              <div className="flex items-baseline space-x-1">
                <span className="text-lg font-black text-gray-900">{apartment.price.toLocaleString()}</span>
                <span className="text-xs text-gray-500 font-medium">FCFA</span>
              </div>
              <span className="text-xs text-gray-400">par nuit</span>
            </div>
            
            <button className="group relative bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-700 text-white px-4 py-2 rounded-xl font-bold text-xs shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden">
              <span className="relative z-10 flex items-center">
                Détails
                <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ApartmentCard;