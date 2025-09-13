import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts"

const revenueData = [
  { month: "Jan", revenue: 2730000, bookings: 42, expenses: 1230000 },
  { month: "Fév", revenue: 3770000, bookings: 58, expenses: 1450000 },
  { month: "Mar", revenue: 3315000, bookings: 51, expenses: 1320000 },
  { month: "Avr", revenue: 4680000, bookings: 72, expenses: 1560000 },
  { month: "Mai", revenue: 5460000, bookings: 84, expenses: 1680000 },
  { month: "Juin", revenue: 5915000, bookings: 91, expenses: 1720000 },
]

export function RevenueChart() {
  return (
    <Card className="col-span-4 border-blue-100 shadow-sm">
      <CardHeader className="bg-blue-50 rounded-t-lg">
        <CardTitle className="text-blue-800">Revenus et Dépenses Mensuels</CardTitle>
      </CardHeader>
      <CardContent className="pt-6 pl-2">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="month" stroke="#64748b" />
            <YAxis stroke="#64748b" />
            <Tooltip formatter={(value) => [`${value.toLocaleString()} FCFA`, ""]} />
            <Legend />
            <Area type="monotone" dataKey="revenue" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} name="Revenus" />
            <Area
              type="monotone"
              dataKey="expenses"
              stroke="#ef4444"
              fill="#ef4444"
              fillOpacity={0.2}
              name="Dépenses"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
