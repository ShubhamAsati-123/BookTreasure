import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Toaster } from "@/components/ui/toaster"
import { CartProvider } from "@/context/cart-context"
import { AuthProvider } from "@/context/auth-context"
// Update the import to use our custom SessionProvider
import { SessionProvider } from "@/components/providers/session-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "BookTreasure - Pre-loved Books Marketplace",
  description: "Buy and sell pre-owned books at affordable prices",
    generator: 'v0.dev'
}

// Update the RootLayout component to wrap everything with SessionProvider
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          <AuthProvider>
            <CartProvider>
              <div className="flex flex-col min-h-screen">
                <Header />
                <div className="flex-grow">{children}</div>
                <Footer />
              </div>
              <Toaster />
            </CartProvider>
          </AuthProvider>
        </SessionProvider>
      </body>
    </html>
  )
}



import './globals.css'