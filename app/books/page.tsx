import { Suspense } from "react"
import BookList from "@/components/book-list"
import BookFilters from "@/components/book-filters"
import { Skeleton } from "@/components/ui/skeleton"

export default function BooksPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const search = typeof searchParams.search === "string" ? searchParams.search : ""
  const category = typeof searchParams.category === "string" ? searchParams.category : ""
  const condition = typeof searchParams.condition === "string" ? searchParams.condition : ""
  const minPrice = typeof searchParams.minPrice === "string" ? Number.parseFloat(searchParams.minPrice) : undefined
  const maxPrice = typeof searchParams.maxPrice === "string" ? Number.parseFloat(searchParams.maxPrice) : undefined
  const sortBy = typeof searchParams.sortBy === "string" ? searchParams.sortBy : "newest"

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Browse Books</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-1/4">
          <BookFilters
            selectedCategory={category}
            selectedCondition={condition}
            minPrice={minPrice}
            maxPrice={maxPrice}
            sortBy={sortBy}
          />
        </div>

        <div className="w-full lg:w-3/4">
          <Suspense fallback={<BookListSkeleton />}>
            <BookList
              search={search}
              category={category}
              condition={condition}
              minPrice={minPrice}
              maxPrice={maxPrice}
              sortBy={sortBy}
            />
          </Suspense>
        </div>
      </div>
    </main>
  )
}

function BookListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(9)].map((_, i) => (
        <div key={i} className="animate-pulse">
          <Skeleton className="h-64 w-full mb-4" />
          <Skeleton className="h-4 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2 mb-4" />
          <Skeleton className="h-6 w-1/4 mb-2" />
        </div>
      ))}
    </div>
  )
}

