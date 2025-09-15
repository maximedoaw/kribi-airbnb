"use client";

import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";
import { Booking } from "@/types";
import KribiAnimations from "@/components/kribi-animations";
import {
  MapPin,
  Calendar,
  Star,
  Clock,
  CheckCircle,
  XCircle,
  Filter,
  Search,
  Eye,
  Download,
  ChevronDown,
  ChevronUp,
  Grid,
  Table,
  Trash2,
  Ban,
  CheckSquare,
  Home,
  CreditCard,
  Mail,
  Phone,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useBookings } from "@/hooks/use-bookings";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import BeachLoader from "../beach-loader";
import Link from "next/link";
import { generateInvoice } from "@/lib/utils";

const BookingsTab = () => {
  const [user, authLoading] = useAuthState(auth);
  const [filter, setFilter] = useState<
    "all" | "confirmed" | "pending" | "cancelled"
  >("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedBooking, setExpandedBooking] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [selectedBookings, setSelectedBookings] = useState<string[]>([]);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const {
    bookings,
    loading,
    error,
    confirmBooking,
    cancelBooking,
    deleteBooking,
    canCancelBooking,
  } = useBookings();

  // Filtrer les réservations
  const filteredBookings = bookings.filter((booking) => {
    const matchesStatus = filter === "all" || booking.status === filter;
    const matchesSearch =
      searchTerm === "" ||
      booking.apartment?.title
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      booking.apartment?.location
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBookings = filteredBookings.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const confirmedBookings = bookings.filter(
    (b) => b.status === "confirmed"
  ).length;
  const pendingBookings = bookings.filter((b) => b.status === "pending").length;
  const cancelledBookings = bookings.filter(
    (b) => b.status === "cancelled"
  ).length;

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-gradient-to-r from-amber-50 to-amber-100 text-amber-800 border border-amber-200 shadow-sm";
      case "confirmed":
        return "bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-800 border border-emerald-200 shadow-sm";
      case "cancelled":
        return "bg-gradient-to-r from-rose-50 to-rose-100 text-rose-800 border border-rose-200 shadow-sm";
      default:
        return "bg-gradient-to-r from-slate-50 to-slate-100 text-slate-800 border border-slate-200 shadow-sm";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "confirmed":
        return <CheckCircle className="w-4 h-4" />;
      case "cancelled":
        return <XCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return "N/A";
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return format(dateObj, "dd MMM yyyy", { locale: fr });
  };

  const calculateNights = (
    startDate: string | Date | undefined,
    endDate: string | Date | undefined
  ) => {
    if (!startDate || !endDate) return 0;
    const start =
      typeof startDate === "string" ? new Date(startDate) : startDate;
    const end = typeof endDate === "string" ? new Date(endDate) : endDate;
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const calculateTotalPrice = (booking: Booking) => {
    if (!booking.apartment?.price) return 0;
    const nights = calculateNights(booking.startDate, booking.endDate);
    return booking.apartment.price * nights;
  };

  const toggleBookingExpansion = (bookingId: string) => {
    setExpandedBooking(expandedBooking === bookingId ? null : bookingId);
  };

  const handleConfirmBooking = async (bookingId: string) => {
    setActionLoading(bookingId);
    try {
      await confirmBooking(bookingId);
    } catch (error) {
      console.error("Erreur lors de la confirmation:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    setActionLoading(bookingId);
    try {
      await cancelBooking(bookingId);
    } catch (error: any) {
      console.error("Erreur lors de l'annulation:", error);
      alert(error.message || "Impossible d'annuler la réservation");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteBooking = async (bookingId: string) => {
    if (!canCancelBooking(bookingId)) {
      alert("Impossible de supprimer cette réservation après 48 heures");
      return;
    }

    if (
      !window.confirm("Êtes-vous sûr de vouloir supprimer cette réservation ?")
    ) {
      return;
    }

    setActionLoading(bookingId);
    try {
      await deleteBooking(bookingId);
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDownloadInvoice = async (booking: Booking) => {
    try {
      await generateInvoice(booking);
    } catch (error) {
      console.error("Erreur lors de la génération de la facture:", error);
      alert("Erreur lors de la génération de la facture");
    }
  };

  const toggleSelectBooking = (bookingId: string) => {
    setSelectedBookings((prev) =>
      prev.includes(bookingId)
        ? prev.filter((id) => id !== bookingId)
        : [...prev, bookingId]
    );
  };

  const selectAllBookings = () => {
    if (selectedBookings.length === filteredBookings.length) {
      setSelectedBookings([]);
    } else {
      setSelectedBookings(filteredBookings.map((b) => b.id));
    }
  };

  const deleteSelectedBookings = async () => {
    // Vérifier si toutes les réservations peuvent être supprimées
    const canDeleteAll = selectedBookings.every(canCancelBooking);
    if (!canDeleteAll) {
      alert(
        "Certaines réservations ne peuvent pas être supprimées après 48 heures"
      );
      return;
    }

    if (
      !window.confirm(
        `Êtes-vous sûr de vouloir supprimer ${selectedBookings.length} réservation(s) ?`
      )
    ) {
      return;
    }

    try {
      await Promise.all(selectedBookings.map((id) => deleteBooking(id)));
      setSelectedBookings([]);
    } catch (error) {
      console.error("Erreur lors de la suppression multiple:", error);
    }
  };

  if (authLoading || loading) {
    return <BeachLoader />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/50 flex items-center justify-center">
        <div className="text-center p-8 bg-white/80 rounded-2xl shadow-lg">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Erreur de chargement
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <KribiAnimations>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/50 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-cyan-400/10 rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-amber-400/5 to-orange-400/5 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "4s" }}
          ></div>
        </div>

        {/* Header Section */}
        <div className="relative mb-4 lg:mb-8 animate-on-scroll">
          <div className="relative mx-3 sm:mx-4 lg:mx-8 mt-4 lg:mt-8">
            <div className="relative bg-gradient-to-r from-slate-900 via-blue-900 to-cyan-800 rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl overflow-hidden border border-white/10">
              {/* Animated background elements */}
              <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] animate-pulse"></div>
              <div className="absolute top-0 right-0 w-64 h-64 lg:w-96 lg:h-96 bg-gradient-to-bl from-blue-500/10 via-cyan-500/5 to-transparent rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 lg:w-80 lg:h-80 bg-gradient-to-tr from-purple-500/10 via-pink-500/5 to-transparent rounded-full blur-3xl"></div>

              <div className="relative z-10">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4 lg:mb-8">
                  <div className="flex-1 mb-4 lg:mb-0">
                    <div className="flex items-center mb-3 lg:mb-4">
                      <div className="w-10 h-10 lg:w-14 lg:h-14 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center mr-3 lg:mr-4 shadow-lg">
                        <Calendar className="w-5 h-5 lg:w-7 lg:h-7 text-white" />
                      </div>
                      <div>
                        <h1 className="text-xl lg:text-4xl font-black text-white mb-1">
                          Mes Réservations
                        </h1>
                        <div className="flex items-center text-cyan-200 text-xs lg:text-sm">
                          <span className="font-medium">
                            Historique complet de vos séjours
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white/10 backdrop-blur-xl rounded-xl p-3 lg:p-4 border border-white/20">
                      <p className="text-white text-sm lg:text-lg font-semibold mb-1">
                        Bonjour,{" "}
                        <span className="text-cyan-300 font-black">
                          {user?.displayName || user?.email?.split("@")[0]} 👋
                        </span>
                      </p>
                      <p className="text-white/80 text-xs lg:text-sm">
                        {bookings.length} réservation(s) au total
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between lg:justify-end space-x-4">
                    <div className="text-left lg:text-right">
                      <p className="text-white font-bold text-sm lg:text-lg">
                        {bookings.length} Séjours
                      </p>
                      <p className="text-cyan-300 text-xs lg:text-sm">
                        depuis {new Date().getFullYear()}
                      </p>
                    </div>
                    <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-amber-400 via-orange-500 to-pink-500 rounded-xl flex items-center justify-center shadow-xl">
                      <span className="text-white font-black text-base lg:text-xl">
                        {(
                          user?.displayName?.[0] ||
                          user?.email?.[0] ||
                          "U"
                        ).toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-3 gap-2 lg:gap-4">
                  <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-2.5 lg:p-3 text-center">
                    <div className="flex items-center justify-center mb-1 lg:mb-2">
                      <CheckCircle className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-emerald-300" />
                    </div>
                    <span className="text-white text-xs lg:text-sm font-medium">
                      {confirmedBookings}
                    </span>
                  </div>
                  <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-2.5 lg:p-3 text-center">
                    <div className="flex items-center justify-center mb-1 lg:mb-2">
                      <Clock className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-amber-300" />
                    </div>
                    <span className="text-white text-xs lg:text-sm font-medium">
                      {pendingBookings}
                    </span>
                  </div>
                  <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-2.5 lg:p-3 text-center">
                    <div className="flex items-center justify-center mb-1 lg:mb-2">
                      <XCircle className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-rose-300" />
                    </div>
                    <span className="text-white text-xs lg:text-sm font-medium">
                      {cancelledBookings}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-3 sm:px-4 lg:px-8 pb-6 lg:pb-16">
          {/* Filters and Search */}
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-2xl p-4 lg:p-6 border border-white/30 mb-4 lg:mb-8 animate-on-scroll">
            <div className="flex flex-col space-y-3 lg:space-y-4">
              {/* View Mode Toggle and Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2.5 rounded-xl transition-all duration-300 ${
                      viewMode === "grid"
                        ? "bg-blue-600 text-white shadow-lg"
                        : "bg-white/60 text-gray-600 hover:bg-white/90"
                    }`}
                  >
                    <Grid className="w-4 h-4 lg:w-5 lg:h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode("table")}
                    className={`p-2.5 rounded-xl transition-all duration-300 ${
                      viewMode === "table"
                        ? "bg-blue-600 text-white shadow-lg"
                        : "bg-white/60 text-gray-600 hover:bg-white/90"
                    }`}
                  >
                    <Table className="w-4 h-4 lg:w-5 lg:h-5" />
                  </button>
                </div>

                {selectedBookings.length > 0 && (
                  <button
                    onClick={deleteSelectedBookings}
                    className="flex items-center space-x-2 bg-rose-600 text-white px-3 py-2 rounded-xl font-medium text-sm hover:bg-rose-700 transition-colors"
                    disabled={!selectedBookings.every(canCancelBooking)}
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Supprimer ({selectedBookings.length})</span>
                  </button>
                )}
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 lg:w-5 lg:h-5" />
                <input
                  type="text"
                  placeholder="Rechercher un séjour..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 lg:pl-10 pr-4 py-2.5 lg:py-3 bg-white/60 backdrop-blur-sm rounded-xl border border-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 text-sm lg:text-base"
                />
              </div>

              {/* Filter Toggle for Mobile */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-4 py-2.5 rounded-xl font-medium text-sm"
              >
                <Filter className="w-4 h-4" />
                <span>Filtres</span>
                {showFilters ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>

              {/* Filters */}
              <div className={`${showFilters ? "block" : "hidden"} lg:block`}>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setFilter("all")}
                    className={`px-3 py-2 lg:px-4 lg:py-2.5 rounded-xl font-medium text-sm transition-all duration-300 ${
                      filter === "all"
                        ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg"
                        : "bg-white/60 text-gray-700 hover:bg-white/90"
                    }`}
                  >
                    Toutes
                  </button>
                  <button
                    onClick={() => setFilter("confirmed")}
                    className={`px-3 py-2 lg:px-4 lg:py-2.5 rounded-xl font-medium text-sm transition-all duration-300 flex items-center space-x-2 ${
                      filter === "confirmed"
                        ? "bg-gradient-to-r from-emerald-600 to-green-500 text-white shadow-lg"
                        : "bg-white/60 text-gray-700 hover:bg-white/90"
                    }`}
                  >
                    <CheckCircle className="w-3 h-3 lg:w-4 lg:h-4" />
                    <span>Confirmées</span>
                  </button>
                  <button
                    onClick={() => setFilter("pending")}
                    className={`px-3 py-2 lg:px-4 lg:py-2.5 rounded-xl font-medium text-sm transition-all duration-300 flex items-center space-x-2 ${
                      filter === "pending"
                        ? "bg-gradient-to-r from-amber-600 to-yellow-500 text-white shadow-lg"
                        : "bg-white/60 text-gray-700 hover:bg-white/90"
                    }`}
                  >
                    <Clock className="w-3 h-3 lg:w-4 lg:h-4" />
                    <span>En attente</span>
                  </button>
                  <button
                    onClick={() => setFilter("cancelled")}
                    className={`px-3 py-2 lg:px-4 lg:py-2.5 rounded-xl font-medium text-sm transition-all duration-300 flex items-center space-x-2 ${
                      filter === "cancelled"
                        ? "bg-gradient-to-r from-rose-600 to-pink-500 text-white shadow-lg"
                        : "bg-white/60 text-gray-700 hover:bg-white/90"
                    }`}
                  >
                    <XCircle className="w-3 h-3 lg:w-4 lg:h-4" />
                    <span>Annulées</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Bookings Content */}
          {viewMode === "grid" ? (
            /* Grid View - Optimisé pour mobile et desktop */
            <div className="space-y-3 lg:space-y-4">
              {paginatedBookings.length > 0 ? (
                paginatedBookings.map((booking, index) => (
                  <div
                    key={booking.id}
                    className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden border border-white/40 animate-on-scroll"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {/* Mobile Card Layout */}
                    <div className="lg:hidden">
                      {/* Card Header */}
                      <div
                        className="p-4 cursor-pointer"
                        onClick={() => toggleBookingExpansion(booking.id)}
                      >
                        <div className="flex items-start space-x-3">
                          {/* Image */}
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-400 via-cyan-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg overflow-hidden flex-shrink-0">
                            {booking.apartment?.images?.[0] ? (
                              <img
                                src={booking.apartment.images[0]}
                                alt={booking.apartment.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Home className="w-6 h-6" />
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="font-bold text-gray-900 text-sm leading-tight pr-2 line-clamp-2">
                                {booking.apartment?.title ||
                                  "Appartement Kribi"}
                              </h3>
                              {expandedBooking === booking.id ? (
                                <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
                              ) : (
                                <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                              )}
                            </div>

                            <div className="flex items-center text-gray-500 mb-2">
                              <MapPin className="w-3 h-3 mr-1 text-cyan-500 flex-shrink-0" />
                              <span className="text-xs truncate">
                                {booking.apartment?.location ||
                                  "Kribi Ocean Resort"}
                              </span>
                            </div>

                            <div className="flex items-center justify-between mt-2">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-bold flex items-center space-x-1 flex-shrink-0 ${getStatusBadgeClass(
                                  booking.status
                                )}`}
                              >
                                {getStatusIcon(booking.status)}
                                <span>
                                  {booking.status === "pending" && "En attente"}
                                  {booking.status === "confirmed" && "Confirmé"}
                                  {booking.status === "cancelled" && "Annulé"}
                                </span>
                              </span>
                              <div className="text-xs text-gray-600 font-medium flex-shrink-0 ml-2">
                                {calculateNights(
                                  booking.startDate,
                                  booking.endDate
                                )}{" "}
                                nuit(s)
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Quick Info Mobile */}
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <div className="flex items-center justify-between text-xs text-gray-600">
                            <span>
                              {formatDate(booking.startDate)} -{" "}
                              {formatDate(booking.endDate)}
                            </span>
                            <span className="font-semibold text-gray-900">
                              {calculateTotalPrice(booking).toLocaleString()}{" "}
                              FCFA
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Expanded Details Mobile */}
                      {expandedBooking === booking.id && (
                        <div className="px-4 pb-4 border-t border-gray-100 bg-gray-50/50">
                          <div className="pt-3 space-y-3">
                            <div className="grid grid-cols-2 gap-2">
                              <div className="bg-white rounded-lg p-3 border border-gray-200">
                                <p className="text-xs text-gray-500 mb-1">
                                  Arrivée
                                </p>
                                <p className="font-medium text-xs">
                                  {formatDate(booking.startDate)}
                                </p>
                              </div>
                              <div className="bg-white rounded-lg p-3 border border-gray-200">
                                <p className="text-xs text-gray-500 mb-1">
                                  Départ
                                </p>
                                <p className="font-medium text-xs">
                                  {formatDate(booking.endDate)}
                                </p>
                              </div>
                            </div>

                            <div className="bg-cyan-50 rounded-lg p-3 border border-cyan-200">
                              <p className="text-xs text-gray-600 mb-1">
                                Prix total
                              </p>
                              <p className="font-bold text-sm text-gray-900">
                                {calculateTotalPrice(booking).toLocaleString()}{" "}
                                FCFA
                              </p>
                            </div>

                            {/* Actions Mobile */}
                            <div className="grid grid-cols-2 gap-2">
                              <button className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-3 py-2 rounded-lg font-medium text-xs shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center">
                                <Eye className="w-3 h-3 mr-1" />
                                Détails
                              </button>

                              {booking.status === "confirmed" && (
                                <button
                                  onClick={() => handleDownloadInvoice(booking)}
                                  className="bg-gradient-to-r from-emerald-600 to-green-500 text-white px-3 py-2 rounded-lg font-medium text-xs shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center"
                                >
                                  <Download className="w-3 h-3 mr-1" />
                                  Facture
                                </button>
                              )}
                            </div>

                            {/* Status Actions Mobile */}
                            <div className="flex gap-2">
                              {booking.status === "pending" && (
                                <>
                                  <button
                                    onClick={() =>
                                      handleConfirmBooking(booking.id)
                                    }
                                    disabled={actionLoading === booking.id}
                                    className="flex-1 bg-emerald-600 text-white px-3 py-2 rounded-lg font-medium text-xs hover:bg-emerald-700 transition-colors disabled:opacity-50 flex items-center justify-center"
                                  >
                                    {actionLoading === booking.id
                                      ? "..."
                                      : "Confirmer"}
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleCancelBooking(booking.id)
                                    }
                                    disabled={actionLoading === booking.id}
                                    className="flex-1 bg-amber-600 text-white px-3 py-2 rounded-lg font-medium text-xs hover:bg-amber-700 transition-colors disabled:opacity-50 flex items-center justify-center"
                                  >
                                    {actionLoading === booking.id
                                      ? "..."
                                      : "Annuler"}
                                  </button>
                                </>
                              )}
                              {booking.status === "confirmed" &&
                                canCancelBooking(booking.id) && (
                                  <button
                                    onClick={() =>
                                      handleCancelBooking(booking.id)
                                    }
                                    disabled={actionLoading === booking.id}
                                    className="flex-1 bg-rose-600 text-white px-3 py-2 rounded-lg font-medium text-xs hover:bg-rose-700 transition-colors disabled:opacity-50 flex items-center justify-center"
                                  >
                                    {actionLoading === booking.id
                                      ? "..."
                                      : "Annuler"}
                                  </button>
                                )}
                              <button
                                onClick={() => handleDeleteBooking(booking.id)}
                                disabled={
                                  actionLoading === booking.id ||
                                  !canCancelBooking(booking.id)
                                }
                                className="bg-gray-500 text-white px-3 py-2 rounded-lg font-medium text-xs hover:bg-gray-600 transition-colors disabled:opacity-50 flex items-center justify-center"
                                title={
                                  !canCancelBooking(booking.id)
                                    ? "Impossible de supprimer après 48 heures"
                                    : "Supprimer"
                                }
                              >
                                {actionLoading === booking.id
                                  ? "..."
                                  : "Supprimer"}
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Desktop Card Layout */}
                    <div className="hidden lg:block">
                      <div
                        className="p-6 cursor-pointer"
                        onClick={() => toggleBookingExpansion(booking.id)}
                      >
                        <div className="flex items-start space-x-6">
                          {/* Image Desktop */}
                          <div className="w-24 h-24 bg-gradient-to-br from-blue-400 via-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center text-white font-bold shadow-lg overflow-hidden flex-shrink-0">
                            {booking.apartment?.images?.[0] ? (
                              <img
                                src={booking.apartment.images[0]}
                                alt={booking.apartment.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Home className="w-8 h-8" />
                            )}
                          </div>

                          {/* Content Desktop */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-3">
                              <h3 className="font-bold text-gray-900 text-xl mb-2 line-clamp-2 pr-4">
                                {booking.apartment?.title ||
                                  "Appartement Kribi"}
                              </h3>
                              {expandedBooking === booking.id ? (
                                <ChevronUp className="w-6 h-6 text-gray-400" />
                              ) : (
                                <ChevronDown className="w-6 h-6 text-gray-400" />
                              )}
                            </div>

                            <div className="flex items-center text-gray-600 mb-4">
                              <MapPin className="w-5 h-5 mr-2 text-cyan-500 flex-shrink-0" />
                              <span className="text-base truncate">
                                {booking.apartment?.location ||
                                  "Kribi Ocean Resort"}
                              </span>
                            </div>

                            <div className="flex flex-wrap items-center gap-4 mb-4">
                              <div className="flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-full">
                                <Star className="w-4 h-4 text-amber-400 fill-current" />
                                <span className="text-sm font-medium text-gray-700">
                                  {booking.apartment?.rating || 4.5}
                                </span>
                              </div>

                              <span
                                className={`px-4 py-2 rounded-full text-sm font-bold flex items-center space-x-2 ${getStatusBadgeClass(
                                  booking.status
                                )}`}
                              >
                                {getStatusIcon(booking.status)}
                                <span>
                                  {booking.status === "pending" && "En attente"}
                                  {booking.status === "confirmed" && "Confirmé"}
                                  {booking.status === "cancelled" && "Annulé"}
                                </span>
                              </span>
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="text-base text-gray-600">
                                {formatDate(booking.startDate)} -{" "}
                                {formatDate(booking.endDate)}
                              </div>
                              <div className="text-right">
                                <div className="text-sm text-gray-500">
                                  {calculateNights(
                                    booking.startDate,
                                    booking.endDate
                                  )}{" "}
                                  nuit(s)
                                </div>
                                <div className="text-lg font-bold text-gray-900">
                                  {calculateTotalPrice(
                                    booking
                                  ).toLocaleString()}{" "}
                                  FCFA
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Expanded Details Desktop */}
                      {expandedBooking === booking.id && (
                        <div className="px-6 pb-6 border-t border-gray-100 bg-gray-50/30">
                          <div className="pt-6 space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                              <div className="bg-white rounded-xl p-4 border border-gray-200">
                                <p className="text-sm text-gray-600 mb-2">
                                  Arrivée
                                </p>
                                <p className="font-bold text-base">
                                  {formatDate(booking.startDate)}
                                </p>
                              </div>
                              <div className="bg-white rounded-xl p-4 border border-gray-200">
                                <p className="text-sm text-gray-600 mb-2">
                                  Départ
                                </p>
                                <p className="font-bold text-base">
                                  {formatDate(booking.endDate)}
                                </p>
                              </div>
                              <div className="bg-cyan-50 rounded-xl p-4 border border-cyan-200">
                                <p className="text-sm text-gray-600 mb-2">
                                  Prix total
                                </p>
                                <p className="font-bold text-lg text-gray-900">
                                  {calculateTotalPrice(
                                    booking
                                  ).toLocaleString()}{" "}
                                  FCFA
                                </p>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-3">
                              <button className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-4 py-2.5 rounded-xl font-medium text-sm shadow-lg hover:shadow-xl transition-all duration-300 flex items-center">
                                <Eye className="w-4 h-4 mr-2" />
                                Voir les détails
                              </button>

                              {booking.status === "confirmed" && (
                                <button
                                  onClick={() => handleDownloadInvoice(booking)}
                                  className="bg-gradient-to-r from-emerald-600 to-green-500 text-white px-4 py-2.5 rounded-xl font-medium text-sm shadow-lg hover:shadow-xl transition-all duration-300 flex items-center"
                                >
                                  <Download className="w-4 h-4 mr-2" />
                                  Télécharger facture
                                </button>
                              )}

                              {booking.status === "pending" && (
                                <>
                                  <button
                                    onClick={() =>
                                      handleConfirmBooking(booking.id)
                                    }
                                    disabled={actionLoading === booking.id}
                                    className="bg-emerald-600 text-white px-4 py-2.5 rounded-xl font-medium text-sm hover:bg-emerald-700 transition-colors disabled:opacity-50 flex items-center"
                                  >
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    {actionLoading === booking.id
                                      ? "Confirmation..."
                                      : "Confirmer"}
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleCancelBooking(booking.id)
                                    }
                                    disabled={actionLoading === booking.id}
                                    className="bg-amber-600 text-white px-4 py-2.5 rounded-xl font-medium text-sm hover:bg-amber-700 transition-colors disabled:opacity-50 flex items-center"
                                  >
                                    <Clock className="w-4 h-4 mr-2" />
                                    {actionLoading === booking.id
                                      ? "Annulation..."
                                      : "Annuler"}
                                  </button>
                                </>
                              )}
                              {booking.status === "confirmed" &&
                                canCancelBooking(booking.id) && (
                                  <button
                                    onClick={() =>
                                      handleCancelBooking(booking.id)
                                    }
                                    disabled={actionLoading === booking.id}
                                    className="bg-rose-600 text-white px-4 py-2.5 rounded-xl font-medium text-sm hover:bg-rose-700 transition-colors disabled:opacity-50 flex items-center"
                                  >
                                    <XCircle className="w-4 h-4 mr-2" />
                                    {actionLoading === booking.id
                                      ? "Annulation..."
                                      : "Annuler réservation"}
                                  </button>
                                )}
                              <button
                                onClick={() => handleDeleteBooking(booking.id)}
                                disabled={
                                  actionLoading === booking.id ||
                                  !canCancelBooking(booking.id)
                                }
                                className="bg-gray-500 text-white px-4 py-2.5 rounded-xl font-medium text-sm hover:bg-gray-600 transition-colors disabled:opacity-50 flex items-center"
                                title={
                                  !canCancelBooking(booking.id)
                                    ? "Impossible de supprimer après 48 heures"
                                    : "Supprimer définitivement"
                                }
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                {actionLoading === booking.id
                                  ? "Suppression..."
                                  : "Supprimer"}
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl p-6 lg:p-12 border border-white/40 text-center animate-on-scroll">
                  <div className="w-20 h-20 lg:w-28 lg:h-28 bg-gradient-to-br from-blue-100 via-cyan-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Calendar className="w-8 h-8 lg:w-12 lg:h-12 text-gray-400" />
                  </div>
                  <h4 className="text-xl lg:text-3xl font-black text-gray-700 mb-3 lg:mb-4">
                    Aucune réservation trouvée
                  </h4>
                  <p className="text-gray-500 mb-6 lg:mb-8 text-sm lg:text-base max-w-md mx-auto leading-relaxed">
                    {searchTerm || filter !== "all"
                      ? "Aucune réservation ne correspond à vos critères de recherche."
                      : "Vous n'avez pas encore effectué de réservation. Découvrez nos magnifiques logements !"}
                  </p>
                  <Link
                    href="/"
                    className="inline-block bg-gradient-to-r from-blue-600 via-cyan-500 to-purple-600 text-white px-6 lg:px-8 py-3 lg:py-4 rounded-2xl font-bold text-sm lg:text-base hover:from-blue-700 hover:via-cyan-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl"
                  >
                    Explorer nos logements
                  </Link>
                </div>
              )}

              {/* Pagination Grid View */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2 mt-6 lg:mt-8">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="p-2.5 lg:p-3 rounded-xl bg-white/80 border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/90 transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    <ChevronLeft className="w-4 h-4 lg:w-5 lg:h-5" />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-10 h-10 lg:w-12 lg:h-12 rounded-xl font-bold text-sm lg:text-base transition-all duration-300 shadow-md hover:shadow-lg ${
                          currentPage === page
                            ? "bg-blue-600 text-white shadow-blue-200 scale-110"
                            : "bg-white/80 text-gray-700 hover:bg-white/90 hover:scale-105"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}

                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="p-2.5 lg:p-3 rounded-xl bg-white/80 border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/90 transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    <ChevronRight className="w-4 h-4 lg:w-5 lg:h-5" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Table View - Optimisée pour responsive */
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-white/40 animate-on-scroll">
              {/* Mobile Table View */}
              <div className="lg:hidden">
                <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">
                      Réservations
                    </h3>
                    <input
                      type="checkbox"
                      checked={
                        selectedBookings.length === filteredBookings.length &&
                        filteredBookings.length > 0
                      }
                      onChange={selectAllBookings}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="divide-y divide-gray-200">
                  {paginatedBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="p-4 hover:bg-gray-50/50 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={selectedBookings.includes(booking.id)}
                            onChange={() => toggleSelectBooking(booking.id)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-1"
                            disabled={!canCancelBooking(booking.id)}
                          />
                          <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-lg overflow-hidden">
                            {booking.apartment?.images?.[0] ? (
                              <img
                                className="w-12 h-12 object-cover"
                                src={booking.apartment.images[0]}
                                alt={booking.apartment.title}
                              />
                            ) : (
                              <div className="w-12 h-12 flex items-center justify-center text-white">
                                <Home className="w-5 h-5" />
                              </div>
                            )}
                          </div>
                        </div>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(
                            booking.status
                          )}`}
                        >
                          {getStatusIcon(booking.status)}
                          {booking.status === "pending" && "En attente"}
                          {booking.status === "confirmed" && "Confirmé"}
                          {booking.status === "cancelled" && "Annulé"}
                        </span>
                      </div>

                      <div className="ml-15 space-y-2">
                        <h4 className="font-medium text-gray-900 text-sm">
                          {booking.apartment?.title || "Non spécifié"}
                        </h4>
                        <div className="flex items-center text-gray-500 text-xs">
                          <MapPin className="w-3 h-3 mr-1 text-cyan-500" />
                          {booking.apartment?.location || "Non spécifié"}
                        </div>
                        <div className="text-xs text-gray-600">
                          {formatDate(booking.startDate)} au{" "}
                          {formatDate(booking.endDate)}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            {calculateNights(
                              booking.startDate,
                              booking.endDate
                            )}{" "}
                            nuit(s)
                          </span>
                          <span className="text-sm font-bold text-gray-900">
                            {calculateTotalPrice(booking).toLocaleString()} FCFA
                          </span>
                        </div>

                        {/* Actions Mobile Table */}
                        <div className="flex items-center space-x-2 pt-2">
                          {booking.status === "pending" && (
                            <>
                              <button
                                onClick={() => handleConfirmBooking(booking.id)}
                                disabled={actionLoading === booking.id}
                                className="text-emerald-600 hover:text-emerald-900 disabled:opacity-50 p-1"
                                title="Confirmer"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleCancelBooking(booking.id)}
                                disabled={actionLoading === booking.id}
                                className="text-amber-600 hover:text-amber-900 disabled:opacity-50 p-1"
                                title="Annuler"
                              >
                                <Clock className="w-4 h-4" />
                              </button>
                            </>
                          )}
                          {booking.status === "confirmed" && (
                            <>
                              {canCancelBooking(booking.id) && (
                                <button
                                  onClick={() =>
                                    handleCancelBooking(booking.id)
                                  }
                                  disabled={actionLoading === booking.id}
                                  className="text-rose-600 hover:text-rose-900 disabled:opacity-50 p-1"
                                  title="Annuler"
                                >
                                  <XCircle className="w-4 h-4" />
                                </button>
                              )}
                              <button
                                onClick={() => handleDownloadInvoice(booking)}
                                className="text-blue-600 hover:text-blue-900 p-1"
                                title="Télécharger facture"
                              >
                                <Download className="w-4 h-4" />
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => handleDeleteBooking(booking.id)}
                            disabled={
                              actionLoading === booking.id ||
                              !canCancelBooking(booking.id)
                            }
                            className="text-gray-600 hover:text-gray-900 disabled:opacity-50 p-1"
                            title={
                              !canCancelBooking(booking.id)
                                ? "Impossible de supprimer après 48 heures"
                                : "Supprimer"
                            }
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-blue-50 to-cyan-50">
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        <input
                          type="checkbox"
                          checked={
                            selectedBookings.length ===
                              filteredBookings.length &&
                            filteredBookings.length > 0
                          }
                          onChange={selectAllBookings}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Appartement
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Dates
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Nuits
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Prix
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Statut
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {paginatedBookings.map((booking) => (
                      <tr
                        key={booking.id}
                        className="hover:bg-gray-50/50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={selectedBookings.includes(booking.id)}
                            onChange={() => toggleSelectBooking(booking.id)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            disabled={!canCancelBooking(booking.id)}
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl overflow-hidden">
                              {booking.apartment?.images?.[0] ? (
                                <img
                                  className="h-12 w-12 object-cover"
                                  src={booking.apartment.images[0]}
                                  alt={booking.apartment.title}
                                />
                              ) : (
                                <div className="h-12 w-12 flex items-center justify-center text-white">
                                  <Home className="w-6 h-6" />
                                </div>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-semibold text-gray-900">
                                {booking.apartment?.title || "Non spécifié"}
                              </div>
                              <div className="text-sm text-gray-500 flex items-center">
                                <MapPin className="w-3 h-3 mr-1 text-cyan-500" />
                                {booking.apartment?.location || "Non spécifié"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {formatDate(booking.startDate)}
                          </div>
                          <div className="text-sm text-gray-500">
                            au {formatDate(booking.endDate)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {calculateNights(booking.startDate, booking.endDate)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                          {calculateTotalPrice(booking).toLocaleString()} FCFA
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center space-x-1 w-fit ${getStatusBadgeClass(
                              booking.status
                            )}`}
                          >
                            {getStatusIcon(booking.status)}
                            <span>
                              {booking.status === "pending" && "En attente"}
                              {booking.status === "confirmed" && "Confirmé"}
                              {booking.status === "cancelled" && "Annulé"}
                            </span>
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-3">
                            {booking.status === "pending" && (
                              <>
                                <button
                                  onClick={() =>
                                    handleConfirmBooking(booking.id)
                                  }
                                  disabled={actionLoading === booking.id}
                                  className="text-emerald-600 hover:text-emerald-900 disabled:opacity-50 p-1.5 rounded-lg hover:bg-emerald-50 transition-all"
                                  title="Confirmer"
                                >
                                  <CheckCircle className="w-5 h-5" />
                                </button>
                                <button
                                  onClick={() =>
                                    handleCancelBooking(booking.id)
                                  }
                                  disabled={actionLoading === booking.id}
                                  className="text-amber-600 hover:text-amber-900 disabled:opacity-50 p-1.5 rounded-lg hover:bg-amber-50 transition-all"
                                  title="Annuler"
                                >
                                  <Clock className="w-5 h-5" />
                                </button>
                              </>
                            )}
                            {booking.status === "confirmed" && (
                              <>
                                {canCancelBooking(booking.id) && (
                                  <button
                                    onClick={() =>
                                      handleCancelBooking(booking.id)
                                    }
                                    disabled={actionLoading === booking.id}
                                    className="text-rose-600 hover:text-rose-900 disabled:opacity-50 p-1.5 rounded-lg hover:bg-rose-50 transition-all"
                                    title="Annuler"
                                  >
                                    <XCircle className="w-5 h-5" />
                                  </button>
                                )}
                                <button
                                  onClick={() => handleDownloadInvoice(booking)}
                                  className="text-blue-600 hover:text-blue-900 p-1.5 rounded-lg hover:bg-blue-50 transition-all"
                                  title="Télécharger facture"
                                >
                                  <Download className="w-5 h-5" />
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => handleDeleteBooking(booking.id)}
                              disabled={
                                actionLoading === booking.id ||
                                !canCancelBooking(booking.id)
                              }
                              className="text-gray-600 hover:text-gray-900 disabled:opacity-50 p-1.5 rounded-lg hover:bg-gray-50 transition-all"
                              title={
                                !canCancelBooking(booking.id)
                                  ? "Impossible de supprimer après 48 heures"
                                  : "Supprimer"
                              }
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredBookings.length === 0 && (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Calendar className="w-10 h-10 text-gray-400" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-700 mb-3">
                    Aucune réservation trouvée
                  </h4>
                  <p className="text-gray-500 max-w-sm mx-auto">
                    {searchTerm || filter !== "all"
                      ? "Aucune réservation ne correspond à vos critères."
                      : "Vous n'avez pas encore effectué de réservation."}
                  </p>
                </div>
              )}

              {/* Pagination for table view */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2 p-6 border-t border-gray-200 bg-gray-50/30">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="p-2.5 lg:p-3 rounded-xl bg-white/90 border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    <ChevronLeft className="w-4 h-4 lg:w-5 lg:h-5" />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-10 h-10 lg:w-12 lg:h-12 rounded-xl font-bold text-sm lg:text-base transition-all duration-300 shadow-md hover:shadow-lg ${
                          currentPage === page
                            ? "bg-blue-600 text-white shadow-blue-200 scale-110"
                            : "bg-white/90 text-gray-700 hover:bg-white hover:scale-105"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}

                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="p-2.5 lg:p-3 rounded-xl bg-white/90 border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    <ChevronRight className="w-4 h-4 lg:w-5 lg:h-5" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </KribiAnimations>
  );
};

export default BookingsTab;
