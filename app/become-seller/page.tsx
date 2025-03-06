"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { BookOpen, ShoppingBag, DollarSign, TrendingUp } from "lucide-react"

export default function BecomeSellerPage() {
  const { data: session, update } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleBecomeSeller = async () => {
    if (!session) {
      router.push("/login?callbackUrl=/become-seller")
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/users/become-seller", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to update role")
      }

      // Update the session with the new role
      await update({ role: "seller" })

      toast({
        title: "Success!",
        description: "You are now a seller. You can start listing books for sale.",
      })

      // Redirect to the sell page
      router.push("/sell")
    } catch (error) {
      console.error("Error becoming a seller:", error)
      toast({
        title: "Error",
        description: "There was a problem updating your account. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Become a Seller</h1>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Start Selling Your Books Today</CardTitle>
            <CardDescription>Join our community of book sellers and give your books a second life</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-6">
              As a BookTreasure seller, you can list your pre-loved books and reach thousands of readers. It's easy to
              get started, and you'll be making money from your old books in no time.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="flex items-start space-x-4">
                <ShoppingBag className="h-8 w-8 text-primary flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1">Easy Listing</h3>
                  <p className="text-sm text-gray-600">List your books in minutes with our simple form</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <DollarSign className="h-8 w-8 text-primary flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1">Set Your Price</h3>
                  <p className="text-sm text-gray-600">You decide how much your books are worth</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <BookOpen className="h-8 w-8 text-primary flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1">Reach Book Lovers</h3>
                  <p className="text-sm text-gray-600">Connect with readers looking for exactly what you're selling</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <TrendingUp className="h-8 w-8 text-primary flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1">Grow Your Business</h3>
                  <p className="text-sm text-gray-600">Build a reputation and expand your book selling venture</p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleBecomeSeller} disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Processing..." : "Become a Seller"}
            </Button>
          </CardFooter>
        </Card>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Seller Guidelines</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Books must be in the condition described</li>
            <li>Respond to buyer inquiries promptly</li>
            <li>Ship books within 2 business days of purchase</li>
            <li>Package books securely to prevent damage</li>
            <li>Be honest and transparent in all listings</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

