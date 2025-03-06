import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import clientPromise from "@/lib/mongodb"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { ObjectId } from "mongodb"
import type { UserRole } from "@/models/user"

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is authenticated and is an admin
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { role } = await request.json()

    // Validate role
    if (!["buyer", "seller", "admin"].includes(role)) {
      return NextResponse.json({ error: "Invalid role. Must be buyer, seller, or admin" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db()

    // Update user role
    const result = await db.collection("users").updateOne(
      { _id: new ObjectId(params.id) },
      {
        $set: {
          role: role as UserRole,
          updatedAt: new Date(),
        },
      },
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "User role updated successfully" })
  } catch (error) {
    console.error("Error updating user role:", error)
    return NextResponse.json({ error: "An error occurred while updating user role" }, { status: 500 })
  }
}

