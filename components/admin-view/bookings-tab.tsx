"use client"

import { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Apartment, Booking } from "@/types"

interface BookingsTabProps {
  bookings: Booking[]
  apartments: Apartment[]
  statusFilter: string
  dateFilter: string
}

export function BookingsTab({ bookings, apartments, statusFilter, dateFilter }: BookingsTabProps) {
  const filteredBookings = useMemo(() => {
    let result = bookings

    if (statusFilter !== "all") {
      result = result.filter((booking) => booking.status === statusFilter)
    }

    if (dateFilter !== "all") {
      const now = new Date()
      if (dateFilter === "today") {
        result = result.filter((booking) => new Date(booking.startDate).toDateString() === now.toDateString())
      } else if (dateFilter === "week") {
        const weekAgo = new Date(now.setDate(now.getDate() - 7))
        result = result.filter((booking) => new Date(booking.startDate) >= weekAgo)
      } else if (dateFilter === "month") {
        const monthAgo = new Date(now.setMonth(now.getMonth() - 1))
        result = result.filter((booking) => new Date(booking.startDate) >= monthAgo)
      }
    }

    return result
  }, [bookings, statusFilter, dateFilter])

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "completed":
        return "default"
      case "confirmed":
        return "default"
      case "pending":
        return "secondary"
      case "failed":
        return "destructive"
      case "cancelled":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Complété"
      case "confirmed":
        return "Confirmé"
      case "pending":
        return "En attente"
      case "failed":
        return "Échoué"
      case "cancelled":
        return "Annulé"
      default:
        return status
    }
  }

  return (
    <Card className="border-green-100 shadow-sm">
      <CardHeader className="bg-green-50 rounded-t-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle className="text-green-800">Gestion des Réservations</CardTitle>
            <CardDescription className="text-green-600">
              Liste de toutes les réservations en cours et passées
            </CardDescription>
          </div>
          <div className="mt-4 md:mt-0">
            <span className="text-sm text-green-700">{filteredBookings.length} réservation(s) trouvée(s)</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-green-50">
              <TableRow>
                <TableHead className="text-green-800">Client</TableHead>
                <TableHead className="text-green-800">Appartement</TableHead>
                <TableHead className="text-green-800">Période</TableHead>
                <TableHead className="text-green-800">Montant</TableHead>
                <TableHead className="text-green-800">Statut</TableHead>
                <TableHead className="text-right text-green-800">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBookings.map((booking) => (
                <TableRow key={booking.id} className="hover:bg-green-50/50">
                  <TableCell className="font-medium">User #{booking.userId.slice(0, 8)}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium text-gray-900">
                        {apartments.find((a) => a.id === booking.apartmentId)?.title || "Appartement inconnu"}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {apartments.find((a) => a.id === booking.apartmentId)?.location || "Localisation inconnue"}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {new Date(booking.startDate).toLocaleDateString()} -{" "}
                    {new Date(booking.endDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="font-medium text-green-700">
                    {apartments.find((a) => a.id === booking.apartmentId)
                      ? (apartments.find((a) => a.id === booking.apartmentId)!.price * 3).toLocaleString()
                      : "0"}{" "}
                    FCFA
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={getStatusBadgeVariant(booking.status)}
                      className={
                        booking.status === "confirmed"
                          ? "bg-green-100 text-green-800 hover:bg-green-100"
                          : booking.status === "pending"
                            ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                            : "bg-red-100 text-red-800 hover:bg-red-100"
                      }
                    >
                      {getStatusText(booking.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      className="mr-2 border-blue-300 text-blue-700 hover:bg-blue-50 bg-transparent"
                    >
                      Détails
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-red-300 text-red-700 hover:bg-red-50 bg-transparent"
                    >
                      Annuler
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredBookings.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Aucune réservation trouvée</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
