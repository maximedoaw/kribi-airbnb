"use client"

import { Separator } from "@/components/ui/separator"
import { MapPin, Phone, Mail } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-lg">
                <MapPin className="h-5 w-5 text-white" />
              </div>
              <div>
                <h5 className="font-bold text-xl">LaRoseDor</h5>
                <p className="text-sm text-gray-300">Perle du Cameroun</p>
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed">
              Votre partenaire de confiance pour la location d'appartements à Kribi, Cameroun. Découvrez l'hospitalité
              camerounaise authentique.
            </p>
          </div>

          <div>
            <h6 className="font-semibold mb-6 text-lg">Contact</h6>
            <div className="space-y-4 text-gray-300">
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-orange-400" />
                <span>+237 6XX XXX XXX</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-orange-400" />
                <span>contact@kribi-apartments.cm</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-orange-400" />
                <span>Kribi, Région du Sud, Cameroun</span>
              </div>
            </div>
          </div>

          <div>
            <h6 className="font-semibold mb-6 text-lg">Services</h6>
            <ul className="space-y-3 text-gray-300">
              <li className="hover:text-orange-400 transition-colors cursor-pointer">Location courte durée</li>
              <li className="hover:text-orange-400 transition-colors cursor-pointer">Location longue durée</li>
              <li className="hover:text-orange-400 transition-colors cursor-pointer">Conciergerie</li>
              <li className="hover:text-orange-400 transition-colors cursor-pointer">Transfert aéroport</li>
              <li className="hover:text-orange-400 transition-colors cursor-pointer">Excursions touristiques</li>
            </ul>
          </div>

          <div>
            <h6 className="font-semibold mb-6 text-lg">Liens utiles</h6>
            <ul className="space-y-3 text-gray-300">
              <li className="hover:text-orange-400 transition-colors cursor-pointer">À propos</li>
              <li className="hover:text-orange-400 transition-colors cursor-pointer">Conditions générales</li>
              <li className="hover:text-orange-400 transition-colors cursor-pointer">Politique de confidentialité</li>
              <li className="hover:text-orange-400 transition-colors cursor-pointer">Support client</li>
            </ul>
          </div>
        </div>

        <Separator className="bg-gray-700 mb-8" />

        <div className="flex flex-col md:flex-row justify-between items-center text-gray-400">
          <p>&copy; 2024 LaRoseDor. Tous droits réservés.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <span className="hover:text-orange-400 transition-colors cursor-pointer">Mentions légales</span>
            <span className="hover:text-orange-400 transition-colors cursor-pointer">Plan du site</span>
            <span className="hover:text-orange-400 transition-colors cursor-pointer">Cookies</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
