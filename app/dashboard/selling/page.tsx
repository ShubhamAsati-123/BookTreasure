"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Edit, Trash2, Plus, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface Book {
  _id: string
  title: string
  author: string
  price: number
  condition: string
  quantity: number
  createdAt: string
}

export default function SellingDashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [bookToDelete, setBookToDelete] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    if (status === "loading") return

    if (!session) {
      router.push("/login?callbackUrl=/dashboard/selling")
      return
    }

    const fetchSellerBooks = async () => {
      try {
        const response = await fetch("/api/seller/books")
        if (!response.ok) throw new Error("Failed to fetch books")

        const data = await response.json()
        setBooks(data)
      } catch (error) {
        console.error("Error fetching books:", error)
        toast({
          title: "Error",
          description: "Failed to load your book listings",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchSellerBooks()
  }, [session, status, router, toast])

  const handleDeleteBook = async (bookId: string) => {
    try {
      const response = await fetch(`/api/books/${bookId}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete book")

      setBooks(books.filter((book) => book._id !== bookId))

      toast({
        title: "Success",
        description: "Book listing deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting book:", error)
      toast({
        title: "Error",
        description: "Failed to delete book listing",
        variant: "destructive",
      })
    } finally {
      setBookToDelete(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Book Listings</h1>
        <Button asChild>
          <Link href="/sell">
            <Plus className="mr-2 h-4 w-4" /> Add New Book
          </Link>
        </Button>
      </div>

      {books.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
          <h2 className="text-xl font-semibold mb-4">No Books Listed Yet</h2>
          <p className="text-gray-600 mb-6">You haven't listed any books for sale yet.</p>
          <Button asChild>
            <Link href="/sell">List Your First Book</Link>
          </Button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Book</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Condition</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Listed On</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {books.map((book) => (
                <TableRow key={book._id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="relative h-12 w-10 flex-shrink-0">
                        <Image
                          src={book.coverImage || "/placeholder.svg"}
                          alt={book.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-medium">{book.title}</div>
                        <div className="text-sm text-gray-500">{book.author}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>${book.price.toFixed(2)}</TableCell>
                  <TableCell>{book.condition}</TableCell>
                  <TableCell>{book.quantity}</TableCell>
                  <TableCell>{new Date(book.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/dashboard/selling/edit/${book._id}`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" className="text-red-500 hover:text-red-700">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete this book listing. This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteBook(book._id)}
                              className="bg-red-500 hover:bg-red-700"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}

