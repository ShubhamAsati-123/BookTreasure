"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/context/cart-context"

export default function ThankYouPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { clearCart } = useCart()
  const [orderDetails, setOrderDetails] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const sessionId = searchParams.get("session_id")
  const orderId = searchParams.get("order_id")

  useEffect(() => {
    if (!sessionId && !orderId) {
      router.push("/")
      return
    }

    // Clear the cart after successful checkout
    clearCart()

    // Fetch order details
    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(`/api/orders?${sessionId ? `sessionId=${sessionId}` : `orderId=${orderId}`}`)
        if (response.ok) {
          const data = await response.json()
          setOrderDetails(data)
        }
      } catch (error) {
        console.error("Error fetching order details:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrderDetails()
  }, [sessionId, orderId, router, clearCart])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="animate-pulse">
          <div className="h-12 w-12 bg-gray-200 rounded-full mx-auto mb-4"></div>
          <div className="h-8 bg-gray-200 max-w-md mx-auto mb-4 rounded"></div>
          <div className="h-4 bg-gray-200 max-w-sm mx-auto mb-2 rounded"></div>
          <div className="h-4 bg-gray-200 max-w-xs mx-auto rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
      <h1 className="text-3xl font-bold mb-4">Thank You for Your Order!</h1>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        Your order has been successfully placed. We'll send you an email confirmation shortly.
      </p>

      {orderDetails && (
        <div className="bg-gray-50 p-6 rounded-lg max-w-md mx-auto mb-8 text-left">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <p className="mb-2">
            <span className="font-medium">Order ID:</span> {orderDetails._id}
          </p>
          <p className="mb-2">
            <span className="font-medium">Date:</span> {new Date(orderDetails.createdAt).toLocaleDateString()}
          </p>
          <p className="mb-2">
            <span className="font-medium">Total:</span> ${orderDetails.total.toFixed(2)}
          </p>
          <p className="mb-2">
            <span className="font-medium">Status:</span> {orderDetails.status}
          </p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button asChild>
          <Link href="/books">Continue Shopping</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/dashboard/orders">View My Orders</Link>
        </Button>
      </div>
    </div>
  )
}

