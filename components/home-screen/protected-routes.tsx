"use client";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

const ADMIN_EMAILS = new Set([
  "maximedoaw204@gmail.com",
  "libertesarah7@gmail.com",
]);

type Props = {
  children: React.ReactNode;
  redirectTo?: string;
  requireAdmin?: boolean;
  userRole?: string | null; // passer depuis le parent si déjà connu
};

export default function ProtectedRoutes({ children, redirectTo = "/", requireAdmin = false, userRole = null }: Props) {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  React.useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace(redirectTo);
      } else if (requireAdmin) {
        const isAdmin = ADMIN_EMAILS.has(user.email ?? "") || userRole === "admin";
        if (!isAdmin) {
          router.replace(redirectTo);
        }
      }
    }
  }, [user, loading, router, redirectTo, requireAdmin, userRole]);

  if (loading) {
    return <Skeleton className="h-40 w-full" />;
  }

  if (!user) {
    return null;
  }

  if (requireAdmin) {
    const isAdmin = ADMIN_EMAILS.has(user.email ?? "") || userRole === "admin";
    if (!isAdmin) return null;
  }

  return <>{children}</>;
}


