"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Shield, User, Ban, Edit, AlertTriangle, Search, Crown } from "lucide-react"
import { useUsers } from "@/hooks/use-users"
import { EditUserDialog } from "./edit-user-dialog"
import { UserData } from "@/types/users"
import { Input } from "@/components/ui/input"

export function UsersTab() {
  const { users, loading, isSuperAdmin, updateUserRole, toggleUserBan } = useUsers()
  const [editingUser, setEditingUser] = useState<UserData | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  // Ajouter le super admin à la liste des utilisateurs
  const allUsers = useMemo(() => {
    const superAdminEmail = process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAIL;
    const superAdminUser: UserData = {
      uid: "super-admin",
      email: superAdminEmail || "superadmin@example.com",
      displayName: "Super Administrateur",
      role: "admin",
      isBanned: false,
      createdAt: new Date(),
      lastLogin: new Date(),
    };

    return [superAdminUser, ...users];
  }, [users]);

  const filteredUsers = useMemo(() => {
    return allUsers.filter(
      (user) =>
        user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }, [allUsers, searchTerm])

  const handleQuickToggleBan = async (user: UserData) => {
    if (!isSuperAdmin || user.uid === "super-admin") return

    try {
      await toggleUserBan(user.uid, !user.isBanned)
    } catch (error) {
      console.error("Erreur:", error)
    }
  }

  const handleQuickRoleToggle = async (user: UserData) => {
    if (!isSuperAdmin || user.uid === "super-admin") return

    try {
      const newRole = user.role === "admin" ? "user" : "admin"
      await updateUserRole(user.uid, newRole)
    } catch (error) {
      console.error("Erreur:", error)
    }
  }

  // Vérifier si un utilisateur est le super admin
  const isSuperAdminUser = (user: UserData) => {
    return user.uid === "super-admin" || user.email === process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAIL;
  }

  return (
    <>
      <Card className="border-pink-100 shadow-sm">
        <CardHeader className="bg-pink-50 rounded-t-lg">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle className="text-pink-800 flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Gestion des Utilisateurs
              </CardTitle>
              <CardDescription className="text-pink-600">
                Liste de tous les utilisateurs inscrits sur la plateforme
              </CardDescription>
            </div>
            <div className="mt-4 md:mt-0 flex items-center gap-4">
              {!isSuperAdmin && (
                <div className="flex items-center gap-1 text-xs text-amber-600">
                  <AlertTriangle className="h-3 w-3" />
                  Lecture seule
                </div>
              )}
              <span className="text-sm text-pink-700">{filteredUsers.length} utilisateur(s) trouvé(s)</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {/* Barre de recherche */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un utilisateur par nom, email ou rôle..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-pink-50">
                <TableRow>
                  <TableHead className="text-pink-800">Utilisateur</TableHead>
                  <TableHead className="text-pink-800">Email</TableHead>
                  <TableHead className="text-pink-800">Rôle</TableHead>
                  <TableHead className="text-pink-800">Statut</TableHead>
                  <TableHead className="text-pink-800">Inscription</TableHead>
                  <TableHead className="text-pink-800">Téléphone</TableHead>
                  <TableHead className="text-right text-pink-800">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => {
                  const isSuperAdminUserAccount = isSuperAdminUser(user);
                  return (
                    <TableRow key={user.uid} className="hover:bg-pink-50/50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 flex-shrink-0 rounded-full overflow-hidden border border-pink-200">
                            <img
                              src={user.photoURL || "/placeholder.svg?height=40&width=40&query=user-avatar"}
                              alt={user.displayName || "Utilisateur"}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 flex items-center gap-1">
                              {user.displayName || "Utilisateur sans nom"}
                              {isSuperAdminUserAccount && <Crown className="h-4 w-4 text-yellow-500 fill-yellow-200" />}
                            </div>
                            <div className="text-sm text-muted-foreground">ID: {user.uid.slice(0, 8)}...</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-600">{user.email}</TableCell>
                      <TableCell>
                        <Badge
                          variant={user.role === "admin" ? "default" : "secondary"}
                          className={
                            user.role === "admin"
                              ? isSuperAdminUserAccount
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-purple-100 text-purple-800 hover:bg-purple-100 cursor-pointer"
                              : "bg-blue-100 text-blue-800 hover:bg-blue-100 cursor-pointer"
                          }
                          onClick={() => !isSuperAdminUserAccount && isSuperAdmin && handleQuickRoleToggle(user)}
                        >
                          {user.role === "admin" ? (
                            <>
                              <Shield className="h-3 w-3 mr-1" />
                              {isSuperAdminUserAccount ? "Super Admin" : "Administrateur"}
                            </>
                          ) : (
                            <>
                              <User className="h-3 w-3 mr-1" />
                              Client
                            </>
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={user.isBanned ? "destructive" : "secondary"}
                          className={
                            user.isBanned
                              ? "bg-red-100 text-red-800 hover:bg-red-100 cursor-pointer"
                              : "bg-green-100 text-green-800 hover:bg-green-100 cursor-pointer"
                          }
                          onClick={() => !isSuperAdminUserAccount && isSuperAdmin && handleQuickToggleBan(user)}
                        >
                          {user.isBanned ? (
                            <>
                              <Ban className="h-3 w-3 mr-1" />
                              Banni
                            </>
                          ) : (
                            "Actif"
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {user.createdAt instanceof Date
                          ? user.createdAt.toLocaleDateString()
                          : new Date(user.createdAt.seconds * 1000).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-gray-600">{user.phoneNumber || "Non renseigné"}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-blue-300 text-blue-700 hover:bg-blue-50 bg-transparent"
                          onClick={() => !isSuperAdminUserAccount && setEditingUser(user)}
                          disabled={!isSuperAdmin || isSuperAdminUserAccount}
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Modifier
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Aucun utilisateur trouvé</p>
            </div>
          )}
        </CardContent>
      </Card>

      <EditUserDialog
        user={editingUser}
        open={!!editingUser}
        onOpenChange={(open) => !open && setEditingUser(null)}
        onUpdateRole={updateUserRole}
        onToggleBan={toggleUserBan}
        isSuperAdmin={isSuperAdmin}
        loading={loading}
      />
    </>
  )
}