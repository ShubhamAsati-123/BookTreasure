import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AboutPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">About BookTreasure</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div>
          <p className="text-lg mb-4">
            BookTreasure is a passionate community of book lovers dedicated to giving pre-loved books a second life. Our
            mission is to make reading more accessible and affordable while promoting sustainability in the world of
            literature.
          </p>
          <p className="text-lg mb-4">
            Founded in 2023, BookTreasure has quickly grown into a thriving marketplace where readers can buy and sell
            used books, connecting book enthusiasts from all walks of life.
          </p>
        </div>
        <div className="relative h-64 md:h-full">
          <Image
            src="/placeholder.svg?height=400&width=600"
            alt="BookTreasure Team"
            fill
            className="object-cover rounded-lg"
          />
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-6">Our Values</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card>
          <CardHeader>
            <CardTitle>Sustainability</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              We believe in reducing waste and giving books multiple lives, contributing to a more sustainable future.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Accessibility</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Our goal is to make books more affordable and accessible to readers everywhere.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Community</CardTitle>
          </CardHeader>
          <CardContent>
            <p>We foster a community of book lovers, encouraging the sharing of stories and knowledge.</p>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-2xl font-bold mb-6">How It Works</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <Card>
          <CardHeader>
            <CardTitle>1. List Your Books</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Easily list your pre-loved books for sale on our platform.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>2. Connect with Buyers</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Interested readers will contact you to purchase your books.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>3. Ship the Books</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Once sold, simply ship the books to their new owners.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>4. Earn & Read More</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Earn money from your sales and discover new books to read!</p>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-2xl font-bold mb-6">Join Our Community</h2>
      <p className="text-lg mb-4">
        Whether you're looking to declutter your bookshelf, find your next great read, or connect with fellow book
        lovers, BookTreasure is the place for you. Join our community today and be part of the sustainable reading
        revolution!
      </p>
    </main>
  )
}

