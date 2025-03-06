import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"
import stripe from "@/lib/stripe"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { items, shippingDetails } = await request.json()

    if (!items || !items.length) {
      return NextResponse.json({ error: "No items provided for checkout" }, { status: 400 })
    }

    // Calculate order total and prepare line items for Stripe
    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.title,
          description: `Author: ${item.author}`,
          images: [
            item.coverImage.startsWith("http") ? item.coverImage : `${process.env.NEXTAUTH_URL}${item.coverImage}`,
          ],
        },
        unit_amount: Math.round(item.price * 100), // Stripe uses cents
      },
      quantity: item.quantity,
    }))

    // Create a Stripe checkout session
    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.NEXTAUTH_URL}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/cart`,
      customer_email: session.user.email || undefined,
      metadata: {
        userId: session.user.id,
      },
      shipping_address_collection: {
        allowed_countries: ["US", "CA", "GB", "IN"], // Add countries you want to support
      },
    })

    // Store order in database
    const client = await clientPromise
    const db = client.db()

    await db.collection("orders").insertOne({
      userId: new ObjectId(session.user.id),
      items,
      shippingDetails,
      total: items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0),
      status: "pending",
      stripeSessionId: stripeSession.id,
      createdAt: new Date(),
    })

    return NextResponse.json({ sessionId: stripeSession.id, url: stripeSession.url })
  } catch (error) {
    console.error("Checkout error:", error)
    return NextResponse.json({ error: "An error occurred during checkout" }, { status: 500 })
  }
}

