"use client"

import { useState } from "react"
import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/context/cart-context"
import { useToast } from "@/components/ui/use-toast"
import type { Book } from "@/types/book"

interface AddToCartButtonProps {
  book: Book
}

export default function AddToCartButton({ book }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1)
  const { addToCart } = useCart()
  const { toast } = useToast()

  const handleAddToCart = () => {
    addToCart(book, quantity)
    toast({
      title: "Added to cart",
      description: `${quantity} ${quantity === 1 ? "copy" : "copies"} of "${book.title}" added to your cart.`,
    })
  }

  return (
    <div>
      <div className="flex items-center mb-4">
        <button
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          className="w-8 h-8 flex items-center justify-center border rounded-l-md"
          disabled={quantity <= 1}
        >
          -
        </button>
        <span className="w-12 h-8 flex items-center justify-center border-t border-b">{quantity}</span>
        <button
          onClick={() => setQuantity(Math.min(book.quantity, quantity + 1))}
          className="w-8 h-8 flex items-center justify-center border rounded-r-md"
          disabled={quantity >= book.quantity}
        >
          +
        </button>
      </div>

      <Button onClick={handleAddToCart} className="w-full" size="lg">
        <ShoppingCart className="mr-2 h-5 w-5" />
        Add to Cart
      </Button>
    </div>
  )
}

