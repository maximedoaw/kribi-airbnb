'use client';

import BeachLoader from '@/components/beach-loader';
import BookingsTab from '@/components/home-screen/bookings-tab';
import { useAuth } from '@/hooks/use-auth';
import { useBookings } from '@/hooks/use-bookings';

export default function BookingsPage() {
  const { currentUser, loading: authLoading } = useAuth();
  const { bookings, loading: bookingsLoading } = useBookings(currentUser?.uid);

  if (authLoading || bookingsLoading) {
    return <BeachLoader/>
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-orange-200/50 p-8">
      <BookingsTab bookings={bookings} />
    </div>
  );
}