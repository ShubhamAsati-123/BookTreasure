import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import clientPromise from "@/lib/mongodb"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { ObjectId } from "mongodb"

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db()

    // Update user role to seller
    const result = await db.collection("users").updateOne(
      { _id: new ObjectId(session.user.id) },
      {
        $set: {
          role: "seller",
          updatedAt: new Date(),
        },
      },
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Successfully updated to seller role" })
  } catch (error) {
    console.error("Error updating user role:", error)
    return NextResponse.json({ error: "An error occurred while updating user role" }, { status: 500 })
  }
}

