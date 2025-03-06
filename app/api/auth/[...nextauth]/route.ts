import NextAuth, { type NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { MongoDBAdapter } from "@next-auth/mongodb-adapter"
import clientPromise from "@/lib/mongodb"
import { compare } from "bcryptjs"

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password required")
        }

        const client = await clientPromise
        const db = client.db()
        const user = await db.collection("users").findOne({ email: credentials.email })

        if (!user || !user.password) {
          throw new Error("No user found with this email")
        }

        const isValid = await compare(credentials.password, user.password)

        if (!isValid) {
          throw new Error("Invalid password")
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role || "buyer",
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, account, trigger, session }) {
      // Update token when session is updated
      if (trigger === "update" && session?.role) {
        token.role = session.role
      }

      if (user) {
        token.id = user.id
        token.role = user.role || "buyer"

        // If this is a new Google sign-in, set default role
        if (account?.provider === "google") {
          const client = await clientPromise
          const db = client.db()

          // Check if user exists and has a role
          const dbUser = await db.collection("users").findOne({ email: user.email })

          if (dbUser) {
            // User exists, add role to token
            token.role = dbUser.role || "buyer"
          } else {
            // New user, set default role to buyer
            await db.collection("users").updateOne(
              { email: user.email },
              {
                $set: { role: "buyer" },
                $setOnInsert: { createdAt: new Date(), updatedAt: new Date() },
              },
              { upsert: true },
            )
            token.role = "buyer"
          }
        }
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
  events: {
    async signIn({ user, account }) {
      // If this is a Google sign-in, ensure the user has a role
      if (account?.provider === "google") {
        const client = await clientPromise
        const db = client.db()

        // Check if user exists in the database
        const dbUser = await db.collection("users").findOne({ email: user.email })

        if (!dbUser) {
          // Create a new user with default role
          await db.collection("users").insertOne({
            name: user.name,
            email: user.email,
            image: user.image,
            role: "buyer",
            createdAt: new Date(),
            updatedAt: new Date(),
          })
        } else if (!dbUser.role) {
          // Update existing user with default role if none exists
          await db
            .collection("users")
            .updateOne({ email: user.email }, { $set: { role: "buyer", updatedAt: new Date() } })
        }
      }
    },
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }

