"use client"

import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqs = [
  {
    question: "Comment effectuer une réservation ?",
    answer:
      "Vous pouvez réserver directement via notre plateforme en ligne ou nous contacter par WhatsApp ou email. Un acompte de 30% est demandé pour confirmer votre réservation.",
  },
  {
    question: "Quels sont les moyens de paiement acceptés ?",
    answer:
      "Nous acceptons les virements bancaires, Mobile Money (MTN, Orange), et les paiements en espèces sur place.",
  },
  {
    question: "Quelle est la politique d'annulation ?",
    answer:
      "Annulation gratuite jusqu'à 48h avant l'arrivée. Au-delà, l'acompte reste acquis mais peut être reporté sur une future réservation.",
  },
]

export function FaqSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge className="floating-badge mb-4 bg-purple-100 text-purple-700">❓ Questions fréquentes</Badge>
          <h3 className="text-4xl font-bold text-foreground mb-6">Questions fréquentes</h3>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Trouvez rapidement les réponses à vos questions
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-6 shadow-sm">
                <AccordionTrigger className="text-left font-semibold hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-4">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
