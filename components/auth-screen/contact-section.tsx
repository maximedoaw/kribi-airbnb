"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { EmailContactForm } from "@/components/auth-screen/email-contact-form"
import { MessageCircle, Mail, ChevronLeft } from "lucide-react"

interface ContactSectionProps {
  showEmailForm: boolean
  onShowEmailForm: (show: boolean) => void
  onWhatsAppContact: () => void
}

export function ContactSection({ showEmailForm, onShowEmailForm, onWhatsAppContact }: ContactSectionProps) {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge className="floating-badge mb-4 bg-orange-100 text-orange-700">📞 Contact</Badge>
          <h3 className="text-4xl font-bold text-foreground mb-6">Contactez-nous</h3>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Notre équipe est là pour vous aider à trouver l'appartement parfait
          </p>
        </div>

        {!showEmailForm ? (
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <MessageCircle className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-2xl font-semibold mb-4">WhatsApp</h4>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Contactez-nous directement sur WhatsApp pour une réponse rapide et personnalisée
                </p>
                <Button
                  onClick={onWhatsAppContact}
                  className="bg-green-600 hover:bg-green-700 text-white shadow-lg w-full"
                  size="lg"
                >
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Ouvrir WhatsApp
                </Button>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Mail className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-2xl font-semibold mb-4">Email</h4>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Envoyez-nous un message détaillé via notre formulaire de contact
                </p>
                <Button
                  onClick={() => onShowEmailForm(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg w-full"
                  size="lg"
                >
                  <Mail className="mr-2 h-5 w-5" />
                  Formulaire de contact
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            <div className="mb-6 text-center">
              <Button variant="outline" onClick={() => onShowEmailForm(false)} className="mb-4">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Retour aux options de contact
              </Button>
            </div>
            <EmailContactForm />
          </div>
        )}
      </div>
    </section>
  )
}
