'use client';

import BeachLoader from "@/components/beach-loader";
import StatsTab from "@/components/home-screen/stats-tab";
import { useAuth } from "@/hooks/use-auth";
import { useBookings } from "@/hooks/use-bookings";
import { usePayments } from "@/hooks/use-payments";



export default function StatsPage() {
  const { currentUser, loading: authLoading } = useAuth();
  const { bookings, loading: bookingsLoading } = useBookings(currentUser?.uid);
  const { payments, loading: paymentsLoading } = usePayments(currentUser?.uid);

  if (authLoading || bookingsLoading || paymentsLoading) {
    return <BeachLoader/>
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-orange-200/50 p-8">
      <StatsTab payments={payments} bookings={bookings} />
    </div>
  );
}