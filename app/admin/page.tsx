'use client';

import AdminView from "@/components/admin-view";
import BeachLoader from "@/components/beach-loader";
import { useApartments } from "@/hooks/use-apartments";
import { useBookings } from "@/hooks/use-bookings";
import { usePayments } from "@/hooks/use-payments";



export default function AdminPage() {
  const { apartments, loading: apartmentsLoading } = useApartments();
  const { bookings, loading: bookingsLoading } = useBookings();
  const { payments, loading: paymentsLoading } = usePayments();
  let currentUserEmail = process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAIL

  if (apartmentsLoading || bookingsLoading || paymentsLoading) {
    return <BeachLoader/>
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-orange-200/50 p-8">
      <AdminView currentUserEmail={currentUserEmail} />
    </div>
  );
}