import Link from "next/link"
import { BookOpen, Facebook, Instagram, Mail, Twitter } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <BookOpen className="h-8 w-8 text-accent" />
              <span className="font-bold text-xl">BookTreasure</span>
            </Link>
            <p className="text-gray-400 mb-4">
              Your marketplace for pre-loved books. Buy, sell, and discover your next great read.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-accent">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-accent">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-accent">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-accent">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Explore</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/books" className="text-gray-400 hover:text-accent">
                  All Books
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-gray-400 hover:text-accent">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/sell" className="text-gray-400 hover:text-accent">
                  Sell Books
                </Link>
              </li>
              <li>
                <Link href="/deals" className="text-gray-400 hover:text-accent">
                  Special Deals
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-accent">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-400 hover:text-accent">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-gray-400 hover:text-accent">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-gray-400 hover:text-accent">
                  Returns & Refunds
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Newsletter</h3>
            <p className="text-gray-400 mb-4">Subscribe to our newsletter for the latest book arrivals and deals.</p>
            <form className="flex flex-col space-y-2">
              <input
                type="email"
                placeholder="Your email address"
                className="px-4 py-2 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-accent text-accent-foreground rounded-md hover:bg-accent/90 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>© {new Date().getFullYear()} BookTreasure. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

