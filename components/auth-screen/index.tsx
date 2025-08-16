"use client"

import { Header } from "@/components/header"
import { HeroSection } from "@/components/auth-screen/hero-section"
import { TimelineSection } from "@/components/auth-screen/timeline-section"
import { FeaturesSection } from "@/components/auth-screen/features-section"
import { ApartmentsSection } from "@/components/auth-screen/apartments-section"
import { TestimonialsSection } from "@/components/auth-screen/testimonials-section"
import { ReservationStepper } from "@/components/auth-screen/reservation-stepper"
import { FaqSection } from "@/components/auth-screen/faq-section"
import { ContactSection } from "@/components/auth-screen/contact-section"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { Footer } from "../footer"

export default function AuthScreen() {
  const [showEmailForm, setShowEmailForm] = useState(false)

  const handleWhatsAppContact = () => {
    window.open("https://wa.me/237600000000?text=Bonjour, je suis intéressé par vos appartements à Kribi", "_blank")
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <HeroSection onWhatsAppContact={handleWhatsAppContact} onEmailContact={() => setShowEmailForm(true)} />

      <TimelineSection />

      <FeaturesSection />

      <ApartmentsSection />

      <TestimonialsSection />

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="floating-badge mb-4 bg-blue-100 text-blue-700">📋 Réservation</Badge>
            <h3 className="text-4xl font-bold text-foreground mb-6">Réservez en quelques étapes</h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Processus simple et sécurisé pour votre réservation
            </p>
          </div>
          <ReservationStepper />
        </div>
      </section>

      <FaqSection />

      <ContactSection
        showEmailForm={showEmailForm}
        onShowEmailForm={setShowEmailForm}
        onWhatsAppContact={handleWhatsAppContact}
      />

      <Footer />
    </div>
  )
}
