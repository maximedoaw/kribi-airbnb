// app/bookings/page.tsx
'use client';

import React, { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { Booking, Apartment } from '@/types';
import KribiAnimations from '@/components/kribi-animations';
import { MapPin, Calendar, Users, Star, Clock, CheckCircle, XCircle, Filter, Search, Eye, Download, ChevronDown, ChevronUp } from 'lucide-react';

// Données fictives pour les appartements
const mockApartments: Apartment[] = [
  {
    id: '1',
    title: 'Villa Océanique Premium',
    description: 'Magnifique villa face à l\'océan avec piscine privée et accès direct à la plage',
    price: 85000,
    location: 'Kribi Centre, face à la mer',
    images: ['/api/placeholder/600/400'],
    available: true,
    rating: 4.9
  },
  {
    id: '2',
    title: 'Appartement Sunset Deluxe',
    description: 'Studio moderne avec vue panoramique sur les couchers de soleil',
    price: 45000,
    location: 'Kribi Plage, près du marché',
    images: ['/api/placeholder/600/400'],
    available: true,
    rating: 4.7
  },
  {
    id: '3',
    title: 'Bungalow Tropical Paradise',
    description: 'Bungalow authentique entouré de palmiers avec terrasse privée',
    price: 65000,
    location: 'Kribi Sud, zone tranquille',
    images: ['/api/placeholder/600/400'],
    available: false,
    rating: 4.8
  }
];

// Données fictives pour les réservations
const mockBookings: Booking[] = [
  {
    id: '1',
    apartmentId: '1',
    userId: 'user1',
    startDate: '2024-01-15',
    endDate: '2024-01-20',
    status: 'confirmed',
    apartment: mockApartments[0]
  },
  {
    id: '2',
    apartmentId: '2',
    userId: 'user1',
    startDate: '2024-02-10',
    endDate: '2024-02-15',
    status: 'pending',
    apartment: mockApartments[1]
  },
  {
    id: '3',
    apartmentId: '3',
    userId: 'user1',
    startDate: '2024-03-05',
    endDate: '2024-03-12',
    status: 'cancelled',
    apartment: mockApartments[2]
  },
  {
    id: '4',
    apartmentId: '1',
    userId: 'user1',
    startDate: '2023-12-01',
    endDate: '2023-12-07',
    status: 'confirmed',
    apartment: mockApartments[0]
  },
  {
    id: '5',
    apartmentId: '2',
    userId: 'user1',
    startDate: '2023-11-15',
    endDate: '2023-11-20',
    status: 'confirmed',
    apartment: mockApartments[1]
  }
];

const BookingsTab = () => {
  const [user, loading] = useAuthState(auth);
  const [filter, setFilter] = useState<'all' | 'confirmed' | 'pending' | 'cancelled'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedBooking, setExpandedBooking] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Filtrer les réservations
  const filteredBookings = mockBookings.filter(booking => {
    const matchesStatus = filter === 'all' || booking.status === filter;
    const matchesSearch = searchTerm === '' || 
      booking.apartment?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.apartment?.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  const confirmedBookings = mockBookings.filter(b => b.status === 'confirmed').length;
  const pendingBookings = mockBookings.filter(b => b.status === 'pending').length;
  const cancelledBookings = mockBookings.filter(b => b.status === 'cancelled').length;

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-gradient-to-r from-amber-50 to-amber-100 text-amber-800 border border-amber-200 shadow-sm';
      case 'confirmed': return 'bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-800 border border-emerald-200 shadow-sm';
      case 'cancelled': return 'bg-gradient-to-r from-rose-50 to-rose-100 text-rose-800 border border-rose-200 shadow-sm';
      default: return 'bg-gradient-to-r from-slate-50 to-slate-100 text-slate-800 border border-slate-200 shadow-sm';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'confirmed': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const calculateNights = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const toggleBookingExpansion = (bookingId: string) => {
    setExpandedBooking(expandedBooking === bookingId ? null : bookingId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <KribiAnimations>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/50 relative overflow-hidden">
        
        {/* Animated background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-cyan-400/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-amber-400/5 to-orange-400/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
        </div>

        {/* Header Section - Adapté pour mobile */}
        <div className="relative mb-6 lg:mb-12 animate-on-scroll">
          <div className="relative mx-4 sm:mx-6 lg:mx-8 mt-4 lg:mt-8">
            <div className="relative bg-gradient-to-r from-slate-900 via-blue-900 to-cyan-800 rounded-2xl lg:rounded-[2.5rem] p-5 sm:p-6 lg:p-12 shadow-2xl overflow-hidden border border-white/10">
              
              {/* Animated background elements */}
              <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] animate-pulse"></div>
              <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-500/10 via-cyan-500/5 to-transparent rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-purple-500/10 via-pink-500/5 to-transparent rounded-full blur-3xl"></div>
              
              <div className="relative z-10">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6 lg:mb-12 space-y-4 lg:space-y-0">
                  
                  <div className="flex-1">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl lg:rounded-3xl flex items-center justify-center mr-3 lg:mr-6 shadow-lg">
                        <Calendar className="w-6 h-6 lg:w-9 lg:h-9 text-white" />
                      </div>
                      <div>
                        <h1 className="text-2xl lg:text-5xl font-black text-white mb-1">Mes Réservations</h1>
                        <div className="flex items-center text-cyan-200 text-xs lg:text-base">
                          <span className="font-medium">Historique complet de vos séjours</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white/10 backdrop-blur-xl rounded-xl lg:rounded-3xl p-3 lg:p-6 border border-white/20 max-w-lg">
                      <p className="text-white text-base lg:text-xl font-semibold mb-1">
                        Bonjour, <span className="text-cyan-300 font-black">{user?.displayName || user?.email?.split('@')[0]} 👋</span>
                      </p>
                      <p className="text-white/80 text-xs lg:text-base">
                        Retrouvez l'historique de toutes vos réservations.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between lg:justify-end space-x-4">
                    <div className="text-left lg:text-right">
                      <p className="text-white font-bold text-base lg:text-xl">{mockBookings.length} Séjours</p>
                      <p className="text-cyan-300 text-xs lg:text-base">
                        depuis 2024
                      </p>
                    </div>
                    <div className="w-12 h-12 lg:w-20 lg:h-20 bg-gradient-to-br from-amber-400 via-orange-500 to-pink-500 rounded-xl lg:rounded-3xl flex items-center justify-center shadow-xl">
                      <span className="text-white font-black text-lg lg:text-2xl">
                        {(user?.displayName?.[0] || user?.email?.[0] || 'U').toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Stats Cards - Version mobile compacte */}
                <div className="grid grid-cols-3 gap-2 lg:gap-6">
                  <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl lg:rounded-2xl p-2 lg:p-4 text-center">
                    <div className="flex items-center justify-center mb-1 lg:mb-2">
                      <CheckCircle className="w-4 h-4 lg:w-5 lg:h-5 text-emerald-300" />
                    </div>
                    <span className="text-white text-xs lg:text-sm font-medium">{confirmedBookings}</span>
                  </div>
                  <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl lg:rounded-2xl p-2 lg:p-4 text-center">
                    <div className="flex items-center justify-center mb-1 lg:mb-2">
                      <Clock className="w-4 h-4 lg:w-5 lg:h-5 text-amber-300" />
                    </div>
                    <span className="text-white text-xs lg:text-sm font-medium">{pendingBookings}</span>
                  </div>
                  <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl lg:rounded-2xl p-2 lg:p-4 text-center">
                    <div className="flex items-center justify-center mb-1 lg:mb-2">
                      <XCircle className="w-4 h-4 lg:w-5 lg:h-5 text-rose-300" />
                    </div>
                    <span className="text-white text-xs lg:text-sm font-medium">{cancelledBookings}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 sm:px-6 lg:px-8 pb-8 lg:pb-16">
          
          {/* Filters and Search - Version mobile améliorée */}
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl lg:rounded-[2.5rem] shadow-2xl p-4 lg:p-8 border border-white/30 mb-6 lg:mb-12 animate-on-scroll">
            <div className="flex flex-col space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Rechercher un séjour..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/50 backdrop-blur-sm rounded-2xl border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                />
              </div>
              
              {/* Filter Toggle for Mobile */}
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-4 py-2 rounded-2xl font-medium text-sm"
              >
                <Filter className="w-4 h-4" />
                <span>Filtres</span>
                {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              
              {/* Filters - Hidden on mobile by default */}
              <div className={`${showFilters ? 'block' : 'hidden'} lg:block`}>
                <div className="flex flex-wrap gap-2 lg:gap-4">
                  <button
                    onClick={() => setFilter('all')}
                    className={`px-3 py-2 lg:px-4 lg:py-2 rounded-2xl font-medium text-xs lg:text-sm transition-all duration-300 ${filter === 'all' ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg' : 'bg-white/50 text-gray-700 hover:bg-white/80'}`}
                  >
                    Toutes
                  </button>
                  <button
                    onClick={() => setFilter('confirmed')}
                    className={`px-3 py-2 lg:px-4 lg:py-2 rounded-2xl font-medium text-xs lg:text-sm transition-all duration-300 flex items-center space-x-2 ${filter === 'confirmed' ? 'bg-gradient-to-r from-emerald-600 to-green-500 text-white shadow-lg' : 'bg-white/50 text-gray-700 hover:bg-white/80'}`}
                  >
                    <CheckCircle className="w-3 h-3 lg:w-4 lg:h-4" />
                    <span>Confirmées</span>
                  </button>
                  <button
                    onClick={() => setFilter('pending')}
                    className={`px-3 py-2 lg:px-4 lg:py-2 rounded-2xl font-medium text-xs lg:text-sm transition-all duration-300 flex items-center space-x-2 ${filter === 'pending' ? 'bg-gradient-to-r from-amber-600 to-yellow-500 text-white shadow-lg' : 'bg-white/50 text-gray-700 hover:bg-white/80'}`}
                  >
                    <Clock className="w-3 h-3 lg:w-4 lg:h-4" />
                    <span>En attente</span>
                  </button>
                  <button
                    onClick={() => setFilter('cancelled')}
                    className={`px-3 py-2 lg:px-4 lg:py-2 rounded-2xl font-medium text-xs lg:text-sm transition-all duration-300 flex items-center space-x-2 ${filter === 'cancelled' ? 'bg-gradient-to-r from-rose-600 to-pink-500 text-white shadow-lg' : 'bg-white/50 text-gray-700 hover:bg-white/80'}`}
                  >
                    <XCircle className="w-3 h-3 lg:w-4 lg:h-4" />
                    <span>Annulées</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Bookings List - Version mobile améliorée */}
          <div className="space-y-4 lg:space-y-8">
            {filteredBookings.length > 0 ? (
              filteredBookings.map((booking, index) => (
                <div key={booking.id} className="bg-white/70 backdrop-blur-xl rounded-2xl lg:rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/30 animate-on-scroll" style={{ animationDelay: `${index * 100}ms` }}>
                  
                  {/* Header de la carte - Toujours visible */}
                  <div 
                    className="p-4 lg:p-6 cursor-pointer"
                    onClick={() => toggleBookingExpansion(booking.id)}
                  >
                    <div className="flex items-start space-x-4">
                      {/* Image */}
                      <div className="w-16 h-16 lg:w-24 lg:h-24 bg-gradient-to-br from-blue-400 via-cyan-500 to-blue-600 rounded-xl lg:rounded-2xl flex items-center justify-center text-white font-bold shadow-lg overflow-hidden flex-shrink-0">
                        {booking.apartment?.images?.[0] ? (
                          <img 
                            src={booking.apartment.images[0]} 
                            alt={booking.apartment.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-xl lg:text-2xl">🏖️</span>
                        )}
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 text-base lg:text-xl mb-1 truncate">
                          {booking.apartment?.title || 'Appartement Kribi'}
                        </h3>
                        
                        <div className="flex items-center text-gray-600 mb-2">
                          <MapPin className="w-3 h-3 lg:w-4 lg:h-4 mr-1 text-cyan-500 flex-shrink-0" />
                          <span className="text-xs lg:text-sm truncate">{booking.apartment?.location || 'Kribi Ocean Resort'}</span>
                        </div>
                        
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="flex items-center space-x-1 bg-blue-50 px-2 py-1 rounded-full">
                            <Star className="w-3 h-3 text-amber-400 fill-current" />
                            <span className="text-xs font-medium text-gray-700">{booking.apartment?.rating || 4.5}</span>
                          </div>
                          
                          <span className={`px-2 py-1 rounded-xl text-xs font-bold flex items-center space-x-1 ${getStatusBadgeClass(booking.status)}`}>
                            {getStatusIcon(booking.status)}
                            <span className="hidden xs:inline">
                              {booking.status === 'pending' && 'En attente'}
                              {booking.status === 'confirmed' && 'Confirmé'}
                              {booking.status === 'cancelled' && 'Annulé'}
                            </span>
                            <span className="xs:hidden">
                              {booking.status === 'pending' && 'Attente'}
                              {booking.status === 'confirmed' && 'Conf.'}
                              {booking.status === 'cancelled' && 'Annul.'}
                            </span>
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="text-xs lg:text-sm text-gray-500">
                            {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                          </div>
                          <div className="text-xs lg:text-sm font-semibold text-gray-700">
                            {calculateNights(booking.startDate, booking.endDate)} nuit(s)
                          </div>
                        </div>
                      </div>
                      
                      {/* Chevron for expansion */}
                      <div className="flex-shrink-0">
                        {expandedBooking === booking.id ? (
                          <ChevronUp className="w-5 h-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Détails expansibles */}
                  {expandedBooking === booking.id && (
                    <div className="px-4 pb-4 lg:px-6 lg:pb-6 border-t border-gray-100">
                      <div className="pt-4 space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-blue-50 rounded-xl p-3">
                            <p className="text-xs text-gray-600">Arrivée</p>
                            <p className="font-medium text-sm">{formatDate(booking.startDate)}</p>
                          </div>
                          <div className="bg-blue-50 rounded-xl p-3">
                            <p className="text-xs text-gray-600">Départ</p>
                            <p className="font-medium text-sm">{formatDate(booking.endDate)}</p>
                          </div>
                        </div>
                        
                        <div className="bg-cyan-50 rounded-xl p-3">
                          <p className="text-xs text-gray-600">Prix total</p>
                          <p className="font-bold text-lg text-gray-800">
                            {booking.apartment ? (booking.apartment.price * calculateNights(booking.startDate, booking.endDate)).toLocaleString() : '0'} FCFA
                          </p>
                        </div>
                        
                        <div className="flex space-x-2">
                          <button className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-3 py-2 rounded-xl font-medium text-xs shadow-lg hover:shadow-xl transition-all duration-300">
                            <Eye className="w-4 h-4 inline mr-1" />
                            Détails
                          </button>
                          
                          {booking.status === 'confirmed' && (
                            <button className="bg-gradient-to-r from-emerald-600 to-green-500 text-white px-3 py-2 rounded-xl font-medium text-xs shadow-lg hover:shadow-xl transition-all duration-300">
                              <Download className="w-4 h-4 inline mr-1" />
                              Facture
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="bg-white/70 backdrop-blur-xl rounded-2xl lg:rounded-[2.5rem] shadow-2xl p-8 lg:p-16 border border-white/30 text-center animate-on-scroll">
                <div className="w-16 h-16 lg:w-24 lg:h-24 bg-gradient-to-br from-blue-100 via-cyan-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 lg:mb-6">
                  <span className="text-2xl lg:text-4xl">📝</span>
                </div>
                <h4 className="text-xl lg:text-3xl font-black text-gray-700 mb-2 lg:mb-3">Aucune réservation trouvée</h4>
                <p className="text-gray-500 mb-6 lg:mb-8 text-sm lg:text-base max-w-md mx-auto">
                  {searchTerm || filter !== 'all' 
                    ? 'Aucune réservation ne correspond à vos critères.' 
                    : 'Vous n\'avez pas encore effectué de réservation.'}
                </p>
                <button className="bg-gradient-to-r from-blue-600 via-cyan-500 to-purple-600 text-white px-6 lg:px-8 py-3 lg:py-4 rounded-xl lg:rounded-2xl font-bold text-sm lg:text-base hover:from-blue-700 hover:via-cyan-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                  Explorer nos logements
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </KribiAnimations>
  );
};

export default BookingsTab;