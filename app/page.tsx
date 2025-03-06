import Link from "next/link"
import { BookOpen, ShoppingCart, TrendingUp } from "lucide-react"
import FeaturedBooks from "@/components/featured-books"
import BookCategories from "@/components/book-categories"
import SearchBar from "@/components/search-bar"
import HeroSection from "@/components/hero-section"

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />

      <section className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-primary">Find Your Next Adventure</h2>
          <SearchBar />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-amber-100 rounded-lg p-6 shadow-md flex items-center">
            <BookOpen className="h-10 w-10 text-amber-600 mr-4" />
            <div>
              <h3 className="font-semibold text-lg">Wide Selection</h3>
              <p className="text-gray-700">Thousands of pre-loved books</p>
            </div>
          </div>

          <div className="bg-emerald-100 rounded-lg p-6 shadow-md flex items-center">
            <TrendingUp className="h-10 w-10 text-emerald-600 mr-4" />
            <div>
              <h3 className="font-semibold text-lg">Sell Your Books</h3>
              <p className="text-gray-700">Give your books a second life</p>
            </div>
          </div>

          <div className="bg-purple-100 rounded-lg p-6 shadow-md flex items-center">
            <ShoppingCart className="h-10 w-10 text-purple-600 mr-4" />
            <div>
              <h3 className="font-semibold text-lg">Secure Checkout</h3>
              <p className="text-gray-700">Safe and easy payments</p>
            </div>
          </div>
        </div>

        <BookCategories />

        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-primary">Featured Books</h2>
            <Link href="/books" className="text-secondary hover:underline">
              View All
            </Link>
          </div>
          <FeaturedBooks />
        </div>

        <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Have Books to Sell?</h2>
          <p className="mb-6 max-w-2xl mx-auto">
            Join our community of book lovers and sell your pre-loved books. It's easy, fast, and eco-friendly!
          </p>
          <Link
            href="/sell"
            className="bg-white text-purple-700 px-6 py-2 rounded-full font-medium hover:bg-gray-100 transition-colors"
          >
            Start Selling
          </Link>
        </div>
      </section>
    </main>
  )
}

