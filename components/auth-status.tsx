"use client"

import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { User, ShoppingBag, Package, LayoutDashboard } from "lucide-react"

export default function AuthStatus() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return (
      <Button variant="ghost" size="icon" disabled>
        <User className="h-5 w-5" />
      </Button>
    )
  }

  if (session) {
    const userRole = session.user?.role || "buyer"

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>
            <div className="flex flex-col">
              <span>{session.user?.name}</span>
              <span className="text-xs text-muted-foreground capitalize">{userRole}</span>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/profile">Profile</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/dashboard">Dashboard</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/dashboard/orders">
              <ShoppingBag className="mr-2 h-4 w-4" />
              My Orders
            </Link>
          </DropdownMenuItem>

          {(userRole === "seller" || userRole === "admin") && (
            <DropdownMenuItem asChild>
              <Link href="/dashboard/selling">
                <Package className="mr-2 h-4 w-4" />
                My Listings
              </Link>
            </DropdownMenuItem>
          )}

          {userRole === "admin" && (
            <DropdownMenuItem asChild>
              <Link href="/admin">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Admin Dashboard
              </Link>
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })}>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <Button asChild variant="default">
      <Link href="/login">Login</Link>
    </Button>
  )
}

