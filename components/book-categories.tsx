import Link from "next/link"

const categories = [
  { name: "Fiction", slug: "fiction", color: "bg-blue-100 text-blue-800" },
  { name: "Non-Fiction", slug: "non-fiction", color: "bg-green-100 text-green-800" },
  { name: "Mystery", slug: "mystery", color: "bg-purple-100 text-purple-800" },
  { name: "Science Fiction", slug: "science-fiction", color: "bg-indigo-100 text-indigo-800" },
  { name: "Fantasy", slug: "fantasy", color: "bg-pink-100 text-pink-800" },
  { name: "Biography", slug: "biography", color: "bg-yellow-100 text-yellow-800" },
  { name: "History", slug: "history", color: "bg-red-100 text-red-800" },
  { name: "Self-Help", slug: "self-help", color: "bg-teal-100 text-teal-800" },
]

export default function BookCategories() {
  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold text-primary mb-6">Browse by Category</h2>
      <div className="flex flex-wrap gap-3">
        {categories.map((category) => (
          <Link
            key={category.slug}
            href={`/categories/${category.slug}`}
            className={`${category.color} px-4 py-2 rounded-full text-sm font-medium hover:opacity-90 transition-opacity`}
          >
            {category.name}
          </Link>
        ))}
      </div>
    </div>
  )
}

