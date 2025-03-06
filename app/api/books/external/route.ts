import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q") || ""
    const category = searchParams.get("category") || ""
    const condition = searchParams.get("condition") || ""
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const minPrice = searchParams.get("minPrice") ? Number.parseFloat(searchParams.get("minPrice")!) : undefined
    const maxPrice = searchParams.get("maxPrice") ? Number.parseFloat(searchParams.get("maxPrice")!) : undefined
    const sortBy = searchParams.get("sortBy") || "newest"

    // First, try to get books from our database
    const client = await clientPromise
    const db = client.db()

    // Build query
    const dbQuery: any = {}

    if (category) {
      dbQuery.category = { $regex: new RegExp(category, "i") }
    }

    if (condition) {
      dbQuery.condition = { $regex: new RegExp(condition, "i") }
    }

    if (query) {
      dbQuery.$or = [
        { title: { $regex: new RegExp(query, "i") } },
        { author: { $regex: new RegExp(query, "i") } },
        { description: { $regex: new RegExp(query, "i") } },
      ]
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      dbQuery.price = {}
      if (minPrice !== undefined) dbQuery.price.$gte = minPrice
      if (maxPrice !== undefined) dbQuery.price.$lte = maxPrice
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
    const dbBooks = await db.collection("books").find(dbQuery).sort(sortOptions).limit(limit).toArray()

    // If we have enough books from the database, return them
    if (dbBooks.length >= limit) {
      return NextResponse.json({
        books: dbBooks,
        total: dbBooks.length,
        page,
        limit,
        source: "database",
      })
    }

    // If we don't have enough books, fetch from Open Library API to supplement
    const remainingLimit = limit - dbBooks.length

    // Fetch books from Open Library API
    // const response = await fetch(
    //   `https://openlibrary.org/search.json?q=${encodeURIComponent(query || category || "books")}&page=${page}&limit=${remainingLimit}`,
    // )
    const response = { ok: false}

    if (!response.ok) {
      // If external API fails, just return what we have from the database
      return NextResponse.json({
        books: dbBooks,
        total: dbBooks.length,
        page,
        limit,
        source: "database",
      })
    }

    
    const data = await response.json()

    // Transform the data to match our Book model
    const externalBooks = data.docs.map((book: any) => ({
      _id: book.key.replace("/works/", ""),
      title: book.title,
      author: book.author_name ? book.author_name[0] : "Unknown Author",
      price: (Math.random() * 20 + 5).toFixed(2), // Random price between $5 and $25
      originalPrice: (Math.random() * 30 + 10).toFixed(2), // Random original price between $10 and $40
      coverImage: book.cover_i
        ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
        : "/placeholder.svg?height=400&width=300",
      condition: ["New", "Like New", "Very Good", "Good", "Acceptable"][Math.floor(Math.random() * 5)],
      category: book.subject ? book.subject[0] : "Fiction",
      seller: {
        _id: "external-seller",
        name: "BookTreasure Store",
      },
      description: book.first_sentence ? book.first_sentence[0] : "No description available.",
      isbn: book.isbn ? book.isbn[0] : "Unknown ISBN",
      language: book.language ? book.language[0] : "English",
      pages: book.number_of_pages_median || 200,
      publishedYear: book.first_publish_year || 2000,
      quantity: Math.floor(Math.random() * 10) + 1, // Random quantity between 1 and 10
    }))

    // Combine database books with external books
    const combinedBooks = [...dbBooks, ...externalBooks.slice(0, remainingLimit)]

    return NextResponse.json({
      books: combinedBooks,
      total: dbBooks.length + data.numFound,
      page,
      limit,
      source: "combined",
    })
  } catch (error) {
    console.error("Error fetching books:", error)
    return NextResponse.json({ error: "An error occurred while fetching books" }, { status: 500 })
  }
}

