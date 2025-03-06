"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useCart } from "@/context/cart-context"
import { useToast } from "@/components/ui/use-toast"
import { useSession } from "next-auth/react"

export default function CheckoutButton() {
  const [isProcessing, setIsProcessing] = useState(false)
  const { cartItems } = useCart()
  const { toast } = useToast()
  const router = useRouter()
  const { status } = useSession()

  const handleCheckout = async () => {
    if (status !== "authenticated") {
      router.push(`/login?callbackUrl=${encodeURIComponent("/cart")}`)
      return
    }

    if (cartItems.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add items to your cart before checkout",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cartItems,
          shippingDetails: {}, // This would be filled with shipping details if collected
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Checkout failed")
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error("No checkout URL returned")
      }
    } catch (error) {
      console.error("Checkout error:", error)
      toast({
        title: "Checkout failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      })
      setIsProcessing(false)
    }
  }

  return (
    <Button className="w-full" size="lg" onClick={handleCheckout} disabled={isProcessing}>
      {isProcessing ? "Processing..." : "Proceed to Checkout"}
    </Button>
  )
}

