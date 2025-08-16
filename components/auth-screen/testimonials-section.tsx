"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRef, useEffect } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Star } from "lucide-react"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

const testimonials = [
  {
    name: "Marie Dubois",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
    comment: "Séjour exceptionnel ! La villa était parfaite et l'accueil chaleureux.",
    location: "Paris, France",
  },
  {
    name: "Jean Kamga",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
    comment: "Appartement très bien situé, propre et confortable. Je recommande !",
    location: "Douala, Cameroun",
  },
  {
    name: "Sarah Johnson",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 4,
    comment: "Magnifique découverte de Kribi. L'appartement était parfait pour nos vacances.",
    location: "Londres, UK",
  },
]

export function TestimonialsSection() {
  const testimonialsRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".testimonial-card",
        { opacity: 0, scale: 0.8, rotation: -5 },
        {
          opacity: 1,
          scale: 1,
          rotation: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: "elastic.out(1, 0.5)",
          scrollTrigger: {
            trigger: testimonialsRef.current,
            start: "top 75%",
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
    <section ref={testimonialsRef} className="py-20 bg-gradient-to-b from-orange-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge className="floating-badge mb-4 bg-green-100 text-green-700">💬 Témoignages</Badge>
          <h3 className="text-4xl font-bold text-foreground mb-6">Ce que disent nos clients</h3>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Découvrez les expériences de nos clients satisfaits
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="testimonial-card border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:rotate-1"
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Avatar className="ring-2 ring-orange-200">
                    <AvatarImage src={testimonial.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {testimonial.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h5 className="font-semibold">{testimonial.name}</h5>
                    <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                  </div>
                </div>
                <div className="flex gap-1 mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground italic leading-relaxed">"{testimonial.comment}"</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
