"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import type { Book } from "@/types/book"

interface RelatedBooksProps {
  category: string
  currentBookId: string
}

export default function RelatedBooks({ category, currentBookId }: RelatedBooksProps) {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRelatedBooks = async () => {
      try {
        // In a real app, this would be an API call
        // const res = await fetch(`/api/books/related?category=${category}&exclude=${currentBookId}`)
        // const data = await res.json()

        // For demo purposes, using mock data
        const mockBooks: Book[] = [
          {
            _id: "3",
            title: "Sapiens: A Brief History of Humankind",
            author: "Yuval Noah Harari",
            price: 12.99,
            originalPrice: 19.99,
            coverImage: "/placeholder.svg?height=400&width=300",
            condition: "Like New",
            category: "Non-Fiction",
            seller: { _id: "user3", name: "Alex Johnson" },
            description: "A journey through the history of our species.",
            isbn: "9780062316097",
            language: "English",
            pages: 464,
            publishedYear: 2014,
            quantity: 1,
          },
          {
            _id: "4",
            title: "The Hobbit",
            author: "J.R.R. Tolkien",
            price: 9.99,
            originalPrice: 15.99,
            coverImage: "/placeholder.svg?height=400&width=300",
            condition: "Good",
            category: "Fantasy",
            seller: { _id: "user4", name: "Sarah Williams" },
            description: "A fantasy novel about the journey of Bilbo Baggins.",
            isbn: "9780547928227",
            language: "English",
            pages: 304,
            publishedYear: 1937,
            quantity: 4,
          },
          {
            _id: "5",
            title: "1984",
            author: "George Orwell",
            price: 6.99,
            originalPrice: 11.99,
            coverImage: "/placeholder.svg?height=400&width=300",
            condition: "Acceptable",
            category: "Fiction",
            seller: { _id: "user5", name: "Michael Brown" },
            description: "A dystopian novel about totalitarianism and surveillance.",
            isbn: "9780451524935",
            language: "English",
            pages: 328,
            publishedYear: 1949,
            quantity: 2,
          },
          {
            _id: "6",
            title: "Pride and Prejudice",
            author: "Jane Austen",
            price: 5.99,
            originalPrice: 9.99,
            coverImage: "/placeholder.svg?height=400&width=300",
            condition: "Good",
            category: "Fiction",
            seller: { _id: "user6", name: "Emily Davis" },
            description: "A romantic novel about societal expectations and personal growth.",
            isbn: "9780141439518",
            language: "English",
            pages: 432,
            publishedYear: 1813,
            quantity: 3,
          },
        ]

        // Filter to only include books in the same category and exclude current book
        const filteredBooks = mockBooks
          .filter((book) => book.category === category && book._id !== currentBookId)
          .slice(0, 4)

        setBooks(filteredBooks)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching related books:", error)
        setLoading(false)
      }
    }

    fetchRelatedBooks()
  }, [category, currentBookId])

  if (loading) {
    return <div>Loading related books...</div>
  }

  if (books.length === 0) {
    return null
  }

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-6">Related Books</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {books.map((book) => (
          <Link key={book._id} href={`/books/${book._id}`} className="book-card block">
            <div className="relative h-48 mb-2 rounded overflow-hidden">
              <Image src={book.coverImage || "/placeholder.svg"} alt={book.title} fill className="object-cover" />
            </div>
            <h3 className="font-medium line-clamp-1">{book.title}</h3>
            <p className="text-sm text-gray-600">{book.author}</p>
            <p className="font-bold text-primary">${book.price.toFixed(2)}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}

