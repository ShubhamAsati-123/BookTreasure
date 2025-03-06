import { NextResponse } from "next/server"
import { headers } from "next/headers"
import stripe from "@/lib/stripe"
import clientPromise from "@/lib/mongodb"

export async function POST(request: Request) {
  try {
    const body = await request.text()
    const signature = headers().get("stripe-signature") as string

    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      throw new Error("Missing STRIPE_WEBHOOK_SECRET")
    }

    let event
    try {
      event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET)
    } catch (err) {
      console.error("Webhook signature verification failed:", err)
      return NextResponse.json({ error: "Webhook signature verification failed" }, { status: 400 })
    }

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object

        // Update order status in database
        const client = await clientPromise
        const db = client.db()

        await db.collection("orders").updateOne(
          { stripeSessionId: session.id },
          {
            $set: {
              status: "paid",
              paymentDetails: {
                paymentId: session.payment_intent,
                paymentMethod: session.payment_method_types[0],
                amountPaid: session.amount_total / 100, // Convert from cents
                paidAt: new Date(),
              },
              updatedAt: new Date(),
            },
          },
        )

        // Update book quantities
        const order = await db.collection("orders").findOne({ stripeSessionId: session.id })

        if (order && order.items) {
          for (const item of order.items) {
            await db.collection("books").updateOne({ _id: item._id }, { $inc: { quantity: -item.quantity } })
          }
        }

        break
      }
      default:
        console.log(`Unhandled event type ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "An error occurred processing the webhook" }, { status: 500 })
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}

