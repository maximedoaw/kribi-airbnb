"use client";
import React, { useEffect, useMemo, useState } from "react";
import { collection, onSnapshot, query, where, Timestamp } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/config/firebase";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type Booking = {
  id: string;
  apartmentId: string;
  userId: string;
  dateDebut: Timestamp | Date;
  dateFin: Timestamp | Date;
  statut: "en cours" | "confirmé" | "annulé" | string;
};

const statusToVariant: Record<string, string> = {
  "en cours": "outline",
  "confirmé": "default",
  "annulé": "destructive",
};

export default function ReservationsHistory() {
  const [user, loadingAuth] = useAuthState(auth);
  const [bookings, setBookings] = useState<Booking[] | null>(null);

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, "bookings"),
      where("userId", "==", user.uid)
    );
    const unsub = onSnapshot(q, (snap) => {
      const items: Booking[] = [];
      snap.forEach((doc) => items.push({ id: doc.id, ...(doc.data() as any) }));
      setBookings(items);
    });
    return () => unsub();
  }, [user]);

  const isLoading = loadingAuth || bookings === null;

  const empty = useMemo(() => (bookings ?? []).length === 0, [bookings]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Historique des réservations</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="space-y-3">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        )}
        {!isLoading && empty && (
          <p className="text-sm text-muted-foreground">Aucune réservation trouvée.</p>
        )}
        {!isLoading && !empty && (
          <div className="grid gap-3">
            {(bookings ?? []).map((b) => {
              const start = b.dateDebut instanceof Timestamp ? b.dateDebut.toDate() : (b.dateDebut as Date);
              const end = b.dateFin instanceof Timestamp ? b.dateFin.toDate() : (b.dateFin as Date);
              const statusVariant = statusToVariant[b.statut] ?? "secondary";
              return (
                <div
                  key={b.id}
                  className="flex items-center justify-between rounded-md border p-3"
                >
                  <div className="space-y-1">
                    <p className="font-medium">Appartement: {b.apartmentId}</p>
                    <p className="text-sm text-muted-foreground">
                      {start?.toLocaleDateString()} → {end?.toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant={statusVariant as any}>{b.statut}</Badge>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}


