"use client";
import React, { useEffect, useMemo, useState } from "react";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Star } from "lucide-react";
import BeachLoader from "@/components/beach-loader";
import KribiAnimations from "@/components/kribi-animations";

type Apartment = {
  id: string;
  titre: string;
  description: string;
  prix: number;
  localisation: string;
  photos?: string[];
  disponibilite: "disponible" | "indisponible" | string;
  note?: number; // 0..5
};

export default function Catalogue() {
  const [apartments, setApartments] = useState<Apartment[] | null>(null);

  useEffect(() => {
    const q = query(collection(db, "apartments"));
    const unsub = onSnapshot(q, (snap) => {
      const items: Apartment[] = [];
      snap.forEach((doc) => items.push({ id: doc.id, ...(doc.data() as any) }));
      setApartments(items);
    });
    return () => unsub();
  }, []);

  const isLoading = apartments === null;
  const empty = useMemo(() => (apartments ?? []).length === 0, [apartments]);
  const demo = !isLoading && empty;

  return (
    <KribiAnimations>
      <div className="w-full">
        <div className="mb-8 animate-on-scroll">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent mb-2">
            🏖️ Catalogue des appartements Kribi
          </h2>
          <p className="text-gray-600">Découvrez nos magnifiques appartements face à l'océan</p>
        </div>
        {isLoading && (
          <BeachLoader size="lg" className="min-h-64" />
        )}
        {!isLoading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {(demo
              ? [
                  { id: 'd1', titre: 'Kribi Beach House', description: 'Vue sur mer, 2 chambres, wifi.', prix: 55250, localisation: 'Kribi', photos: ['/window.svg'], disponibilite: 'disponible', note: 4.7 },
                  { id: 'd2', titre: 'Garden Villa', description: 'Jardin privé, 3 chambres, parking.', prix: 78000, localisation: 'Kribi', photos: ['/globe.svg'], disponibilite: 'indisponible', note: 4.3 },
                  { id: 'd3', titre: 'City Studio', description: 'Studio moderne au centre-ville.', prix: 35750, localisation: 'Kribi', photos: ['/next.svg'], disponibilite: 'disponible', note: 4.9 },
                ]
              : (apartments ?? [])
            ).map((a, index) => (
              <div key={a.id} className="overflow-hidden rounded-xl border border-orange-200 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-orange-50 animate-on-scroll hover:scale-105" style={{ animationDelay: `${index * 0.1}s` }}>
                {a.photos?.[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={a.photos[0]} alt={a.titre} className="h-40 w-full object-cover" />
                ) : (
                  <div className="h-40 w-full bg-gradient-to-br from-blue-200 to-orange-200 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-300/30 to-orange-300/30"></div>
                    <span className="text-orange-600 font-semibold text-lg relative z-10">🏖️ Vue sur mer</span>
                    <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-blue-400/20 to-transparent"></div>
                  </div>
                )}
                <div className="space-y-3 p-5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-gray-800 text-lg">{a.titre}</h3>
                    <Badge variant={a.disponibilite === "disponible" ? "default" : "secondary"} className={a.disponibilite === "disponible" ? "bg-green-500 hover:bg-green-600 text-white" : "bg-gray-400"}>
                      {a.disponibilite === "disponible" ? "✅ Disponible" : "❌ Indisponible"}
                    </Badge>
                  </div>
                  <p className="line-clamp-2 text-sm text-gray-600 leading-relaxed">{a.description}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-bold text-orange-600 text-lg">{a.prix.toLocaleString()} FCFA / nuit</span>
                    <span className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-full">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-gray-700 font-medium">{a.note ?? 0}</span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-blue-600 font-medium flex items-center">
                      <span className="mr-1">📍</span>{a.localisation}
                    </p>
                    <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-orange-500 text-white rounded-lg hover:from-blue-600 hover:to-orange-600 transition-all duration-300 text-sm font-medium">
                      Réserver
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </KribiAnimations>
  );
}


