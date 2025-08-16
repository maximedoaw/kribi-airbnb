"use client"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { AuthDialog } from "@/components/auth-screen/auth-dialog"
import { MapPin, Menu } from "lucide-react"

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-lg">
            <MapPin className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Kribi Apartments</h1>
            <p className="text-xs text-muted-foreground">Perle du Cameroun</p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <Button variant="ghost" size="sm">
            Accueil
          </Button>
          <Button variant="ghost" size="sm">
            Appartements
          </Button>
          <Button variant="ghost" size="sm">
            Services
          </Button>
          <Button variant="ghost" size="sm">
            Contact
          </Button>
          <AuthDialog>
            <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg">
              Se connecter
            </Button>
          </AuthDialog>
        </div>

        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="outline" size="icon">
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <div className="flex flex-col gap-4 mt-8">
              <Button variant="ghost" className="justify-start">
                Accueil
              </Button>
              <Button variant="ghost" className="justify-start">
                Appartements
              </Button>
              <Button variant="ghost" className="justify-start">
                Services
              </Button>
              <Button variant="ghost" className="justify-start">
                Contact
              </Button>
              <Separator />
              <AuthDialog>
                <Button className="bg-gradient-to-r from-orange-500 to-red-500 text-white">Se connecter</Button>
              </AuthDialog>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
