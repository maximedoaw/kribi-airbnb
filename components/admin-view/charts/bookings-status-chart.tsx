import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts"
import type { Booking } from "@/types"

interface BookingsStatusChartProps {
  bookings: Booking[]
}

const COLORS = ["#16a34a", "#ea580c", "#dc2626"] // Vert, Orange, Rouge

export function BookingsStatusChart({ bookings }: BookingsStatusChartProps) {
  const statusData = [
    {
      name: "Confirmées",
      value: bookings.filter((b) => b.status === "confirmed").length,
    },
    {
      name: "En attente",
      value: bookings.filter((b) => b.status === "pending").length,
    },
    {
      name: "Annulées",
      value: bookings.filter((b) => b.status === "cancelled").length,
    },
  ]

  return (
    <Card className="col-span-3 border-orange-100 shadow-sm">
      <CardHeader className="bg-orange-50 rounded-t-lg">
        <CardTitle className="text-orange-800">Réservations par Statut</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={statusData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {statusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
