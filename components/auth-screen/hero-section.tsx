"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useState, useRef, useEffect } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Mail, MessageCircle, Search, CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { AuthDialog } from "./auth-dialog"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

interface HeroSectionProps {
  onWhatsAppContact: () => void
  onEmailContact: () => void
}

export function HeroSection({ onWhatsAppContact, onEmailContact }: HeroSectionProps) {
  const [checkInDate, setCheckInDate] = useState<Date>()
  const [checkOutDate, setCheckOutDate] = useState<Date>()
  const heroRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".hero-content", { opacity: 0, y: 100 }, { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" })

      gsap.to(".floating-badge", {
        y: -10,
        duration: 2,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      })

      gsap.to(".hero-bg", {
        yPercent: -50,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={heroRef}
      className="relative h-[70vh] bg-gradient-to-br from-blue-400 via-teal-300 to-emerald-200 overflow-hidden animate-ocean-waves"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-black/20"></div>
      <img
        src="/placeholder.svg?height=700&width=1400"
        alt="Kribi Beach"
        className="hero-bg w-full h-full object-cover mix-blend-overlay"
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="hero-content max-w-4xl px-4 text-center">
          <Badge className="floating-badge mb-4 bg-orange-500/20 text-orange-700 border-orange-300">
            🏖️ Destination de rêve
          </Badge>
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Découvrez la magie de <span className="text-orange-300">Kribi</span>
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Trouvez votre appartement de rêve dans la perle côtière du Cameroun. Plages paradisiaques, culture
            authentique et hospitalité légendaire vous attendent.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              onClick={onWhatsAppContact}
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              WhatsApp Direct
            </Button>
            <AuthDialog>
              <Button
                size="lg"
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                Se connecter
              </Button>
            </AuthDialog>
          </div>
        </div>
      </div>
    </section>
  )
}
