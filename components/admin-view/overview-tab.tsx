import { StatsCards } from "./stats-cards"
import { RevenueChart } from "./charts/revenue-chart"
import { BookingsStatusChart } from "./charts/bookings-status-chart"
import { BookingsEvolutionChart } from "./charts/bookings-evolution-chart"
import { UsersRoleChart } from "./charts/users-role-chart"
import type { Apartment, Booking, Payment, UserData } from "@/types"

interface OverviewTabProps {
  apartments: Apartment[]
  bookings: Booking[]
  payments: Payment[]
  users: UserData[]
}

export function OverviewTab({ apartments, bookings, payments, users }: OverviewTabProps) {
  return (
    <div className="space-y-6">
      <StatsCards apartments={apartments} bookings={bookings} payments={payments} users={users} />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <RevenueChart />
        <BookingsStatusChart bookings={bookings} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <BookingsEvolutionChart />
        <UsersRoleChart users={users} />
      </div>
    </div>
  )
}
