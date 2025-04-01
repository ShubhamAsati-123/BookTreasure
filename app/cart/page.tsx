"use client"
import Link from "next/link"
import Image from "next/image"
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/context/cart-context"
import { useToast } from "@/components/ui/use-toast"
import CheckoutButton from "@/components/checkout-button"

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart } = useCart()
  const { toast } = useToast()

  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  const shipping = subtotal > 35 ? 0 : 4.99
  const total = subtotal + shipping

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return

    const item = cartItems.find((item) => item._id === itemId)
    if (item && newQuantity <= item.quantity) {
      updateQuantity(itemId, newQuantity)
    } else {
      toast({
        title: "Maximum quantity reached",
        description: "You cannot add more than the available quantity.",
        variant: "destructive",
      })
    }
  }

  const handleRemoveItem = (itemId: string) => {
    removeFromCart(itemId)
    toast({
      title: "Item removed",
      description: "The item has been removed from your cart.",
    })
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="max-w-md mx-auto">
          <ShoppingCart className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-gray-600 mb-8">Looks like you haven't added any books to your cart yet.</p>
          <Button asChild size="lg">
            <Link href="/books">Browse Books</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="p-4 border-b bg-gray-50">
              <h2 className="font-semibold">Cart Items ({cartItems.length})</h2>
            </div>

            <div>
              {cartItems.map((item) => (
                <div key={item._id} className="p-4 border-b flex flex-col sm:flex-row gap-4">
                  <div className="relative h-24 w-16 flex-shrink-0">
                    <Image
                      src={item.coverImage || "/placeholder.svg"}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>

                  <div className="flex-grow">
                    <Link href={`/books/${item._id}`} className="font-medium hover:text-primary">
                      {item.title}
                    </Link>
                    <p className="text-sm text-gray-600">{item.author}</p>
                    <p className="text-sm text-gray-600">Condition: {item.condition}</p>
                    <p className="font-bold text-primary mt-1">${item.price.toFixed(2)}</p>
                  </div>

                  <div className="flex items-center">
                    <button
                      onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center border rounded-l-md"
                      disabled={item.quantity <= 1}
                      title="Decrease quantity"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-10 h-8 flex items-center justify-center border-t border-b">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center border rounded-r-md"
                      disabled={item.quantity >= item.maxQuantity}
                      title="Increase quantity"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>

                  <div className="flex items-center">
                    <p className="font-bold mr-4">${(item.price * item.quantity).toFixed(2)}</p>
                    <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(item._id)}>
                      <Trash2 className="h-4 w-4 text-gray-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden sticky top-20">
            <div className="p-4 border-b bg-gray-50">
              <h2 className="font-semibold">Order Summary</h2>
            </div>

            <div className="p-4">
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="border-t pt-2 mt-2 flex justify-between font-bold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <CheckoutButton />

              <p className="text-xs text-gray-500 text-center mt-2">Secure checkout powered by Stripe</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

