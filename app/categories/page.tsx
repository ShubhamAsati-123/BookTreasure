import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const categories = [
  { name: "Fiction", slug: "fiction", color: "bg-blue-100 hover:bg-blue-200" },
  { name: "Non-Fiction", slug: "non-fiction", color: "bg-green-100 hover:bg-green-200" },
  { name: "Science Fiction", slug: "science-fiction", color: "bg-purple-100 hover:bg-purple-200" },
  { name: "Romance", slug: "romance", color: "bg-pink-100 hover:bg-pink-200" },
  { name: "Mystery", slug: "mystery", color: "bg-yellow-100 hover:bg-yellow-200" },
  { name: "Biography", slug: "biography", color: "bg-indigo-100 hover:bg-indigo-200" },
  { name: "History", slug: "history", color: "bg-red-100 hover:bg-red-200" },
  { name: "Self-Help", slug: "self-help", color: "bg-teal-100 hover:bg-teal-200" },
]

export default function CategoriesPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Book Categories</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Link key={category.slug} href={`/books?category=${category.slug}`}>
            <Card className={`${category.color} transition-colors duration-200`}>
              <CardHeader>
                <CardTitle>{category.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Explore {category.name.toLowerCase()} books</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  )
}

