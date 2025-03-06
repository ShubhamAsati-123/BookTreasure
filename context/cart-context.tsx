"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Book } from "@/types/book"

type CartItem = Book & { quantity: number; maxQuantity: number }

interface CartContextType {
  cartItems: CartItem[]
  addToCart: (book: Book, quantity?: number) => void
  removeFromCart: (bookId: string) => void
  updateQuantity: (bookId: string, quantity: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  // Load cart from localStorage on client-side
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("cart")
      if (savedCart) {
        setCartItems(JSON.parse(savedCart))
      }
    } catch (error) {
      console.error("Failed to load cart from localStorage:", error)
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(cartItems))
    } catch (error) {
      console.error("Failed to save cart to localStorage:", error)
    }
  }, [cartItems])

  const addToCart = (book: Book, quantity = 1) => {
    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex((item) => item._id === book._id)

      if (existingItemIndex >= 0) {
        // Item already exists in cart, update quantity
        const updatedItems = [...prevItems]
        const newQuantity = updatedItems[existingItemIndex].quantity + quantity

        // Ensure quantity doesn't exceed available stock
        updatedItems[existingItemIndex].quantity = Math.min(newQuantity, book.quantity)
        return updatedItems
      } else {
        // Add new item to cart
        return [
          ...prevItems,
          {
            ...book,
            quantity,
            maxQuantity: book.quantity,
          },
        ]
      }
    })
  }

  const removeFromCart = (bookId: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item._id !== bookId))
  }

  const updateQuantity = (bookId: string, quantity: number) => {
    setCartItems((prevItems) => prevItems.map((item) => (item._id === bookId ? { ...item, quantity } : item)))
  }

  const clearCart = () => {
    setCartItems([])
  }

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}

