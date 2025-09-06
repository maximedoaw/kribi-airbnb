import React from 'react';
import { User } from 'firebase/auth';
import { Booking, Payment } from '@/types';
import KribiAnimations from '@/components/kribi-animations';
import { Star, MapPin, Users, Wifi, Car, UtensilsCrossed, Waves, Calendar, Heart } from 'lucide-react';

interface Apartment {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  images: string[];
  available: boolean;
  rating: number;
}

interface DashboardTabProps {
  bookings: Booking[];
  payments: Payment[];
  currentUser: User | null;
}

const DashboardTab: React.FC<DashboardTabProps> = ({ bookings, payments, currentUser }) => {
  // Données fictives pour les appartements
  const mockApartments: Apartment[] = [
    {
      id: '1',
      title: 'Villa Océanique Premium',
      description: 'Magnifique villa face à l\'océan avec piscine privée et accès direct à la plage',
      price: 85000,
      location: 'Kribi Centre, face à la mer',
      images: ['/api/placeholder/400/300'],
      available: true,
      rating: 4.9
    },
    {
      id: '2',
      title: 'Appartement Sunset Deluxe',
      description: 'Studio moderne avec vue panoramique sur les couchers de soleil',
      price: 45000,
      location: 'Kribi Plage, près du marché',
      images: ['/api/placeholder/400/300'],
      available: true,
      rating: 4.7
    },
    {
      id: '3',
      title: 'Bungalow Tropical Paradise',
      description: 'Bungalow authentique entouré de palmiers avec terrasse privée',
      price: 65000,
      location: 'Kribi Sud, zone tranquille',
      images: ['/api/placeholder/400/300'],
      available: false,
      rating: 4.8
    },
    {
      id: '4',
      title: 'Suite Familiale Marina',
      description: 'Grande suite familiale avec cuisinette équipée et balcon vue mer',
      price: 75000,
      location: 'Kribi Marina, proche restaurants',
      images: ['/api/placeholder/400/300'],
      available: true,
      rating: 4.6
    },
    {
      id: '5',
      title: 'Studio Plage Cocobeach',
      description: 'Studio cosy à 50m de la plage, parfait pour couple',
      price: 35000,
      location: 'Cocobeach, accès plage direct',
      images: ['/api/placeholder/400/300'],
      available: true,
      rating: 4.5
    },
    {
      id: '6',
      title: 'Villa Panorama Luxury',
      description: 'Villa de luxe avec jardin tropical et vue 360° sur l\'océan',
      price: 120000,
      location: 'Kribi Heights, vue panoramique',
      images: ['/api/placeholder/400/300'],
      available: true,
      rating: 5.0
    }
  ];

  const pendingBookings = bookings.filter(b => b.status === 'pending').length;
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length;
  const cancelledBookings = bookings.filter(b => b.status === 'cancelled').length;

  const totalSpent = payments
    .filter(p => p.status === 'completed')
    .reduce((sum, payment) => sum + payment.amount, 0);

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-700 border border-amber-200';
      case 'confirmed': return 'bg-emerald-100 text-emerald-700 border border-emerald-200';
      case 'cancelled': return 'bg-rose-100 text-rose-700 border border-rose-200';
      default: return 'bg-slate-100 text-slate-700 border border-slate-200';
    }
  };

  const ApartmentCard = ({ apartment }: { apartment: Apartment }) => (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group">
      <div className="relative">
        <img 
          src={apartment.images[0]} 
          alt={apartment.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3">
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${apartment.available ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'}`}>
            {apartment.available ? '✅ Disponible' : '❌ Occupé'}
          </div>
        </div>
        <div className="absolute top-3 left-3">
          <Heart className="w-5 h-5 text-white hover:text-rose-500 cursor-pointer transition-colors" />
        </div>
      </div>
      
      <div className="p-5">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-gray-900 text-lg truncate">{apartment.title}</h3>
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-amber-400 fill-current" />
            <span className="text-sm font-medium text-gray-700">{apartment.rating}</span>
          </div>
        </div>
        
        <div className="flex items-center text-gray-500 text-sm mb-3">
          <MapPin className="w-4 h-4 mr-1" />
          <span className="truncate">{apartment.location}</span>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{apartment.description}</p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-baseline">
            <span className="text-xl font-bold text-gray-900">{apartment.price.toLocaleString()}</span>
            <span className="text-sm text-gray-500 ml-1">FCFA/nuit</span>
          </div>
          <button className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 transform hover:scale-105">
            Réserver
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <KribiAnimations>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-orange-50">
        {/* Header Section Élégant */}
        <div className="relative mb-12 animate-on-scroll">
          {/* Background avec effet glassmorphism */}
          <div className="relative bg-gradient-to-r from-blue-600/90 via-cyan-500/90 to-orange-500/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl overflow-hidden border border-white/20">
            {/* Effets décoratifs */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-cyan-300/20 rounded-full blur-2xl"></div>
            <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-white/40 rounded-full animate-ping"></div>
            <div className="absolute top-1/3 left-1/3 w-1 h-1 bg-white/60 rounded-full animate-pulse"></div>
            
            {/* Contenu du header */}
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mr-4 border border-white/30">
                    <Waves className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-black text-white mb-1">Kribi Ocean Resort</h1>
                    <div className="flex items-center text-cyan-100">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span className="font-medium">Littoral, Cameroun</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                  <p className="text-white/90 text-lg font-medium mb-1">
                    Bonjour, <span className="font-bold text-cyan-200">{currentUser?.displayName || currentUser?.email?.split('@')[0]} 👋</span>
                  </p>
                  <p className="text-white/70 text-sm">Prêt pour votre prochaine escapade océanique ?</p>
                </div>
              </div>
              
              {/* Avatar et actions */}
              <div className="hidden md:flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-white font-semibold">Membre Premium</p>
                  <p className="text-cyan-200 text-sm">Depuis 2024 ⭐</p>
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-300 to-blue-400 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xl">
                    {(currentUser?.displayName?.[0] || currentUser?.email?.[0] || 'U').toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Vagues décoratives en bas */}
            <div className="absolute bottom-0 left-0 right-0 h-8 overflow-hidden">
              <svg viewBox="0 0 1200 120" className="w-full h-full opacity-20">
                <path d="M0,50 C300,10 600,90 900,50 C1050,30 1150,70 1200,50 L1200,120 L0,120 Z" fill="white">
                  <animate attributeName="d" dur="4s" repeatCount="indefinite"
                    values="M0,50 C300,10 600,90 900,50 C1050,30 1150,70 1200,50 L1200,120 L0,120 Z;
                            M0,70 C300,30 600,50 900,70 C1050,90 1150,30 1200,70 L1200,120 L0,120 Z;
                            M0,50 C300,10 600,90 900,50 C1050,30 1150,70 1200,50 L1200,120 L0,120 Z" />
                </path>
              </svg>
            </div>
          </div>
        </div>

        <div className="px-8 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 -mt-6">
            <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-amber-400 animate-on-scroll hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-600 font-medium text-sm mb-1">En attente</p>
                  <p className="text-3xl font-bold text-gray-900">{pendingBookings}</p>
                  <p className="text-xs text-gray-500 mt-1">réservations</p>
                </div>
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-amber-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-emerald-400 animate-on-scroll hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-600 font-medium text-sm mb-1">Confirmées</p>
                  <p className="text-3xl font-bold text-gray-900">{confirmedBookings}</p>
                  <p className="text-xs text-gray-500 mt-1">réservations</p>
                </div>
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-rose-400 animate-on-scroll hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-rose-600 font-medium text-sm mb-1">Annulées</p>
                  <p className="text-3xl font-bold text-gray-900">{cancelledBookings}</p>
                  <p className="text-xs text-gray-500 mt-1">réservations</p>
                </div>
                <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center">
                  <span className="text-rose-600 text-xl">✕</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-400 animate-on-scroll hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 font-medium text-sm mb-1">Total dépensé</p>
                  <p className="text-2xl font-bold text-gray-900">{totalSpent.toLocaleString()}</p>
                  <p className="text-xs text-gray-500 mt-1">FCFA</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <span className="text-blue-600 text-xl">💰</span>
                </div>
              </div>
            </div>
          </div>

          {/* Apartments Catalog */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-8 animate-on-scroll">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Nos Appartements</h2>
                <p className="text-gray-600 flex items-center">
                  <Waves className="w-4 h-4 mr-2 text-cyan-500" />
                  Découvrez notre collection d'hébergements face à l'océan
                </p>
              </div>
              <button className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-6 py-3 rounded-xl font-medium hover:from-orange-600 hover:to-amber-600 transition-all duration-200 transform hover:scale-105 shadow-lg">
                Voir tout le catalogue
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {mockApartments.map((apartment, index) => (
                <div key={apartment.id} className="animate-on-scroll" style={{ animationDelay: `${index * 0.1}s` }}>
                  <ApartmentCard apartment={apartment} />
                </div>
              ))}
            </div>
          </div>

          {/* Recent Bookings */}
          <div className="bg-white rounded-2xl shadow-lg p-8 animate-on-scroll">
            <div className="flex items-center mb-6">
              <Calendar className="w-6 h-6 text-blue-500 mr-3" />
              <h3 className="text-2xl font-bold text-gray-900">Réservations récentes</h3>
            </div>
            
            <div className="space-y-4">
              {bookings.slice(0, 5).map((booking, index) => (
                <div key={booking.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-100 hover:shadow-md transition-all duration-300 animate-on-scroll" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-xl flex items-center justify-center text-white font-bold">
                      🏖️
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{booking.apartment?.title || 'Appartement Kribi'}</h4>
                      <p className="text-sm text-gray-600 flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        Kribi Ocean Resort
                      </p>
                    </div>
                  </div>
                  <span className={`px-4 py-2 rounded-xl text-sm font-medium ${getStatusBadgeClass(booking.status)}`}>
                    {booking.status === 'pending' && '⏳ En attente'}
                    {booking.status === 'confirmed' && '✅ Confirmé'}
                    {booking.status === 'cancelled' && '❌ Annulé'}
                  </span>
                </div>
              ))}
              
              {bookings.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">🏖️</span>
                  </div>
                  <h4 className="text-xl font-semibold text-gray-700 mb-2">Aucune réservation</h4>
                  <p className="text-gray-500 mb-6">Commencez votre aventure à Kribi dès maintenant !</p>
                  <button className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 transform hover:scale-105">
                    Explorer nos logements
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </KribiAnimations>
  );
};

export default DashboardTab;