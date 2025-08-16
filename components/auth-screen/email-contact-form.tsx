"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Send, User, MessageSquare } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function EmailContactForm() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Message envoyé !",
        description: "Nous vous répondrons dans les plus brefs délais.",
      })
    }, 2000)
  }

  return (
    <Card className="border-0 shadow-xl">
      <CardHeader className="text-center pb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
          <Mail className="h-8 w-8 text-white" />
        </div>
        <CardTitle className="text-2xl">Contactez-nous par email</CardTitle>
        <CardDescription>Remplissez le formulaire ci-dessous et nous vous répondrons rapidement</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom complet *</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input id="name" required placeholder="Votre nom complet" className="pl-10" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Votre email *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input id="email" type="email" required placeholder="votre@email.com" className="pl-10" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Sujet de votre demande</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Choisissez un sujet" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="reservation">Demande de réservation</SelectItem>
                <SelectItem value="information">Demande d'information</SelectItem>
                <SelectItem value="pricing">Question sur les tarifs</SelectItem>
                <SelectItem value="services">Services supplémentaires</SelectItem>
                <SelectItem value="complaint">Réclamation</SelectItem>
                <SelectItem value="other">Autre</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Votre message *</Label>
            <div className="relative">
              <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Textarea
                id="message"
                required
                placeholder="Décrivez votre demande en détail..."
                className="pl-10 min-h-[120px] resize-none"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg h-12"
            size="lg"
          >
            <Send className="mr-2 h-5 w-5" />
            {isLoading ? "Envoi en cours..." : "Envoyer le message"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
