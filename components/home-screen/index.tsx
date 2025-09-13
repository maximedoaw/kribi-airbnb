'use client';

import { useApartments } from '@/hooks/use-apartments';
import { useAuth } from '@/hooks/use-auth';
import { useBookings } from '@/hooks/use-bookings';
import { usePayments } from '@/hooks/use-payments';
import { useState } from 'react';
import DashboardTab from './dashboard-tab';
import BookingsTab from './bookings-tab';
import CatalogTab from './catalog-tab';
import StatsTab from './stats-tab';
import BeachLoader from '@/components/beach-loader';
import AdminView from '../admin-view';

const HomeScreen = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { currentUser } = useAuth();
  const { bookings } = useBookings(currentUser?.uid);
  const { payments } = usePayments(currentUser?.uid);
  const { apartments } = useApartments();

  const renderTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardTab currentUser={currentUser}/>;
      case 'bookings':
        return <BookingsTab />;
      case 'catalog':
        return <CatalogTab apartments={apartments} />;
      case 'stats':
        return <StatsTab payments={payments} bookings={bookings} />;
      case 'admin':
        return <AdminView />;
      default:
        return <DashboardTab bookings={bookings} payments={payments} currentUser={currentUser} />;
    }
  };

  const isLoading = !currentUser || bookings === undefined;

  if (isLoading) {
    return <BeachLoader size="lg" className="min-h-96" />;
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-orange-200/50 p-8">
      {renderTab()}
    </div>
  );
};

export default HomeScreen;