"use client"

import AuthScreen from "@/components/auth-screen";
import HomeScreen from "@/components/home-screen";
import BeachLoader from "@/components/loader";
import { auth } from "@/lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

export default function Page() {
  const [user, loading, error] = useAuthState(auth)
  if (loading) return <BeachLoader />

  return (
  <>
   {user ? <HomeScreen/> : <AuthScreen />}
  </>
  )
}
