"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Shield, User } from "lucide-react"
import { UserData } from "@/types/users"

interface EditUserDialogProps {
  user: UserData | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdateRole: (userId: string, role: "user" | "admin") => Promise<void>
  onToggleBan: (userId: string, isBanned: boolean) => Promise<void>
  isSuperAdmin: boolean
  loading: boolean
}

export function EditUserDialog({
  user,
  open,
  onOpenChange,
  onUpdateRole,
  onToggleBan,
  isSuperAdmin,
  loading,
}: EditUserDialogProps) {
  const [role, setRole] = useState<"user" | "admin">("user")
  const [isBanned, setIsBanned] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (user) {
      setRole(user.role)
      setIsBanned(user.isBanned || false)
    }
  }, [user])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onOpenChange(false)
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault()
        handleSubmit()
      }
    }

    if (open) {
      document.addEventListener("keydown", handleKeyDown)
      return () => document.removeEventListener("keydown", handleKeyDown)
    }
  }, [open, role, isBanned])

  const handleSubmit = async () => {
    if (!user || !isSuperAdmin) return

    setIsSubmitting(true)
    try {
      // Update role if changed
      if (role !== user.role) {
        await onUpdateRole(user.uid, role)
      }

      // Update ban status if changed
      if (isBanned !== (user.isBanned || false)) {
        await onToggleBan(user.uid, isBanned)
      }

      onOpenChange(false)
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!user) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            Modifier l'utilisateur
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* User Info */}
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-gray-200">
              <img
                src={user.photoURL || "/placeholder.svg?height=48&width=48&query=user-avatar"}
                alt={user.displayName || "Utilisateur"}
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <div className="font-medium text-gray-900">{user.displayName || "Utilisateur sans nom"}</div>
              <div className="text-sm text-gray-500">{user.email}</div>
            </div>
          </div>

          {!isSuperAdmin && (
            <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <span className="text-sm text-amber-800">
                Seul le super administrateur peut modifier les utilisateurs
              </span>
            </div>
          )}

          {/* Role Selection */}
          <div className="space-y-2">
            <Label htmlFor="role">Rôle</Label>
            <Select value={role} onValueChange={(value: "user" | "admin") => setRole(value)} disabled={!isSuperAdmin}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Utilisateur
                  </div>
                </SelectItem>
                <SelectItem value="admin">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Administrateur
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Ban Status */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="banned">Statut du compte</Label>
              <div className="text-sm text-gray-500">{isBanned ? "Compte banni" : "Compte actif"}</div>
            </div>
            <div className="flex items-center gap-2">
              <Switch id="banned" checked={isBanned} onCheckedChange={setIsBanned} disabled={!isSuperAdmin} />
              <Badge variant={isBanned ? "destructive" : "secondary"}>{isBanned ? "Banni" : "Actif"}</Badge>
            </div>
          </div>

          {/* User Stats */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-gray-500">Inscription</div>
              <div className="font-medium">
                {user.createdAt instanceof Date
                  ? user.createdAt.toLocaleDateString()
                  : new Date(user.createdAt.seconds * 1000).toLocaleDateString()}
              </div>
            </div>
            <div>
              <div className="text-gray-500">Dernière connexion</div>
              <div className="font-medium">
                {user.lastLogin instanceof Date
                  ? user.lastLogin.toLocaleDateString()
                  : new Date(user.lastLogin.seconds * 1000).toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Annuler
            </Button>
            <Button onClick={handleSubmit} disabled={!isSuperAdmin || isSubmitting || loading} className="flex-1">
              {isSubmitting ? "Mise à jour..." : "Sauvegarder"}
            </Button>
          </div>

          <div className="text-xs text-gray-500 text-center">Ctrl+Entrée pour sauvegarder • Échap pour fermer</div>
        </div>
      </DialogContent>
    </Dialog>
  )
}