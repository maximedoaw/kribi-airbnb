'use client';

import React, { useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  BarChart3, 
  Calendar, 
  Home, 
  LogOut, 
  Menu, 
  Settings, 
  Store, 
  Waves, 
  X,
  Anchor,
  Shell,
  Fish,
  Heart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

const AppSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await signOut(auth);
      router.push('/'); // Redirection vers la page d'accueil
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      setIsLoggingOut(false);
      setIsMobileOpen(false);
    }
  };

  const menuItems = [
    {
      href: '/',
      label: 'Accueil',
      icon: Home,
    },
    {
      href: '/bookings',
      label: 'Mes réservations',
      icon: Calendar,
    },
    {
      href: '/favorite',
      label: 'Mes favoris',
      icon: Heart,
    },
    {
      href: '/stats',
      label: 'Statistiques',
      icon: BarChart3,
    },
    {
      href: '/admin',
      label: 'Administration',
      icon: Settings,
    },
  ];

  const isActive = (path: string) => {
    return pathname === path;
  };

  const SidebarContent = ({ isCollapsed = false }: { isCollapsed?: boolean }) => (
    <div className={`h-full bg-gradient-to-br from-cyan-500 via-blue-500 to-pink-600 relative overflow-hidden transition-all duration-500 ${isCollapsed ? 'w-20' : 'w-72'}`}>
      {/* Effets d'arrière-plan avec dégradé rose/rouge */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 via-blue-600/30 to-pink-500/40"></div>
      
      {/* Vagues animées en arrière-plan avec touches roses */}
      <div className="absolute bottom-0 left-0 right-0 h-32 opacity-30">
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1200 120" className="w-full h-20 fill-pink-400/20">
            <path d="M0,60 C150,100 350,0 600,60 C850,120 1050,20 1200,60 L1200,120 L0,120 Z">
              <animate attributeName="d" dur="4s" repeatCount="indefinite"
                values="M0,60 C150,100 350,0 600,60 C850,120 1050,20 1200,60 L1200,120 L0,120 Z;
                        M0,40 C150,80 350,20 600,40 C850,60 1050,40 1200,40 L1200,120 L0,120 Z;
                        M0,60 C150,100 350,0 600,60 C850,120 1050,20 1200,60 L1200,120 L0,120 Z" />
            </path>
          </svg>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1200 120" className="w-full h-16 fill-cyan-400/10">
            <path d="M0,80 C300,120 600,40 900,80 C1050,100 1150,60 1200,80 L1200,120 L0,120 Z">
              <animate attributeName="d" dur="3s" repeatCount="indefinite"
                values="M0,80 C300,120 600,40 900,80 C1050,100 1150,60 1200,80 L1200,120 L0,120 Z;
                        M0,100 C300,60 600,100 900,60 C1050,80 1150,100 1200,100 L1200,120 L0,120 Z;
                        M0,80 C300,120 600,40 900,80 C1050,100 1150,60 1200,80 L1200,120 L0,120 Z" />
            </path>
          </svg>
        </div>
      </div>

      {/* Bulles flottantes avec certaines roses */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className={`absolute rounded-full animate-float ${i % 4 === 0 ? 'bg-pink-300/30' : 'bg-white/20'}`}
            style={{
              width: `${Math.random() * 12 + 4}px`,
              height: `${Math.random() * 12 + 4}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* En-tête avec ancre marine et coeur rose */}
      <div className={`relative z-10 p-6 text-center border-b border-white/20 transition-all duration-300 ${isCollapsed ? 'px-2' : ''}`}>
        <div className="flex items-center justify-center mb-2">
          <Anchor className="w-8 h-8 text-white mr-2" />
          <Heart className="w-6 h-6 text-pink-300 animate-pulse" />
          <Waves className="w-6 h-6 text-cyan-200 ml-2" />
        </div>
        {!isCollapsed && (
          <>
            <h2 className="text-xl font-bold text-white tracking-wide">LaRoseDor</h2>
            <div className="flex items-center justify-center mt-2 space-x-1">
              <Shell className="w-3 h-3 text-cyan-200" />
              <div className="w-1 h-1 bg-pink-300 rounded-full" />
              <Fish className="w-3 h-3 text-blue-200" />
              <div className="w-1 h-1 bg-pink-300 rounded-full" />
              <Shell className="w-3 h-3 text-cyan-200" />
            </div>
          </>
        )}
      </div>

      {/* Navigation */}
      <nav className={`relative z-10 flex-1 p-4 space-y-2 ${isCollapsed ? 'px-2' : ''}`}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMobileOpen(false)}
              className={`
                flex items-center rounded-xl transition-all duration-300 group relative overflow-hidden
                ${active 
                  ? 'bg-gradient-to-r from-cyan-500/40 to-pink-500/40 text-white shadow-lg backdrop-blur-sm border border-white/30' 
                  : 'text-cyan-50 hover:bg-gradient-to-r hover:from-cyan-500/20 hover:to-pink-500/20 hover:text-white'
                }
                ${isCollapsed ? 'justify-center p-3' : 'px-4 py-3'}
              `}
              title={isCollapsed ? item.label : undefined}
            >
              {active && (
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-xl" />
              )}
              <Icon className={`transition-transform group-hover:scale-110 ${active ? 'text-white' : 'text-cyan-100'} ${isCollapsed ? 'w-6 h-6' : 'w-5 h-5 mr-3'}`} />
              {!isCollapsed && (
                <span className="font-medium relative z-10">{item.label}</span>
              )}
              {active && !isCollapsed && (
                <div className="absolute right-3 w-2 h-2 bg-cyan-200 rounded-full animate-pulse" />
              )}
              {active && isCollapsed && (
                <div className="absolute right-2 top-2 w-1.5 h-1.5 bg-pink-300 rounded-full animate-pulse" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bouton de déconnexion */}
      <div className={`relative z-10 p-4 border-t border-white/20 ${isCollapsed ? 'px-2' : ''}`}>
        <Button
          onClick={handleLogout}
          variant="destructive"
          className={`bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white border-0 shadow-lg transition-all duration-300 hover:scale-105 ${isCollapsed ? 'w-12 h-12 p-0 justify-center' : 'w-full'}`}
          title={isCollapsed ? "Déconnexion" : undefined}
        >
          <LogOut className={`${isCollapsed ? 'w-5 h-5' : 'w-4 h-4 mr-2'}`} />
          {!isCollapsed && "Déconnexion"}
        </Button>
      </div>

      {/* Bouton pour réduire/agrandir sur desktop */}
      {!isCollapsed && (
        <button
          onClick={() => setIsDesktopCollapsed(true)}
          className="absolute top-4 -right-3 w-6 h-6 bg-gradient-to-r from-cyan-500 to-pink-500 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform duration-300 z-20"
          title="Réduire le menu"
        >
          <X className="w-3 h-3" />
        </button>
      )}
      
      {isCollapsed && (
        <button
          onClick={() => setIsDesktopCollapsed(false)}
          className="absolute top-4 -right-3 w-6 h-6 bg-gradient-to-r from-cyan-500 to-pink-500 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform duration-300 z-20"
          title="Agrandir le menu"
        >
          <Menu className="w-3 h-3" />
        </button>
      )}

      {/* Effet de profondeur en bas avec dégradé rose */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-blue-900/50 via-pink-900/30 to-transparent" />
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex h-screen fixed left-0 top-0 z-50 transition-all duration-500">
        <SidebarContent isCollapsed={isDesktopCollapsed} />
      </div>

      {/* Mobile Menu */}
      <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
        <SheetTrigger asChild>
          <Button 
            variant="outline" 
            size="icon"
            className="lg:hidden fixed top-4 left-4 z-50 bg-gradient-to-r from-cyan-500/90 to-pink-500/90 text-white border-0 shadow-lg hover:from-cyan-600 hover:to-pink-600"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-80 max-w-full">
          <VisuallyHidden>
            <SheetTitle>Menu de navigation</SheetTitle>
          </VisuallyHidden>
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Spacer pour desktop */}
      <div className={`hidden lg:block transition-all duration-500 ${isDesktopCollapsed ? 'w-20' : 'w-72'}`} />

      {/* Styles CSS personnalisés */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          33% {
            transform: translateY(-10px) rotate(1deg);
          }
          66% {
            transform: translateY(-5px) rotate(-1deg);
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </>
  );
};

export default AppSidebar;