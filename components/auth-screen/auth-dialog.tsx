"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { User, Mail, Lock, Phone } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { auth, db } from "@/lib/firebase"
import { useAuthState, useSignInWithEmailAndPassword, useCreateUserWithEmailAndPassword, useSignInWithGoogle } from "react-firebase-hooks/auth"
import { doc, serverTimestamp, setDoc } from "firebase/firestore"

interface AuthDialogProps {
  children: React.ReactNode
}

export function AuthDialog({ children }: AuthDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [user] = useAuthState(auth)
  const [signInWithEmailAndPassword, , loadingLogin, errorLogin] = useSignInWithEmailAndPassword(auth)
  const [createUserWithEmailAndPassword, , loadingRegister, errorRegister] = useCreateUserWithEmailAndPassword(auth)
  const [signInWithGoogle, , loadingGoogle, errorGoogle] = useSignInWithGoogle(auth)
  const { toast } = useToast()

  const handleAuth = async (type: "login" | "register") => {
    try {
      setIsLoading(true)
      const emailInput = (document.getElementById(type === 'login' ? 'email' : 'register-email') as HTMLInputElement | null)?.value || ''
      const passwordInput = (document.getElementById(type === 'login' ? 'password' : 'register-password') as HTMLInputElement | null)?.value || ''
      if (!emailInput || !passwordInput) {
        toast({ title: "Champs requis", description: "Email et mot de passe sont requis." })
        return
      }
      if (type === 'login') {
        await signInWithEmailAndPassword(emailInput, passwordInput)
        toast({ title: "Connexion réussie !", description: "Bienvenue sur Kribi Apartments" })
      } else {
        const res = await createUserWithEmailAndPassword(emailInput, passwordInput)
        if (res?.user) {
          await setDoc(doc(db, 'users', res.user.uid), {
            name:res.user.displayName || "Utilisateur",
            email: res.user.email,
            role: 'user',
            createdAt: serverTimestamp(),
          }, { merge: true })
        }
        toast({ title: "Inscription réussie !", description: "Bienvenue sur Kribi Apartments" })
      }
      setIsOpen(false)
    } catch (e: any) {
      toast({ title: "Erreur", description: e?.message ?? 'Une erreur est survenue' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleAuth = async () => {
    try {
      setIsGoogleLoading(true)
      const res = await signInWithGoogle()
      if (res?.user) {
        await setDoc(doc(db, 'users', res.user.uid), {
          email: res.user.email,
          role: 'user',
          createdAt: serverTimestamp(),
        }, { merge: true })
      }
      setIsOpen(false)
      toast({ title: "Connexion Google réussie !", description: "Bienvenue sur Kribi Apartments" })
    } catch (e: any) {
      toast({ title: "Erreur", description: e?.message ?? 'Une erreur est survenue' })
    } finally {
      setIsGoogleLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold text-primary">Kribi Apartments</DialogTitle>
          <DialogDescription className="text-center">
            Connectez-vous pour réserver votre appartement de rêve à Kribi
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Button
            onClick={handleGoogleAuth}
            disabled={isGoogleLoading || loadingGoogle}
            variant="outline"
            className="w-full h-12 border-2 hover:bg-gray-50 bg-transparent"
          >
            <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            {isGoogleLoading || loadingGoogle ? "Connexion..." : "Continuer avec Google"}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Ou</span>
            </div>
          </div>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Connexion</TabsTrigger>
            <TabsTrigger value="register">Inscription</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input id="email" type="email" placeholder="votre@email.com" className="pl-10" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input id="password" type="password" placeholder="••••••••" className="pl-10" />
              </div>
            </div>
            <Button
              onClick={() => handleAuth("login")}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg h-12"
              disabled={isLoading || loadingLogin}
            >
              {isLoading || loadingLogin ? "Connexion..." : "Se connecter"}
            </Button>
            <div className="text-center">
              <Button variant="link" className="text-sm text-muted-foreground">
                Mot de passe oublié ?
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="register" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom complet</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input id="name" placeholder="Votre nom" className="pl-10" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input id="phone" placeholder="+237 6XX XXX XXX" className="pl-10" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="register-email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input id="register-email" type="email" placeholder="votre@email.com" className="pl-10" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="register-password">Mot de passe</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input id="register-password" type="password" placeholder="••••••••" className="pl-10" />
              </div>
            </div>
            <Button
              onClick={() => handleAuth("register")}
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg h-12"
              disabled={isLoading || loadingRegister}
            >
              {isLoading || loadingRegister ? "Inscription..." : "S'inscrire"}
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              En vous inscrivant, vous acceptez nos{" "}
              <Button variant="link" className="p-0 h-auto text-xs">
                Conditions d'utilisation
              </Button>{" "}
              et notre{" "}
              <Button variant="link" className="p-0 h-auto text-xs">
                Politique de confidentialité
              </Button>
            </p>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
