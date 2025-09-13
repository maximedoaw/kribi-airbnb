import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts"
import type { UserData } from "@/types"

interface UsersRoleChartProps {
  users: UserData[]
}

const ROLE_COLORS = ["#3b82f6", "#8b5cf6"] // Bleu, Violet

export function UsersRoleChart({ users }: UsersRoleChartProps) {
  const userRoleData = [
    {
      name: "Clients",
      value: users.filter((u) => u.role === "client").length,
    },
    {
      name: "Administrateurs",
      value: users.filter((u) => u.role === "admin").length,
    },
  ]

  return (
    <Card className="border-pink-100 shadow-sm">
      <CardHeader className="bg-pink-50 rounded-t-lg">
        <CardTitle className="text-pink-800">Répartition des Utilisateurs</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={userRoleData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {userRoleData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={ROLE_COLORS[index % ROLE_COLORS.length]} />
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
