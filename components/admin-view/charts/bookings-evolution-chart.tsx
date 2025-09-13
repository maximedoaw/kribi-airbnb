import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts"

const revenueData = [
  { month: "Jan", revenue: 2730000, bookings: 42, expenses: 1230000 },
  { month: "Fév", revenue: 3770000, bookings: 58, expenses: 1450000 },
  { month: "Mar", revenue: 3315000, bookings: 51, expenses: 1320000 },
  { month: "Avr", revenue: 4680000, bookings: 72, expenses: 1560000 },
  { month: "Mai", revenue: 5460000, bookings: 84, expenses: 1680000 },
  { month: "Juin", revenue: 5915000, bookings: 91, expenses: 1720000 },
]

export function BookingsEvolutionChart() {
  return (
    <Card className="border-green-100 shadow-sm">
      <CardHeader className="bg-green-50 rounded-t-lg">
        <CardTitle className="text-green-800">Évolution des Réservations</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="month" stroke="#64748b" />
            <YAxis stroke="#64748b" />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="bookings"
              stroke="#ea580c"
              strokeWidth={3}
              activeDot={{ r: 8, fill: "#ea580c" }}
              name="Réservations"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
