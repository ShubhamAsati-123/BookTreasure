"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingBag, Package, User, CreditCard, BookOpen } from "lucide-react"
import { useAuth } from "@/context/auth-context"

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { isSeller, isAdmin } = useAuth()

  useEffect(() => {
    if (status === "loading") return

    if (!session) {
      router.push("/login?callbackUrl=/dashboard")
    }
  }, [session, status, router])

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="mr-2 h-5 w-5 text-primary" />
              My Profile
            </CardTitle>
            <CardDescription>View and manage your account details</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Update your personal information, change your password, and manage your account settings.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link href="/profile">View Profile</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ShoppingBag className="mr-2 h-5 w-5 text-primary" />
              My Orders
            </CardTitle>
            <CardDescription>Track and manage your orders</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              View your order history, check order status, and download invoices for your purchases.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link href="/dashboard/orders">View Orders</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="mr-2 h-5 w-5 text-primary" />
              Browse Books
            </CardTitle>
            <CardDescription>Discover new books to read</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Explore our collection of pre-loved books across various genres and find your next great read.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link href="/books">Browse Books</Link>
            </Button>
          </CardFooter>
        </Card>

        {isSeller && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="mr-2 h-5 w-5 text-primary" />
                My Listings
              </CardTitle>
              <CardDescription>Manage your book listings</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                View, edit, and manage the books you've listed for sale. Track inventory and sales.
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" className="w-full">
                <Link href="/dashboard/selling">View Listings</Link>
              </Button>
            </CardFooter>
          </Card>
        )}

        {!isSeller && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="mr-2 h-5 w-5 text-primary" />
                Become a Seller
              </CardTitle>
              <CardDescription>Start selling your books</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Join our community of sellers and give your pre-loved books a second life while earning money.
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" className="w-full">
                <Link href="/become-seller">Become a Seller</Link>
              </Button>
            </CardFooter>
          </Card>
        )}

        {isAdmin && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="mr-2 h-5 w-5 text-primary" />
                Admin Dashboard
              </CardTitle>
              <CardDescription>Manage the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Access admin tools to manage users, books, orders, and other platform settings.
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" className="w-full">
                <Link href="/admin">Admin Dashboard</Link>
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  )
}

