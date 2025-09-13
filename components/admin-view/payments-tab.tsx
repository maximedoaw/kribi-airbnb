"use client"

import { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Payment } from "@/types"

interface PaymentsTabProps {
  payments: Payment[]
  statusFilter: string
}

export function PaymentsTab({ payments, statusFilter }: PaymentsTabProps) {
  const filteredPayments = useMemo(() => {
    let result = payments

    if (statusFilter !== "all") {
      result = result.filter((payment) => payment.status === statusFilter)
    }

    return result
  }, [payments, statusFilter])

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
    <Card className="border-purple-100 shadow-sm">
      <CardHeader className="bg-purple-50 rounded-t-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle className="text-purple-800">Gestion des Paiements</CardTitle>
            <CardDescription className="text-purple-600">Liste de toutes les transactions financières</CardDescription>
          </div>
          <div className="mt-4 md:mt-0">
            <span className="text-sm text-purple-700">{filteredPayments.length} paiement(s) trouvé(s)</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-purple-50">
              <TableRow>
                <TableHead className="text-purple-800">ID Transaction</TableHead>
                <TableHead className="text-purple-800">Client</TableHead>
                <TableHead className="text-purple-800">Montant</TableHead>
                <TableHead className="text-purple-800">Date</TableHead>
                <TableHead className="text-purple-800">Statut</TableHead>
                <TableHead className="text-right text-purple-800">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.map((payment) => (
                <TableRow key={payment.id} className="hover:bg-purple-50/50">
                  <TableCell className="font-medium text-purple-700">{payment.id.slice(0, 8)}...</TableCell>
                  <TableCell>User #{payment.userId.slice(0, 8)}</TableCell>
                  <TableCell className="font-medium text-green-700">{payment.amount.toLocaleString()} FCFA</TableCell>
                  <TableCell className="text-gray-600">{new Date(payment.date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge
                      variant={getStatusBadgeVariant(payment.status)}
                      className={
                        payment.status === "completed"
                          ? "bg-green-100 text-green-800 hover:bg-green-100"
                          : payment.status === "pending"
                            ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                            : "bg-red-100 text-red-800 hover:bg-red-100"
                      }
                    >
                      {getStatusText(payment.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-blue-300 text-blue-700 hover:bg-blue-50 bg-transparent"
                    >
                      Détails
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredPayments.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Aucun paiement trouvé</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
