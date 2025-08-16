"use client"

import { Badge } from "@/components/ui/badge"
import { VerticalTimeline, VerticalTimelineElement } from "react-vertical-timeline-component"
import "react-vertical-timeline-component/style.min.css"
import { Search, Home, Users, CheckCircle } from "lucide-react"

export function TimelineSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge className="floating-badge mb-4 bg-blue-100 text-blue-700">📋 Processus simple</Badge>
          <h3 className="text-4xl font-bold text-foreground mb-6">Comment réserver ?</h3>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Un processus simple en 4 étapes pour votre réservation parfaite
          </p>
        </div>

        <VerticalTimeline animate={true} lineColor="#f97316">
          <VerticalTimelineElement
            className="vertical-timeline-element--work"
            contentStyle={{
              background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
              color: "#fff",
              boxShadow: "0 10px 30px rgba(249, 115, 22, 0.3)",
            }}
            contentArrowStyle={{ borderRight: "7px solid #f97316" }}
            iconStyle={{ background: "#f97316", color: "#fff", boxShadow: "0 0 20px rgba(249, 115, 22, 0.5)" }}
            icon={<Search />}
          >
            <h3 className="vertical-timeline-element-title text-xl font-bold">Recherchez</h3>
            <h4 className="vertical-timeline-element-subtitle text-orange-100">Étape 1</h4>
            <p className="text-orange-50">
              Utilisez notre moteur de recherche pour trouver l'appartement parfait selon vos critères et dates.
            </p>
          </VerticalTimelineElement>

          <VerticalTimelineElement
            className="vertical-timeline-element--work"
            contentStyle={{
              background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
              color: "#fff",
              boxShadow: "0 10px 30px rgba(59, 130, 246, 0.3)",
            }}
            contentArrowStyle={{ borderRight: "7px solid #3b82f6" }}
            iconStyle={{ background: "#3b82f6", color: "#fff", boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)" }}
            icon={<Home />}
          >
            <h3 className="vertical-timeline-element-title text-xl font-bold">Sélectionnez</h3>
            <h4 className="vertical-timeline-element-subtitle text-blue-100">Étape 2</h4>
            <p className="text-blue-50">
              Parcourez les détails, photos et équipements de chaque appartement pour faire votre choix.
            </p>
          </VerticalTimelineElement>

          <VerticalTimelineElement
            className="vertical-timeline-element--work"
            contentStyle={{
              background: "linear-gradient(135deg, #10b981 0%, #047857 100%)",
              color: "#fff",
              boxShadow: "0 10px 30px rgba(16, 185, 129, 0.3)",
            }}
            contentArrowStyle={{ borderRight: "7px solid #10b981" }}
            iconStyle={{ background: "#10b981", color: "#fff", boxShadow: "0 0 20px rgba(16, 185, 129, 0.5)" }}
            icon={<Users />}
          >
            <h3 className="vertical-timeline-element-title text-xl font-bold">Réservez</h3>
            <h4 className="vertical-timeline-element-subtitle text-emerald-100">Étape 3</h4>
            <p className="text-emerald-50">
              Remplissez vos informations et confirmez votre réservation avec un acompte sécurisé.
            </p>
          </VerticalTimelineElement>

          <VerticalTimelineElement
            className="vertical-timeline-element--work"
            contentStyle={{
              background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
              color: "#fff",
              boxShadow: "0 10px 30px rgba(139, 92, 246, 0.3)",
            }}
            contentArrowStyle={{ borderRight: "7px solid #8b5cf6" }}
            iconStyle={{ background: "#8b5cf6", color: "#fff", boxShadow: "0 0 20px rgba(139, 92, 246, 0.5)" }}
            icon={<CheckCircle />}
          >
            <h3 className="vertical-timeline-element-title text-xl font-bold">Profitez</h3>
            <h4 className="vertical-timeline-element-subtitle text-purple-100">Étape 4</h4>
            <p className="text-purple-50">
              Recevez votre confirmation et préparez-vous à vivre une expérience inoubliable à Kribi !
            </p>
          </VerticalTimelineElement>
        </VerticalTimeline>
      </div>
    </section>
  )
}
