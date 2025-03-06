import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import clientPromise from "@/lib/mongodb"
import { authOptions } from "../auth/[...nextauth]/route"
import { ObjectId } from "mongodb"

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get("sessionId")
    const orderId = searchParams.get("orderId")

    const client = await clientPromise
    const db = client.db()

    const query: any = { userId: new ObjectId(session.user.id as string) }

    if (sessionId) {
      query.stripeSessionId = sessionId
    } else if (orderId) {
      query._id = new ObjectId(orderId)
    }

    // If no specific order is requested, return all orders for the user
    if (!sessionId && !orderId) {
      const orders = await db.collection("orders").find(query).sort({ createdAt: -1 }).toArray()

      return NextResponse.json(orders)
    }

    // Get specific order
    const order = await db.collection("orders").findOne(query)

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    return NextResponse.json(order)
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json({ error: "An error occurred while fetching orders" }, { status: 500 })
  }
}

