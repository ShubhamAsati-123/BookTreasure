import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get("category")
  const search = searchParams.get("search")
  const condition = searchParams.get("condition")
  const minPrice = searchParams.get("minPrice") ? Number.parseFloat(searchParams.get("minPrice")!) : undefined
  const maxPrice = searchParams.get("maxPrice") ? Number.parseFloat(searchParams.get("maxPrice")!) : undefined
  const sortBy = searchParams.get("sortBy") || "newest"

  try {
    const client = await clientPromise
    const db = client.db()

    // Build query
    const query: any = {}

    if (category) {
      query.category = { $regex: new RegExp(category, "i") }
    }

    if (condition) {
      query.condition = { $regex: new RegExp(condition, "i") }
    }

    if (search) {
      query.$or = [
        { title: { $regex: new RegExp(search, "i") } },
        { author: { $regex: new RegExp(search, "i") } },
        { description: { $regex: new RegExp(search, "i") } },
      ]
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {}
      if (minPrice !== undefined) query.price.$gte = minPrice
      if (maxPrice !== undefined) query.price.$lte = maxPrice
    }

    // Sort options
    const sortOptions: any = {}
    switch (sortBy) {
      case "price-low":
        sortOptions.price = 1
        break
      case "price-high":
        sortOptions.price = -1
        break
      case "title":
        sortOptions.title = 1
        break
      case "newest":
      default:
        sortOptions.createdAt = -1
    }

    // Get books from database
    const books = await db.collection("books").find(query).sort(sortOptions).limit(50).toArray()

    return NextResponse.json(books)
  } catch (error) {
    console.error("Error fetching books:", error)
    return NextResponse.json({ error: "An error occurred while fetching books" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is a seller or admin
    const client = await clientPromise
    const db = client.db()

    const user = await db.collection("users").findOne({ _id: new ObjectId(session.user.id) })

    if (!user || (user.role !== "seller" && user.role !== "admin")) {
      return NextResponse.json({ error: "Only sellers can list books" }, { status: 403 })
    }

    const bookData = await request.json()

    // Validate required fields
    const requiredFields = ["title", "author", "price", "condition", "category", "description"]
    for (const field of requiredFields) {
      if (!bookData[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    // Create book listing
    const newBook = {
      ...bookData,
      seller: {
        _id: user._id.toString(),
        name: user.name,
      },
      coverImage: bookData.coverImage || "/placeholder.svg?height=400&width=300",
      originalPrice: bookData.originalPrice || bookData.price * 1.2, // Default to 20% higher if not provided
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("books").insertOne(newBook)

    return NextResponse.json(
      {
        message: "Book listed successfully",
        bookId: result.insertedId,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating book listing:", error)
    return NextResponse.json({ error: "An error occurred while creating the book listing" }, { status: 500 })
  }
}

