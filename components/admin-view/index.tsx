"use client"

import type React from "react"

import { useState, useRef } from "react"
import type { Booking, Payment, UserData } from "@/types"
import { useApartments } from "@/hooks/use-apartments"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { AddApartmentDialog } from "./add-apartment-dialog"
import { OverviewTab } from "./overview-tab"
import { ApartmentsTab } from "./apartments-tab"
import { BookingsTab } from "./bookings-tab"
import { PaymentsTab } from "./payments-tab"
import { UsersTab } from "./users-tab"

interface AdminViewProps {
  bookings?: Booking[]
  payments?: Payment[]
  users?: UserData[]
  currentUserEmail?: string
}

const AdminView: React.FC<AdminViewProps> = ({
  bookings = [],
  payments = [],
  users = [],
  currentUserEmail = "admin@example.com",
}) => {
  const {
    apartments,
    loading,
    addApartment,
    updateApartment,
    deleteApartment,
    toggleAvailability,
    isUploading,
    currentUploads,
  } = useApartments()

  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [dateFilter, setDateFilter] = useState<string>("all")
  const [activeTab, setActiveTab] = useState("overview")
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Navigation tabs data
  const tabs = [
    { 
      id: "overview", 
      label: "Vue d'ensemble", 
      icon: "📊",
      color: "blue"
    },
    { 
      id: "apartments", 
      label: "Appartements", 
      icon: "🏠",
      color: "orange"
    },
    { 
      id: "bookings", 
      label: "Réservations", 
      icon: "📅",
      color: "green"
    },
    { 
      id: "payments", 
      label: "Paiements", 
      icon: "💳",
      color: "purple"
    },
    { 
      id: "users", 
      label: "Utilisateurs", 
      icon: "👥",
      color: "pink"
    }
  ]

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -200,
        behavior: 'smooth'
      })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 200,
        behavior: 'smooth'
      })
    }
  }

  const getColorClasses = (color: string, isActive: boolean) => {
    const colors = {
      blue: isActive 
        ? "bg-blue-600 text-white border-blue-600" 
        : "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100",
      orange: isActive 
        ? "bg-orange-600 text-white border-orange-600" 
        : "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100",
      green: isActive 
        ? "bg-green-600 text-white border-green-600" 
        : "bg-green-50 text-green-700 border-green-200 hover:bg-green-100",
      purple: isActive 
        ? "bg-purple-600 text-white border-purple-600" 
        : "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100",
      pink: isActive 
        ? "bg-pink-600 text-white border-pink-600" 
        : "bg-pink-50 text-pink-700 border-pink-200 hover:bg-pink-100"
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  // Fake data (same as before)
  const fakeBookings: Booking[] = [
    {
      id: "1",
      apartmentId: "1",
      userId: "user1",
      startDate: "2024-01-15",
      endDate: "2024-01-20",
      status: "confirmed",
    },
    {
      id: "2",
      apartmentId: "2",
      userId: "user2",
      startDate: "2024-01-18",
      endDate: "2024-01-25",
      status: "pending",
    },
    {
      id: "3",
      apartmentId: "3",
      userId: "user3",
      startDate: "2024-02-01",
      endDate: "2024-02-10",
      status: "cancelled",
    },
    {
      id: "4",
      apartmentId: "4",
      userId: "user4",
      startDate: "2024-01-22",
      endDate: "2024-01-28",
      status: "confirmed",
    },
    {
      id: "5",
      apartmentId: "5",
      userId: "user5",
      startDate: "2024-02-05",
      endDate: "2024-02-12",
      status: "pending",
    },
  ]

  const fakePayments: Payment[] = [
    {
      id: "pay1",
      userId: "user1",
      amount: 625000,
      date: "2024-01-10",
      status: "completed",
      bookingId: "1",
    },
    {
      id: "pay2",
      userId: "user2",
      amount: 375000,
      date: "2024-01-12",
      status: "pending",
      bookingId: "2",
    },
    {
      id: "pay3",
      userId: "user3",
      amount: 1100000,
      date: "2024-01-20",
      status: "failed",
      bookingId: "3",
    },
    {
      id: "pay4",
      userId: "user4",
      amount: 475000,
      date: "2024-01-18",
      status: "completed",
      bookingId: "4",
    },
    {
      id: "pay5",
      userId: "user5",
      amount: 225000,
      date: "2024-01-25",
      status: "pending",
      bookingId: "5",
    },
  ]

  const fakeUsers: UserData[] = [
    {
      uid: "user1",
      displayName: "Jean Dupont",
      email: "jean.dupont@example.com",
      role: "client",
      createdAt: new Date("2023-05-15"),
      photoURL: "/placeholder-user.jpg",
    },
    {
      uid: "user2",
      displayName: "Marie Lambert",
      email: "marie.lambert@example.com",
      role: "client",
      createdAt: new Date("2023-06-20"),
      phoneNumber: "+237 6XX XXX XXX",
    },
    {
      uid: "user3",
      displayName: "Admin System",
      email: "admin@example.com",
      role: "admin",
      createdAt: new Date("2023-01-10"),
      photoURL: "/placeholder-user.jpg",
    },
    {
      uid: "user4",
      displayName: "Paul Martin",
      email: "paul.martin@example.com",
      role: "client",
      createdAt: new Date("2023-08-05"),
      phoneNumber: "+237 6XX XXX XXX",
    },
    {
      uid: "user5",
      displayName: "Sophie Leroy",
      email: "sophie.leroy@example.com",
      role: "client",
      createdAt: new Date("2023-09-12"),
      photoURL: "/placeholder-user.jpg",
    },
  ]

  // Use fake data if props are empty
  const displayApartments = apartments
  const displayBookings = bookings.length > 0 ? bookings : fakeBookings
  const displayPayments = payments.length > 0 ? payments : fakePayments
  const displayUsers = users.length > 0 ? users : fakeUsers

  const handleDeleteApartment = async (id: string) => {
    try {
      await deleteApartment(id)
    } catch (error) {
      console.error("Erreur lors de la suppression de l'appartement:", error)
    }
  }

  const handleToggleAvailability = async (id: string) => {
    try {
      await toggleAvailability(id)
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'appartement:", error)
    }
  }

  const handleUpdateApartment = async (id: string, updates: any, newImages?: File[], imagesToDelete?: string[]) => {
    try {
      await updateApartment(id, updates, newImages, imagesToDelete)
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'appartement:", error)
    }
  }

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <OverviewTab
            apartments={displayApartments}
            bookings={displayBookings}
            payments={displayPayments}
            users={displayUsers}
          />
        )
      case "apartments":
        return (
          <ApartmentsTab
            apartments={displayApartments}
            searchTerm={searchTerm}
            loading={loading}
            onToggleAvailability={handleToggleAvailability}
            onDeleteApartment={handleDeleteApartment}
            onUpdateApartment={handleUpdateApartment}
          />
        )
      case "bookings":
        return (
          <BookingsTab
            bookings={displayBookings}
            apartments={displayApartments}
            statusFilter={statusFilter}
            dateFilter={dateFilter}
          />
        )
      case "payments":
        return <PaymentsTab payments={displayPayments} statusFilter={statusFilter} />
      case "users":
        return <UsersTab />
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-orange-600 bg-clip-text text-transparent">
            Espace Administration
          </h2>

          <AddApartmentDialog
            onAddApartment={addApartment}
            isUploading={isUploading}
            loading={loading}
            currentUploads={currentUploads}
          />
        </div>
      </div>

      {/* Carousel Navigation */}
      <div className="relative bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Scrollable Tabs Container */}
        <div
          ref={scrollContainerRef}
          className="flex gap-3 p-4 overflow-x-auto scrollbar-hide scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 font-medium text-sm
                  transition-all duration-200 whitespace-nowrap min-w-fit
                  ${getColorClasses(tab.color, isActive)}
                  ${isActive ? 'shadow-lg scale-105 transform' : 'shadow-sm hover:shadow-md hover:scale-102 transform'}
                `}
              >
                <span className="text-lg">{tab.icon}</span>
                <span className="font-semibold">{tab.label}</span>
                {isActive && (
                  <div className="w-2 h-2 rounded-full bg-current opacity-70"></div>
                )}
              </button>
            )
          })}
        </div>

        {/* Progress Indicator */}
        <div className="px-4 pb-2">
          <div className="flex justify-center gap-1">
            {tabs.map((tab, index) => (
              <div
                key={tab.id}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  activeTab === tab.id 
                    ? `bg-${tab.color}-600` 
                    : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="min-h-[600px] bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <div className="animate-in fade-in-0 duration-300">
          {renderContent()}
        </div>
      </div>

      {/* CSS pour masquer la scrollbar et styles personnalisés */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  )
}

export default AdminView