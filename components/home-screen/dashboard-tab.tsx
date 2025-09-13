import React from 'react';
import { User } from 'firebase/auth';
import { Apartment, Booking, Payment } from '@/types';
import KribiAnimations from '@/components/kribi-animations';
import { Star, MapPin, Users,  Waves, Calendar, Heart, TrendingUp, Eye, Filter, ArrowRight } from 'lucide-react';
import ApartmentCard from '../apartment-card';
import { useGetCurrentUser } from '@/hooks/use-get-current-user';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { formatFirestoreDate } from '@/lib/utils';
import { useApartments } from '@/hooks/use-apartments';

interface DashboardTabProps {
  currentUser: User | null;
}

const DashboardTab: React.FC<DashboardTabProps> = ({currentUser} : DashboardTabProps) => {
  const { apartments, loading } = useApartments();

  const [user] = useAuthState(auth)
  const { userData } = useGetCurrentUser(user)


  return (
    <KribiAnimations>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/50 relative overflow-hidden">
        
        {/* Animated background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-cyan-400/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-amber-400/5 to-orange-400/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
        </div>

        {/* Header Section Ultra-Moderne */}
        <div className="relative mb-6 lg:mb-12 animate-on-scroll">
          <div className="relative mx-4 sm:mx-6 lg:mx-8 mt-4 lg:mt-6">
            {/* Main Header Card */}
            <div className="relative bg-gradient-to-r from-slate-900 via-blue-900 to-cyan-800 rounded-2xl lg:rounded-[2.5rem] p-5 sm:p-6 lg:p-10 shadow-2xl overflow-hidden border border-white/10">
              
              {/* Animated background elements */}
              <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] animate-pulse"></div>
              <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-500/10 via-cyan-500/5 to-transparent rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-purple-500/10 via-pink-500/5 to-transparent rounded-full blur-3xl"></div>
              
              <div className="relative z-10">
                {/* Top Section */}
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6 lg:mb-8 space-y-4 lg:space-y-0">
                  
                  {/* Brand and User Info */}
                  <div className="flex-1">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl lg:rounded-2xl flex items-center justify-center mr-3 lg:mr-4 shadow-lg">
                        <Waves className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
                      </div>
                      <div>
                        <h1 className="text-2xl lg:text-4xl font-black text-white mb-1">LaRoseDor</h1>
                        <div className="flex items-center text-cyan-200 text-xs lg:text-sm">
                          <MapPin className="w-3.5 h-3.5 lg:w-4 lg:h-4 mr-1.5" />
                          <span className="font-medium">Douala, Littoral</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Welcome Message */}
                    <div className="bg-white/10 backdrop-blur-xl rounded-xl lg:rounded-2xl p-3 lg:p-4 border border-white/20 max-w-lg">
                      <p className="text-white text-base lg:text-lg font-semibold mb-1">
                        Bonjour, <span className="text-cyan-300 font-black">{userData?.displayName || userData?.email?.split('@')[0]} 👋</span>
                      </p>
                      <p className="text-white/80 text-xs lg:text-sm">Prêt pour votre prochaine escapade ? Découvrez nos nouveaux hébergements</p>
                    </div>
                  </div>
                  
                  {/* User Avatar and Stats */}
                  <div className="flex items-center justify-between lg:justify-end space-x-4 mt-4 lg:mt-0">
                    <div className="text-left lg:text-right">
                      <p className="text-white font-bold text-base lg:text-lg">Membre</p>
                      <p className="text-cyan-300 text-xs lg:text-sm flex items-center lg:justify-end">
                        <Star className="w-3.5 h-3.5 mr-1 fill-current text-amber-400" />
                        Depuis {formatFirestoreDate(userData?.createdAt)}
                      </p>
                    </div>
                    <div className="w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-amber-400 via-orange-500 to-pink-500 rounded-xl lg:rounded-2xl flex items-center justify-center shadow-xl">
                      <span className="text-white font-black text-lg lg:text-xl">
                        {(currentUser?.displayName?.[0] || currentUser?.email?.[0] || 'U').toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Quick Actions */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
                  <button className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-3 text-center hover:bg-white/20 transition-all duration-300 group">
                    <Eye className="w-5 h-5 text-cyan-300 mx-auto mb-1 group-hover:scale-110 transition-transform" />
                    <span className="text-white text-xs font-medium">Explorer</span>
                  </button>
                  <button className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-3 text-center hover:bg-white/20 transition-all duration-300 group">
                    <Filter className="w-5 h-5 text-cyan-300 mx-auto mb-1 group-hover:scale-110 transition-transform" />
                    <span className="text-white text-xs font-medium">Filtrer</span>
                  </button>
                  <button className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-3 text-center hover:bg-white/20 transition-all duration-300 group">
                    <Heart className="w-5 h-5 text-cyan-300 mx-auto mb-1 group-hover:scale-110 transition-transform" />
                    <span className="text-white text-xs font-medium">Favoris</span>
                  </button>
                  <button className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-3 text-center hover:bg-white/20 transition-all duration-300 group">
                    <Calendar className="w-5 h-5 text-cyan-300 mx-auto mb-1 group-hover:scale-110 transition-transform" />
                    <span className="text-white text-xs font-medium">Planning</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 sm:px-6 lg:px-8 pb-6 lg:pb-12">
          
          {/* Stats Cards Redesigned */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 mb-8 lg:mb-12 -mt-6 lg:-mt-12">
            
            {/* Pending Bookings */}
            <div className="relative group animate-on-scroll">
              <div className="bg-white/80 backdrop-blur-xl rounded-xl lg:rounded-2xl shadow-lg hover:shadow-xl p-3 lg:p-5 border border-white/20 hover:border-amber-200/50 transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg lg:rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Calendar className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                  </div>
                  <div className="text-right">
                    <TrendingUp className="w-3.5 h-3.5 text-amber-500 ml-auto mb-1" />
                  </div>
                </div>
                <p className="text-amber-600 font-bold text-xs mb-1 uppercase tracking-wide">En attente</p>
                <p className="text-xl lg:text-2xl font-black text-gray-900 mb-1">0</p>
                <p className="text-xs text-gray-500">réservations</p>
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-xl lg:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>
            
            {/* Confirmed Bookings */}
            <div className="relative group animate-on-scroll" style={{ animationDelay: '100ms' }}>
              <div className="bg-white/80 backdrop-blur-xl rounded-xl lg:rounded-2xl shadow-lg hover:shadow-xl p-3 lg:p-5 border border-white/20 hover:border-emerald-200/50 transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-emerald-400 to-green-500 rounded-lg lg:rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Users className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                  </div>
                  <div className="text-right">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-500 ml-auto mb-1" />
                  </div>
                </div>
                <p className="text-emerald-600 font-bold text-xs mb-1 uppercase tracking-wide">Confirmées</p>
                <p className="text-xl lg:text-2xl font-black text-gray-900 mb-1">0</p>
                <p className="text-xs text-gray-500">réservations</p>
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-green-500/10 rounded-xl lg:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>
            
            {/* Cancelled Bookings */}
            <div className="relative group animate-on-scroll" style={{ animationDelay: '200ms' }}>
              <div className="bg-white/80 backdrop-blur-xl rounded-xl lg:rounded-2xl shadow-lg hover:shadow-xl p-3 lg:p-5 border border-white/20 hover:border-rose-200/50 transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-rose-400 to-pink-500 rounded-lg lg:rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <span className="text-white text-lg lg:text-xl">❌</span>
                  </div>
                  <div className="text-right">
                    <div className="w-3.5 h-3.5 bg-rose-500 rounded-full ml-auto mb-1"></div>
                  </div>
                </div>
                <p className="text-rose-600 font-bold text-xs mb-1 uppercase tracking-wide">Annulées</p>
                <p className="text-xl lg:text-2xl font-black text-gray-900 mb-1">0</p>
                <p className="text-xs text-gray-500">réservations</p>
                <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 to-pink-500/10 rounded-xl lg:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>
            
            {/* Total Spent */}
            <div className="relative group animate-on-scroll" style={{ animationDelay: '300ms' }}>
              <div className="bg-white/80 backdrop-blur-xl rounded-xl lg:rounded-2xl shadow-lg hover:shadow-xl p-3 lg:p-5 border border-white/20 hover:border-blue-200/50 transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-lg lg:rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <span className="text-white text-lg lg:text-xl">💰</span>
                  </div>
                  <div className="text-right">
                    <TrendingUp className="w-3.5 h-3.5 text-blue-500 ml-auto mb-1" />
                  </div>
                </div>
                <p className="text-blue-600 font-bold text-xs mb-1 uppercase tracking-wide">Total dépensé</p>
                <p className="text-lg lg:text-xl font-black text-gray-900 mb-1">0</p>
                <p className="text-xs text-gray-500">FCFA</p>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl lg:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>
          </div>

          {/* Apartments Catalog */}
          <div className="mb-8 lg:mb-12">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 lg:mb-8 animate-on-scroll space-y-3 sm:space-y-0">
              <div className="flex-1">
                <h2 className="text-2xl lg:text-4xl font-black text-gray-900 mb-2">Nos Appartements</h2>
                <p className="text-gray-600 flex items-center text-xs lg:text-base">
                  <Waves className="w-3.5 h-3.5 lg:w-5 lg:h-5 mr-2 text-cyan-500" />
                  Découvrez notre collection d'hébergements
                </p>
              </div>
              <button className="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 text-white font-bold py-2.5 px-5 lg:py-3 lg:px-6 rounded-xl lg:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 flex items-center group">
                <span className="text-sm lg:text-base">Tout voir</span>
                <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white/80 backdrop-blur-xl rounded-xl lg:rounded-2xl shadow-lg p-4 border border-white/20 animate-pulse">
                    <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-3"></div>
                    <div className="h-3 bg-gray-200 rounded mb-2 w-2/3"></div>
                    <div className="h-3 bg-gray-200 rounded mb-4 w-1/2"></div>
                    <div className="h-10 bg-gray-200 rounded-xl"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
                {apartments.map((apartment, index) => (
                  <ApartmentCard 
                    key={apartment.id} 
                    apartment={apartment} 
                    index={index}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </KribiAnimations>
  );
};

export default DashboardTab;