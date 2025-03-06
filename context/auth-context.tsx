"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useSession } from "next-auth/react"

interface User {
  _id: string
  name: string
  email: string
  role: string
  image?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  role: string | null
  isSeller: boolean
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession()
  const [user, setUser] = useState<User | null>(null)
  const [role, setRole] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === "loading") {
      return
    }

    if (!session) {
      setUser(null)
      setRole(null)
      setIsLoading(false)
      return
    }

    // Fetch user data including role from API
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/profile")
        if (response.ok) {
          const userData = await response.json()
          setUser(userData)
          setRole(userData.role || "buyer") // Default to buyer if no role is set
        } else {
          console.error("Failed to fetch user data")
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [session, status])

  // Derived state for role checks
  const isSeller = role === "seller" || role === "admin"
  const isAdmin = role === "admin"

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        role,
        isSeller,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

