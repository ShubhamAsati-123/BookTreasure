"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Heart, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/context/cart-context"
import { useToast } from "@/components/ui/use-toast"
import type { Book } from "@/types/book"
import { Skeleton } from "@/components/ui/skeleton"

interface BookListProps {
  search?: string
  category?: string
  condition?: string
  minPrice?: number
  maxPrice?: number
  sortBy?: string
}

export default function BookList({
  search = "",
  category = "",
  condition = "",
  minPrice,
  maxPrice,
  sortBy = "newest",
}: BookListProps) {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const { addToCart } = useCart()
  const { toast } = useToast()

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        // Build query parameters
        const params = new URLSearchParams()
        if (search) params.append("q", search)
        if (category) params.append("category", category)
        if (condition) params.append("condition", condition)
        if (minPrice !== undefined) params.append("minPrice", minPrice.toString())
        if (maxPrice !== undefined) params.append("maxPrice", maxPrice.toString())
        params.append("sortBy", sortBy)

        // Fetch books from our API
        const response = await fetch(`/api/books/external?${params.toString()}`)
        if (!response.ok) throw new Error("Failed to fetch books")

        const data = await response.json()
        setBooks(data.books)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching books:", error)
        setLoading(false)
      }
    }

    fetchBooks()
  }, [search, category, condition, minPrice, maxPrice, sortBy])

  const handleAddToCart = (book: Book) => {
    addToCart(book)
    toast({
      title: "Added to cart",
      description: `${book.title} has been added to your cart.`,
    })
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <Skeleton className="h-64 w-full mb-4" />
            <Skeleton className="h-4 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2 mb-4" />
            <Skeleton className="h-6 w-1/4 mb-2" />
          </div>
        ))}
      </div>
    )
  }

  if (books.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold mb-2">No books found</h3>
        <p className="text-gray-600 mb-4">Try adjusting your search or filter criteria</p>
        <Button asChild>
          <Link href="/books">Clear all filters</Link>
        </Button>
      </div>
    )
  }

  return (
    <div>
      <p className="mb-4 text-gray-600">{books.length} books found</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.map((book) => (
          <div key={book._id} className="book-card bg-white rounded-lg shadow-md overflow-hidden">
            <Link href={`/books/${book._id}`} className="block relative h-64">
              <Image
                src={book.coverImage || "/placeholder.svg?height=400&width=300"}
                alt={book.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              {book.originalPrice > book.price && (
                <div className="absolute top-2 right-2 bg-secondary text-white text-xs font-bold px-2 py-1 rounded">
                  {Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100)}% OFF
                </div>
              )}
            </Link>
            <div className="p-4">
              <Link href={`/books/${book._id}`}>
                <h3 className="font-semibold text-lg mb-1 hover:text-primary transition-colors line-clamp-1">
                  {book.title}
                </h3>
              </Link>
              <p className="text-gray-600 text-sm mb-2">{book.author}</p>
              <div className="flex items-center mb-3">
                <span className="text-primary font-bold">
                  ${typeof book.price === "number" ? book.price.toFixed(2) : book.price}
                </span>
                {book.originalPrice > book.price && (
                  <span className="text-gray-500 text-sm line-through ml-2">
                    ${typeof book.originalPrice === "number" ? book.originalPrice.toFixed(2) : book.originalPrice}
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">{book.condition}</span>
                <div className="flex space-x-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-primary">
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-500 hover:text-primary"
                    onClick={() => handleAddToCart(book)}
                  >
                    <ShoppingCart className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

