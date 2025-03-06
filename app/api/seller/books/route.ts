import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import clientPromise from "@/lib/mongodb"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { ObjectId } from "mongodb"

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db()

    // Check if user is a seller or admin
    const user = await db.collection("users").findOne({ _id: new ObjectId(session.user.id) })

    if (!user || (user.role !== "seller" && user.role !== "admin")) {
      return NextResponse.json({ error: "Only sellers can access this endpoint" }, { status: 403 })
    }

    // Get books listed by this seller
    const books = await db.collection("books").find({ "seller._id": session.user.id }).sort({ createdAt: -1 }).toArray()

    return NextResponse.json(books)
  } catch (error) {
    console.error("Error fetching seller books:", error)
    return NextResponse.json({ error: "An error occurred while fetching books" }, { status: 500 })
  }
}

