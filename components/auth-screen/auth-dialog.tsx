"use client"

import type React from "react"

import { useEffect, useState } from "react"
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
import toast from "react-hot-toast"
import { auth, db } from "@/lib/firebase"
import { 
  useAuthState, 
  useSignInWithEmailAndPassword, 
  useCreateUserWithEmailAndPassword, 
  useSignInWithGoogle 
} from "react-firebase-hooks/auth"
import { 
  doc, 
  getDoc, 
  serverTimestamp, 
  setDoc, 
  updateDoc 
} from "firebase/firestore"

interface AuthDialogProps {
  children: React.ReactNode
}

export function AuthDialog({ children }: AuthDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [user] = useAuthState(auth)
  const [signInWithEmailAndPassword, userLogin, loadingLogin, errorLogin] = useSignInWithEmailAndPassword(auth)
  const [createUserWithEmailAndPassword, userRegister, loadingRegister, errorRegister] = useCreateUserWithEmailAndPassword(auth)
  const [signInWithGoogle, userGoogle, loadingGoogle, errorGoogle] = useSignInWithGoogle(auth)

  // États pour les formulaires
  const [loginData, setLoginData] = useState({ email: "", password: "" })
  const [registerData, setRegisterData] = useState({ 
    name: "", 
    email: "", 
    password: "", 
    phone: "" 
  })

  const checkUserBanStatus = async (uid: string): Promise<boolean> => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid))
      if (userDoc.exists()) {
        const userData = userDoc.data()
        return userData.isBanned === true
      }
      return false
    } catch (error) {
      console.error("Erreur lors de la vérification du statut de ban:", error)
      return false
    }
  }

  const handleEmailLogin = async () => {
    if (!loginData.email || !loginData.password) {
      toast.error("Email et mot de passe sont requis")
      return
    }

    const loginToast = toast.loading("Connexion en cours...")

    try {
      const result = await signInWithEmailAndPassword(loginData.email, loginData.password)
      
      if (result?.user) {
        const isBanned = await checkUserBanStatus(result.user.uid)
        
        if (isBanned) {
          await auth.signOut()
          toast.error("Votre compte a été suspendu. Contactez l'administrateur.", { id: loginToast })
          return
        }

        // Mettre à jour la dernière connexion
        await updateDoc(doc(db, 'users', result.user.uid), {
          lastLogin: serverTimestamp(),
          updatedAt: serverTimestamp()
        })

        toast.success("Connexion réussie ! Bienvenue sur La Rose d'Or", { id: loginToast })
        setIsOpen(false)
        setLoginData({ email: "", password: "" })
      }
    } catch (error: any) {
      toast.error("Erreur de connexion: " + (error.message || "Une erreur est survenue"), { id: loginToast })
    }
  }

  const handleEmailRegister = async () => {
    if (!registerData.email || !registerData.password || !registerData.name) {
      toast.error("Tous les champs obligatoires doivent être remplis")
      return
    }

    const registerToast = toast.loading("Inscription en cours...")

    try {
      const result = await createUserWithEmailAndPassword(registerData.email, registerData.password)
      
      if (result?.user) {
        const userData = {
          uid: result.user.uid,
          email: registerData.email,
          displayName: registerData.name,
          phoneNumber: registerData.phone || "",
          role: 'user',
          isBanned: false,
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp(),
          updatedAt: serverTimestamp()
        }

        await setDoc(doc(db, 'users', result.user.uid), userData)

        toast.success("Inscription réussie ! Bienvenue sur La Rose d'Or", { id: registerToast })
        setIsOpen(false)
        setRegisterData({ name: "", email: "", password: "", phone: "" })
      }
    } catch (error: any) {
      toast.error("Erreur d'inscription: " + (error.message || "Une erreur est survenue"), { id: registerToast })
    }
  }

  const handleGoogleAuth = async () => {
    try {
      const result = await signInWithGoogle()
      
      if (result?.user) {
        const userRef = doc(db, 'users', result.user.uid)
        const userDoc = await getDoc(userRef)
        
        if (!userDoc.exists()) {
          // Nouveau utilisateur Google
          const userData = {
            uid: result.user.uid,
            email: result.user.email,
            displayName: result.user.displayName || "Utilisateur",
            photoURL: result.user.photoURL || "",
            phoneNumber: result.user.phoneNumber || "",
            role: 'user',
            isBanned: false,
            createdAt: serverTimestamp(),
            lastLogin: serverTimestamp(),
            updatedAt: serverTimestamp()
          }

          await setDoc(userRef, userData)
          
          toast.success("Inscription réussie ! Bienvenue sur La Rose d'Or")
        } else {
          // Utilisateur existant
          const userData = userDoc.data()
          
          if (userData.isBanned === true) {
            await auth.signOut()
            toast.error("Votre compte a été suspendu. Contactez l'administrateur.")
            return
          }

          // Mettre à jour seulement la dernière connexion
          await updateDoc(userRef, {
            lastLogin: serverTimestamp(),
            updatedAt: serverTimestamp()
          })
          
          toast.success("Connexion réussie ! Content de vous revoir sur La Rose d'Or")
        }
        
        setIsOpen(false)
      }
    } catch (error: any) {
      toast.error("Erreur d'authentification: " + (error.message || "Une erreur est survenue"))
    }
  }

  // Gérer les erreurs des hooks
  useEffect(() => {
    if (errorLogin) {
      toast.error("Erreur de connexion: " + errorLogin.message)
    }
  }, [errorLogin])

  useEffect(() => {
    if (errorRegister) {
      toast.error("Erreur d'inscription: " + errorRegister.message)
    }
  }, [errorRegister])

  useEffect(() => {
    if (errorGoogle) {
      toast.error("Erreur d'authentification Google: " + errorGoogle.message)
    }
  }, [errorGoogle])

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold text-primary">
              La Rose d'Or
            </DialogTitle>
            <DialogDescription className="text-center">
              Connectez-vous pour réserver votre appartement de rêve à Kribi
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Button
              onClick={handleGoogleAuth}
              disabled={loadingGoogle}
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
              {loadingGoogle ? "Connexion..." : "Continuer avec Google"}
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
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="votre@email.com" 
                    className="pl-10"
                    value={loginData.email}
                    onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="••••••••" 
                    className="pl-10"
                    value={loginData.password}
                    onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                  />
                </div>
              </div>
              <Button
                onClick={handleEmailLogin}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg h-12"
                disabled={loadingLogin}
              >
                {loadingLogin ? "Connexion..." : "Se connecter"}
              </Button>
              <div className="text-center">
                <Button variant="link" className="text-sm text-muted-foreground">
                  Mot de passe oublié ?
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="register" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom complet *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="name" 
                    placeholder="Votre nom" 
                    className="pl-10"
                    value={registerData.name}
                    onChange={(e) => setRegisterData(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="phone" 
                    placeholder="+237 6XX XXX XXX" 
                    className="pl-10"
                    value={registerData.phone}
                    onChange={(e) => setRegisterData(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-email">Email *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="register-email" 
                    type="email" 
                    placeholder="votre@email.com" 
                    className="pl-10"
                    value={registerData.email}
                    onChange={(e) => setRegisterData(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-password">Mot de passe *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="register-password" 
                    type="password" 
                    placeholder="••••••••" 
                    className="pl-10"
                    value={registerData.password}
                    onChange={(e) => setRegisterData(prev => ({ ...prev, password: e.target.value }))}
                  />
                </div>
              </div>
              <Button
                onClick={handleEmailRegister}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg h-12"
                disabled={loadingRegister}
              >
                {loadingRegister ? "Inscription..." : "S'inscrire"}
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
    </>
  )
}