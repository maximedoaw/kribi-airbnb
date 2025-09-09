'use client';

import BeachLoader from "@/components/beach-loader";
import CatalogTab from "@/components/home-screen/catalog-tab";
import { useApartments } from "@/hooks/use-apartments";

;

export default function CatalogPage() {
  const { apartments, loading } = useApartments();

  if (loading) {
    return <BeachLoader/>
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-orange-200/50 p-8">
      <CatalogTab apartments={apartments} />
    </div>
  );
}