"use client"

import { useState } from "react"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, MapPin, CreditCard, CheckCircle, Users, Clock } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

const steps = [
  { id: 1, title: "Sélection", icon: MapPin, description: "Choisissez votre appartement" },
  { id: 2, title: "Dates", icon: CalendarIcon, description: "Sélectionnez vos dates" },
  { id: 3, title: "Paiement", icon: CreditCard, description: "Informations de paiement" },
  { id: 4, title: "Confirmation", icon: CheckCircle, description: "Réservation confirmée" },
]

export function ReservationStepper() {
  const [currentStep, setCurrentStep] = useState(1)
  const [checkInDate, setCheckInDate] = useState<Date>()
  const [checkOutDate, setCheckOutDate] = useState<Date>()
  const [apartmentType, setApartmentType] = useState("")
  const [neighborhood, setNeighborhood] = useState("")
  const [guests, setGuests] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("")

  const progress = (currentStep / steps.length) * 100

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-xl border-0 bg-gradient-to-br from-white to-orange-50/30">
      <CardHeader className="text-center pb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
          <MapPin className="h-8 w-8 text-white" />
        </div>
        <CardTitle className="text-2xl font-bold text-foreground">Réservation d'appartement</CardTitle>
        <CardDescription className="text-lg">
          Suivez ces étapes pour réserver votre appartement de rêve à Kribi
        </CardDescription>

        {/* Enhanced Progress Section */}
        <div className="space-y-6 mt-8">
          <div className="relative">
            <Progress value={progress} className="w-full h-3 bg-gray-200" />
            <div
              className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {steps.map((step) => {
              const Icon = step.icon
              const isActive = currentStep === step.id
              const isCompleted = currentStep > step.id

              return (
                <div
                  key={step.id}
                  className={`flex flex-col items-center gap-2 p-3 rounded-lg transition-all duration-300 ${
                    isActive
                      ? "bg-gradient-to-br from-orange-100 to-red-100 border-2 border-orange-300"
                      : isCompleted
                        ? "bg-green-50 border-2 border-green-300"
                        : "bg-gray-50 border-2 border-gray-200"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isActive
                        ? "bg-gradient-to-br from-orange-500 to-red-500 text-white"
                        : isCompleted
                          ? "bg-green-500 text-white"
                          : "bg-gray-300 text-gray-600"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="text-center">
                    <p
                      className={`font-semibold text-sm ${
                        isActive ? "text-orange-700" : isCompleted ? "text-green-700" : "text-gray-600"
                      }`}
                    >
                      {step.title}
                    </p>
                    <p className="text-xs text-muted-foreground hidden md:block">{step.description}</p>
                  </div>
                  {isActive && <Badge className="bg-orange-500 text-white text-xs">En cours</Badge>}
                  {isCompleted && <Badge className="bg-green-500 text-white text-xs">Terminé</Badge>}
                </div>
              )
            })}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-8">
        {/* Step 1: Enhanced Selection */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-foreground mb-2">Choisissez votre appartement</h3>
              <p className="text-muted-foreground">Sélectionnez le type et l'emplacement qui vous conviennent</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-3">
                <Label className="text-base font-semibold">Type d'appartement</Label>
                <Select value={apartmentType} onValueChange={setApartmentType}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Choisissez le type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="studio">🏠 Studio (1 pièce) - 18,000-25,000 FCFA</SelectItem>
                    <SelectItem value="f2">🏡 F2 (2 pièces) - 25,000-35,000 FCFA</SelectItem>
                    <SelectItem value="f3">🏘️ F3 (3 pièces) - 35,000-45,000 FCFA</SelectItem>
                    <SelectItem value="villa">🏖️ Villa (4+ pièces) - 45,000+ FCFA</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label className="text-base font-semibold">Quartier préféré</Label>
                <Select value={neighborhood} onValueChange={setNeighborhood}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Choisissez le quartier" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="centre">🏢 Centre-ville - Proche commerces</SelectItem>
                    <SelectItem value="plage">🏖️ Bord de mer - Vue océan</SelectItem>
                    <SelectItem value="residentiel">🌳 Résidentiel - Calme et verdure</SelectItem>
                    <SelectItem value="marche">🛒 Proche marché - Vie locale</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
              <h4 className="font-semibold text-orange-800 mb-2">💡 Conseil</h4>
              <p className="text-sm text-orange-700">
                Les appartements en bord de mer offrent une vue magnifique mais peuvent être plus chers. Le centre-ville
                est idéal pour découvrir la culture locale.
              </p>
            </div>
          </div>
        )}

        {/* Step 2: Enhanced Dates with Calendar */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-foreground mb-2">Sélectionnez vos dates</h3>
              <p className="text-muted-foreground">Choisissez votre période de séjour à Kribi</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-3">
                <Label className="text-base font-semibold flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  Date d'arrivée
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full h-12 justify-start text-left font-normal bg-transparent"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {checkInDate ? format(checkInDate, "dd MMMM yyyy", { locale: fr }) : "Sélectionner la date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={checkInDate} onSelect={setCheckInDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-3">
                <Label className="text-base font-semibold flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  Date de départ
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full h-12 justify-start text-left font-normal bg-transparent"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {checkOutDate ? format(checkOutDate, "dd MMMM yyyy", { locale: fr }) : "Sélectionner la date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={checkOutDate} onSelect={setCheckOutDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-base font-semibold flex items-center gap-2">
                <Users className="h-4 w-4" />
                Nombre de voyageurs
              </Label>
              <Select value={guests} onValueChange={setGuests}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Combien de personnes ?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 personne</SelectItem>
                  <SelectItem value="2">2 personnes</SelectItem>
                  <SelectItem value="3">3 personnes</SelectItem>
                  <SelectItem value="4">4 personnes</SelectItem>
                  <SelectItem value="5">5 personnes</SelectItem>
                  <SelectItem value="6+">6+ personnes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {checkInDate && checkOutDate && (
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Résumé du séjour
                </h4>
                <p className="text-sm text-blue-700">
                  Du {format(checkInDate, "dd MMMM", { locale: fr })} au{" "}
                  {format(checkOutDate, "dd MMMM yyyy", { locale: fr })}
                  <br />
                  Durée: {Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24))} nuits
                </p>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Enhanced Payment */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-foreground mb-2">Informations de paiement</h3>
              <p className="text-muted-foreground">Finalisez votre réservation avec vos informations</p>
            </div>

            <div className="grid gap-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <Label htmlFor="fullname" className="text-base font-semibold">
                    Nom complet *
                  </Label>
                  <Input id="fullname" placeholder="Votre nom complet" className="h-12" />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="phone" className="text-base font-semibold">
                    Téléphone *
                  </Label>
                  <Input id="phone" placeholder="+237 6XX XXX XXX" className="h-12" />
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-base font-semibold">Mode de paiement</Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Choisissez votre mode de paiement" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mtn">📱 Mobile Money MTN</SelectItem>
                    <SelectItem value="orange">📱 Mobile Money Orange</SelectItem>
                    <SelectItem value="bank">🏦 Virement bancaire</SelectItem>
                    <SelectItem value="cash">💰 Paiement à l'arrivée</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label htmlFor="notes" className="text-base font-semibold">
                  Notes spéciales (optionnel)
                </Label>
                <Textarea
                  id="notes"
                  placeholder="Demandes particulières, allergies, préférences..."
                  className="min-h-[100px]"
                />
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-800 mb-2">💳 Acompte requis</h4>
              <p className="text-sm text-green-700">
                Un acompte de 30% sera demandé pour confirmer votre réservation. Le solde sera payable à l'arrivée ou
                selon vos préférences.
              </p>
            </div>
          </div>
        )}

        {/* Step 4: Enhanced Confirmation */}
        {currentStep === 4 && (
          <div className="text-center space-y-6">
            <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
              <CheckCircle className="h-12 w-12 text-white" />
            </div>

            <div>
              <h3 className="text-3xl font-bold text-green-600 mb-2">Réservation confirmée !</h3>
              <p className="text-lg text-muted-foreground">Votre demande de réservation a été envoyée avec succès</p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-red-50 p-6 rounded-lg border border-orange-200 max-w-md mx-auto">
              <h4 className="font-semibold text-orange-800 mb-3">📋 Détails de la réservation</h4>
              <div className="space-y-2 text-sm text-orange-700">
                <p>
                  <strong>Référence:</strong> KRB-{Math.random().toString(36).substr(2, 9).toUpperCase()}
                </p>
                <p>
                  <strong>Type:</strong> {apartmentType || "Non spécifié"}
                </p>
                <p>
                  <strong>Quartier:</strong> {neighborhood || "Non spécifié"}
                </p>
                <p>
                  <strong>Voyageurs:</strong> {guests || "Non spécifié"}
                </p>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2">📞 Prochaines étapes</h4>
              <p className="text-sm text-blue-700">
                Notre équipe vous contactera sous 24h pour confirmer les détails et organiser le paiement de l'acompte.
                Vous recevrez également un email de confirmation.
              </p>
            </div>
          </div>
        )}

        {/* Enhanced Navigation Buttons */}
        <div className="flex justify-between pt-6 border-t">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="h-12 px-6 bg-transparent"
          >
            ← Précédent
          </Button>
          <Button
            onClick={nextStep}
            disabled={currentStep === steps.length}
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg h-12 px-6"
          >
            {currentStep === steps.length ? "🎉 Terminé" : "Suivant →"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
