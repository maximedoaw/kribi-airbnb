"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useRef, useEffect } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Waves, Coffee, MapPin } from "lucide-react"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

export function FeaturesSection() {
  const featuresRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".feature-card",
        { opacity: 0, y: 50, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: featuresRef.current,
            start: "top 80%",
            end: "bottom 20%",
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
    <section ref={featuresRef} className="py-20 bg-gradient-to-b from-orange-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge className="floating-badge mb-4 bg-orange-100 text-orange-700">🌍 Destination unique</Badge>
          <h3 className="text-4xl font-bold text-foreground mb-6">Pourquoi choisir Kribi ?</h3>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Kribi, ville côtière du Cameroun, vous offre des plages paradisiaques, une culture riche et une hospitalité
            légendaire dans un cadre tropical exceptionnel.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="feature-card border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-4 hover:rotate-1">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Waves className="h-8 w-8 text-white" />
              </div>
              <h4 className="text-xl font-semibold mb-4">Plages magnifiques</h4>
              <p className="text-muted-foreground leading-relaxed">
                Sable fin, eaux cristallines et couchers de soleil inoubliables sur la côte atlantique
              </p>
            </CardContent>
          </Card>

          <Card className="feature-card border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-4 hover:rotate-1">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Coffee className="h-8 w-8 text-white" />
              </div>
              <h4 className="text-xl font-semibold mb-4">Culture authentique</h4>
              <p className="text-muted-foreground leading-relaxed">
                Découvrez la richesse culturelle et gastronomique camerounaise authentique
              </p>
            </CardContent>
          </Card>

          <Card className="feature-card border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-4 hover:rotate-1">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <MapPin className="h-8 w-8 text-white" />
              </div>
              <h4 className="text-xl font-semibold mb-4">Emplacement idéal</h4>
              <p className="text-muted-foreground leading-relaxed">
                Proche des attractions touristiques, restaurants et du centre-ville animé
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
