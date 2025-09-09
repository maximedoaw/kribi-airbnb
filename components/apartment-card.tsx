import { Apartment } from "@/types";
import { ArrowRight, Car, Heart, MapPin, Star, UtensilsCrossed, Wifi } from "lucide-react";


const ApartmentCard = ({ apartment, index }: { apartment: Apartment; index: number }) => (
    <div className="group cursor-pointer animate-on-scroll" style={{ animationDelay: `${index * 150}ms` }}>
      {/* Card Container avec effet glassmorphism - Style YouTube */}
      <div className="relative bg-white/70 backdrop-blur-xl rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/20 hover:border-white/40">
        
        {/* Image Container - Style YouTube */}
        <div className="relative overflow-hidden aspect-video">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10"></div>
          <img 
            src={apartment.images[0]} 
            alt={apartment.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Badges flottants */}
          <div className="absolute top-3 right-3 z-20">
            <div className={`px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-lg shadow-lg ${apartment.available 
              ? 'bg-emerald-500/90 text-white border border-emerald-400/50' 
              : 'bg-rose-500/90 text-white border border-rose-400/50'
            }`}>
              {apartment.available ? '✨ Disponible' : '🔒 Occupé'}
            </div>
          </div>
          
          {/* Heart Icon */}
          <div className="absolute top-3 left-3 z-20">
            <div className="w-9 h-9 bg-white/20 backdrop-blur-lg rounded-full flex items-center justify-center border border-white/30 hover:bg-rose-500/90 transition-all duration-300 group">
              <Heart className="w-4 h-4 text-white group-hover:text-white group-hover:fill-current" />
            </div>
          </div>
          
          {/* Rating Badge */}
          <div className="absolute bottom-3 left-3 z-20">
            <div className="flex items-center space-x-1 bg-white/20 backdrop-blur-lg px-2.5 py-1 rounded-full border border-white/30">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-current" />
              <span className="text-white font-bold text-xs">{apartment.rating}</span>
            </div>
          </div>
        </div>
        
        {/* Content - Style YouTube avec disposition verticale */}
        <div className="p-4">
          {/* Title and Location - Empilé verticalement */}
          <div className="mb-3">
            <h3 className="font-bold text-gray-900 text-base line-clamp-2 mb-1 group-hover:text-blue-600 transition-colors duration-300">
              {apartment.title}
            </h3>
            <div className="flex items-center text-gray-500 text-xs">
              <MapPin className="w-3.5 h-3.5 mr-1.5 text-cyan-500" />
              <span className="font-medium line-clamp-1">{apartment.location}</span>
            </div>
          </div>
          
          {/* Description - Cachée sur mobile, visible sur desktop */}
          <p className="text-gray-600 text-xs lg:text-sm mb-3 line-clamp-2 leading-relaxed hidden sm:block">
            {apartment.description}
          </p>
          
          {/* Amenities - Disposition compacte */}
          <div className="flex items-center space-x-3 mb-4">
            <div className="flex items-center space-x-1 text-gray-500">
              <Wifi className="w-3.5 h-3.5" />
            </div>
            <div className="flex items-center space-x-1 text-gray-500">
              <Car className="w-3.5 h-3.5" />
            </div>
            <div className="flex items-center space-x-1 text-gray-500">
              <UtensilsCrossed className="w-3.5 h-3.5" />
            </div>
          </div>
          
          {/* Price and CTA - Disposition adaptative */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <div className="flex items-baseline space-x-1">
                <span className="text-lg font-black text-gray-900">{apartment.price.toLocaleString()}</span>
                <span className="text-xs text-gray-500 font-medium">FCFA</span>
              </div>
              <span className="text-xs text-gray-400">par nuit</span>
            </div>
            
            <button className="group relative bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-700 text-white px-4 py-2 rounded-xl font-bold text-xs shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden">
              <span className="relative z-10 flex items-center">
                Réserver
                <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            </button>
          </div>
        </div>
        
        {/* Animated border effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 via-cyan-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
      </div>
    </div>
  );

export default ApartmentCard