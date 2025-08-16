"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { AuthDialog } from "@/components/auth-screen/auth-dialog"
import { useRef, useEffect } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Star, Heart, Wifi, Car, Utensils, Shield } from "lucide-react"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

const starApartments = [
  {
    id: 1,
    name: "Villa Océan Kribi",
    price: "45,000 FCFA/nuit",
    rating: 4.9,
    reviews: 127,
    image: "/placeholder.svg?height=300&width=400",
    features: ["Vue mer", "Piscine", "WiFi", "Parking"],
    description: "Villa luxueuse face à l'océan avec piscine privée et terrasse panoramique",
    amenities: ["Piscine privée", "Terrasse", "Cuisine équipée", "Parking sécurisé"],
    category: "villa",
  },
  {
    id: 2,
    name: "Appartement Centre-Ville",
    price: "25,000 FCFA/nuit",
    rating: 4.7,
    reviews: 89,
    image: "/placeholder.svg?height=300&width=400",
    features: ["Centre-ville", "Climatisé", "WiFi", "Balcon"],
    description: "Appartement moderne au cœur de Kribi, proche de tous les commerces",
    amenities: ["Climatisation", "Balcon", "WiFi haut débit", "Proche commerces"],
    category: "apartment",
  },
  {
    id: 3,
    name: "Bungalow Plage",
    price: "35,000 FCFA/nuit",
    rating: 4.8,
    reviews: 156,
    image: "/placeholder.svg?height=300&width=400",
    features: ["Accès plage", "Terrasse", "Cuisine", "Jardin"],
    description: "Bungalow authentique à 50m de la plage avec jardin tropical",
    amenities: ["Accès direct plage", "Jardin tropical", "Cuisine complète", "Terrasse privée"],
    category: "bungalow",
  },
  {
    id: 4,
    name: "Suite Deluxe Marina",
    price: "55,000 FCFA/nuit",
    rating: 4.9,
    reviews: 203,
    image: "/placeholder.svg?height=300&width=400",
    features: ["Vue marina", "Jacuzzi", "WiFi", "Service"],
    description: "Suite de luxe avec vue sur la marina et services haut de gamme",
    amenities: ["Jacuzzi privé", "Vue marina", "Service conciergerie", "Mini-bar"],
    category: "villa",
  },
  {
    id: 5,
    name: "Studio Cosy Plage",
    price: "18,000 FCFA/nuit",
    rating: 4.5,
    reviews: 67,
    image: "/placeholder.svg?height=300&width=400",
    features: ["Proche plage", "Kitchenette", "WiFi", "Terrasse"],
    description: "Studio confortable et abordable à deux pas de la plage",
    amenities: ["Kitchenette", "Terrasse", "WiFi", "Proche plage"],
    category: "apartment",
  },
  {
    id: 6,
    name: "Chalet Tropical",
    price: "42,000 FCFA/nuit",
    rating: 4.8,
    reviews: 134,
    image: "/placeholder.svg?height=300&width=400",
    features: ["Jardin tropical", "Piscine", "BBQ", "Parking"],
    description: "Chalet authentique dans un jardin tropical luxuriant",
    amenities: ["Jardin privé", "Piscine partagée", "Espace BBQ", "Parking"],
    category: "bungalow",
  },
]

export function ApartmentsSection() {
  const apartmentsRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".apartment-card",
        { opacity: 0, x: -50, rotationY: -15 },
        {
          opacity: 1,
          x: 0,
          rotationY: 0,
          duration: 1,
          stagger: 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: apartmentsRef.current,
            start: "top 70%",
          },
        },
      )

      gsap.to(".floating-badge", {
        y: -10,
        duration: 2,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    <section ref={apartmentsRef} className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge className="floating-badge mb-4 bg-yellow-100 text-yellow-700">⭐ Sélection premium</Badge>
          <h3 className="text-4xl font-bold text-foreground mb-6">Nos appartements étoiles</h3>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Découvrez notre sélection d'appartements les mieux notés par nos clients
          </p>
        </div>

        <Tabs defaultValue="all" className="mb-8">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-4">
            <TabsTrigger value="all">Tous</TabsTrigger>
            <TabsTrigger value="villa">Villas</TabsTrigger>
            <TabsTrigger value="apartment">Apparts</TabsTrigger>
            <TabsTrigger value="bungalow">Bungalows</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-8">
            <Carousel className="w-full max-w-6xl mx-auto">
              <CarouselContent className="-ml-2 md:-ml-4">
                {starApartments.map((apartment, index) => (
                  <CarouselItem key={apartment.id} className="apartment-card pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                    <Card className="overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-0 shadow-lg bg-gradient-to-br from-white to-orange-50/30 hover:scale-105">
                      <div className="relative">
                        <img
                          src={apartment.image || "/placeholder.svg"}
                          alt={apartment.name}
                          className="w-full h-56 object-cover"
                        />
                        <div className="absolute top-4 right-4 flex gap-2">
                          <Badge className="bg-white/95 text-gray-800 shadow-lg backdrop-blur">
                            <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                            {apartment.rating}
                          </Badge>
                          <Button
                            size="icon"
                            variant="secondary"
                            className="h-8 w-8 bg-white/95 hover:bg-white backdrop-blur hover:scale-110 transition-all duration-300"
                          >
                            <Heart className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="absolute bottom-4 left-4">
                          <Badge className="bg-orange-500 text-white shadow-lg">
                            {apartment.category === "villa"
                              ? "🏖️ Villa"
                              : apartment.category === "apartment"
                                ? "🏢 Appartement"
                                : "🏡 Bungalow"}
                          </Badge>
                        </div>
                      </div>
                      <CardHeader className="pb-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-xl mb-2">{apartment.name}</CardTitle>
                            <CardDescription className="text-sm leading-relaxed">
                              {apartment.description}
                            </CardDescription>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span>{apartment.rating}</span>
                          <span>•</span>
                          <span>{apartment.reviews} avis</span>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-2xl font-bold text-orange-600">{apartment.price}</span>
                          <span className="text-sm text-muted-foreground">par nuit</span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 mb-4">
                          {apartment.amenities.map((amenity, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                              {amenity.includes("WiFi") && <Wifi className="h-3 w-3 text-blue-500" />}
                              {amenity.includes("Parking") && <Car className="h-3 w-3 text-gray-500" />}
                              {amenity.includes("Cuisine") && <Utensils className="h-3 w-3 text-green-500" />}
                              {!amenity.includes("WiFi") &&
                                !amenity.includes("Parking") &&
                                !amenity.includes("Cuisine") && <Shield className="h-3 w-3 text-orange-500" />}
                              <span className="truncate">{amenity}</span>
                            </div>
                          ))}
                        </div>

                        <AuthDialog>
                          <Button className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                            Réserver maintenant
                          </Button>
                        </AuthDialog>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex" />
              <CarouselNext className="hidden md:flex" />
            </Carousel>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}
