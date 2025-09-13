"use client"

import { Button } from "@/components/ui/button"
import { MapPin } from "lucide-react"

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo et nom à gauche */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-lg">
            <MapPin className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">LaRoseDor</h1>
            <p className="text-xs text-muted-foreground">Perle du Cameroun</p>
          </div>
        </div>

        {/* Espace vide à droite pour équilibrer */}
        <div className="w-10 h-10"></div>
      </div>
    </header>
  )
}
