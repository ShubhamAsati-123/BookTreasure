import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import clientPromise from "@/lib/mongodb"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { ObjectId } from "mongodb"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const bookId = params.id

    const client = await clientPromise
    const db = client.db()

    const book = await db.collection("books").findOne({ _id: new ObjectId(bookId) })

    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 })
    }

    return NextResponse.json(book)
  } catch (error) {
    console.error("Error fetching book:", error)
    return NextResponse.json({ error: "An error occurred while fetching the book" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const bookId = params.id
    const updateData = await request.json()

    const client = await clientPromise
    const db = client.db()

    // Get the book to check ownership
    const book = await db.collection("books").findOne({ _id: new ObjectId(bookId) })

    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 })
    }

    // Check if the user is the seller or an admin
    if (book.seller._id !== session.user.id && session.user.role !== "admin") {
      return NextResponse.json({ error: "You do not have permission to update this book" }, { status: 403 })
    }

    // Update the book
    const result = await db.collection("books").updateOne(
      { _id: new ObjectId(bookId) },
      {
        $set: {
          ...updateData,
          updatedAt: new Date(),
        },
      },
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Book updated successfully" })
  } catch (error) {
    console.error("Error updating book:", error)
    return NextResponse.json({ error: "An error occurred while updating the book" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const bookId = params.id

    const client = await clientPromise
    const db = client.db()

    // Get the book to check ownership
    const book = await db.collection("books").findOne({ _id: new ObjectId(bookId) })

    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 })
    }

    // Check if the user is the seller or an admin
    if (book.seller._id !== session.user.id && session.user.role !== "admin") {
      return NextResponse.json({ error: "You do not have permission to delete this book" }, { status: 403 })
    }

    // Delete the book
    const result = await db.collection("books").deleteOne({ _id: new ObjectId(bookId) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Book deleted successfully" })
  } catch (error) {
    console.error("Error deleting book:", error)
    return NextResponse.json({ error: "An error occurred while deleting the book" }, { status: 500 })
  }
}

