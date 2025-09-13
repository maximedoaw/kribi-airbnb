"use client"

import { useState, useEffect } from "react"
import { collection, onSnapshot, updateDoc, doc, serverTimestamp, query, where } from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { UserData } from "@/types/users"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth } from "@/lib/firebase"

export function useUsers() {
  const [users, setUsers] = useState<UserData[]>([])
  const [loading, setLoading] = useState(false)
  const [user] = useAuthState(auth)

  // Check if current user is super admin
  const isSuperAdmin = user?.email === process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAIL

  useEffect(() => {
    if (!user) return

    // Query all users except current user and super admin
    const usersQuery = query(
      collection(db, "users"),
      where("email", "!=", user.email)
    )

    const unsubscribe = onSnapshot(usersQuery, 
      (snapshot) => {
        const usersData = snapshot.docs.map((doc) => ({
          uid: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          lastLogin: doc.data().lastLogin?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        })) as UserData[]

        // Sort by creation date (newest first)
        usersData.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        setUsers(usersData)
      }, 
      (error) => {
        console.error("Erreur lors de la récupération des utilisateurs:", error)
      }
    )

    return unsubscribe
  }, [user])

  const updateUserRole = async (userId: string, newRole: "user" | "admin") => {
    if (!isSuperAdmin) {
      throw new Error("Seul le super administrateur peut modifier les rôles")
    }

    setLoading(true)
    try {
      await updateDoc(doc(db, "users", userId), {
        role: newRole,
        updatedAt: serverTimestamp(),
      })
    } catch (error) {
      console.error("Erreur lors de la mise à jour du rôle:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const toggleUserBan = async (userId: string, isBanned: boolean) => {
    if (!isSuperAdmin) {
      throw new Error("Seul le super administrateur peut bannir des utilisateurs")
    }

    setLoading(true)
    try {
      await updateDoc(doc(db, "users", userId), {
        isBanned,
        updatedAt: serverTimestamp(),
      })
    } catch (error) {
      console.error("Erreur lors du bannissement:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  return {
    users,
    loading,
    isSuperAdmin,
    updateUserRole,
    toggleUserBan,
  }
}