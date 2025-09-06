'use client';

import BeachLoader from "@/components/beach-loader";
import AdminTab from "@/components/home-screen/admin-tab";
import { useApartments } from "@/hooks/use-apartments";
import { useBookings } from "@/hooks/use-bookings";
import { usePayments } from "@/hooks/use-payments";



export default function AdminPage() {
  const { apartments, loading: apartmentsLoading } = useApartments();
  const { bookings, loading: bookingsLoading } = useBookings();
  const { payments, loading: paymentsLoading } = usePayments();

  if (apartmentsLoading || bookingsLoading || paymentsLoading) {
    return <BeachLoader/>
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-orange-200/50 p-8">
      <AdminTab apartments={apartments} bookings={bookings} payments={payments} />
    </div>
  );
}