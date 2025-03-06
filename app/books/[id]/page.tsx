import Image from "next/image"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { ObjectId } from "mongodb"
import clientPromise from "@/lib/mongodb"
import AddToCartButton from "@/components/add-to-cart-button"
import BookDetails from "@/components/book-details"
import RelatedBooks from "@/components/related-books"
import type { Book } from "@/types/book"

interface BookPageProps {
  params: {
    id: string
  }
}

// Get book from database or mock data
async function getBook(id: string): Promise<Book | null> {
  try {
    // Check if id is a valid MongoDB ObjectId
    if (ObjectId.isValid(id)) {
      const client = await clientPromise
      const db = client.db()

      const book = await db.collection("books").findOne({ _id: new ObjectId(id) })

      if (book) {
        return book as Book
      }
    }

    // If not found in database or not a valid ObjectId, use mock data
    const mockBooks: Record<string, Book> = {
      "1": {
        _id: "1",
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        price: 8.99,
        originalPrice: 14.99,
        coverImage: "/placeholder.svg?height=600&width=400",
        condition: "Good",
        category: "Fiction",
        seller: { _id: "user1", name: "John Doe" },
        description:
          "Set in the American South during the 1930s, the story of To Kill a Mockingbird centers on a young girl named Scout Finch. Through her eyes, the novel explores themes of racial injustice and moral growth as her father, lawyer Atticus Finch, defends a Black man falsely accused of a terrible crime.",
        isbn: "9780061120084",
        language: "English",
        pages: 336,
        publishedYear: 1960,
        quantity: 3,
      },
      "2": {
        _id: "2",
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        price: 7.49,
        originalPrice: 12.99,
        coverImage: "/placeholder.svg?height=600&width=400",
        condition: "Very Good",
        category: "Fiction",
        seller: { _id: "user2", name: "Jane Smith" },
        description:
          "The Great Gatsby is a 1925 novel by American writer F. Scott Fitzgerald. Set in the Jazz Age on Long Island, the novel depicts first-person narrator Nick Carraway's interactions with mysterious millionaire Jay Gatsby and Gatsby's obsession to reunite with his former lover, Daisy Buchanan.",
        isbn: "9780743273565",
        language: "English",
        pages: 180,
        publishedYear: 1925,
        quantity: 2,
      },
    }

    return mockBooks[id] || null
  } catch (error) {
    console.error("Error fetching book:", error)
    return null
  }
}

export async function generateMetadata({ params }: BookPageProps): Promise<Metadata> {
  const book = await getBook(params.id)

  if (!book) {
    return {
      title: "Book Not Found",
    }
  }

  return {
    title: `${book.title} by ${book.author} | BookTreasure`,
    description: book.description,
  }
}

export default async function BookPage({ params }: BookPageProps) {
  const book = await getBook(params.id)

  if (!book) {
    notFound()
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="relative h-[400px] md:h-[500px] rounded-lg overflow-hidden">
          <Image
            src={book.coverImage || "/placeholder.svg?height=600&width=400"}
            alt={book.title}
            fill
            className="object-contain"
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
          <p className="text-xl text-gray-600 mb-4">by {book.author}</p>

          <div className="flex items-center mb-6">
            <span className="text-2xl font-bold text-primary mr-3">
              ${typeof book.price === "number" ? book.price.toFixed(2) : book.price}
            </span>
            {book.originalPrice > book.price && (
              <>
                <span className="text-gray-500 text-lg line-through mr-3">
                  ${typeof book.originalPrice === "number" ? book.originalPrice.toFixed(2) : book.originalPrice}
                </span>
                <span className="bg-secondary text-white text-sm font-bold px-2 py-1 rounded">
                  {Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100)}% OFF
                </span>
              </>
            )}
          </div>

          <div className="mb-6">
            <p className="text-gray-700 mb-4">{book.description}</p>
          </div>

          <div className="mb-6">
            <div className="inline-block px-3 py-1 bg-gray-100 rounded-full text-sm font-medium mr-2 mb-2">
              {book.condition}
            </div>
            <div className="inline-block px-3 py-1 bg-gray-100 rounded-full text-sm font-medium mr-2 mb-2">
              {book.category}
            </div>
            <div className="inline-block px-3 py-1 bg-gray-100 rounded-full text-sm font-medium mr-2 mb-2">
              {book.language}
            </div>
          </div>

          <AddToCartButton book={book} />

          <p className="text-sm text-gray-500 mt-4">
            Sold by {book.seller.name} • {book.quantity} in stock
          </p>
        </div>
      </div>

      <BookDetails book={book} />

      <RelatedBooks category={book.category} currentBookId={book._id} />
    </main>
  )
}

