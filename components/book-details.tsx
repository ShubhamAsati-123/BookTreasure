import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Book } from "@/types/book"

interface BookDetailsProps {
  book: Book
}

export default function BookDetails({ book }: BookDetailsProps) {
  return (
    <div className="mb-12">
      <Tabs defaultValue="details">
        <TabsList className="w-full border-b">
          <TabsTrigger value="details">Book Details</TabsTrigger>
          <TabsTrigger value="shipping">Shipping & Returns</TabsTrigger>
          <TabsTrigger value="seller">Seller Information</TabsTrigger>
        </TabsList>
        <TabsContent value="details" className="py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Specifications</h3>
              <table className="w-full">
                <tbody>
                  <tr className="border-b">
                    <td className="py-2 font-medium">Title</td>
                    <td className="py-2">{book.title}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 font-medium">Author</td>
                    <td className="py-2">{book.author}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 font-medium">ISBN</td>
                    <td className="py-2">{book.isbn}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 font-medium">Language</td>
                    <td className="py-2">{book.language}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 font-medium">Pages</td>
                    <td className="py-2">{book.pages}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 font-medium">Published Year</td>
                    <td className="py-2">{book.publishedYear}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Condition Details</h3>
              <p className="mb-4">
                This book is in <strong>{book.condition}</strong> condition.
              </p>

              <div className="mb-4">
                <h4 className="font-medium mb-2">Condition Guidelines:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    <strong>Like New:</strong> Appears unread, no visible wear.
                  </li>
                  <li>
                    <strong>Very Good:</strong> Minimal wear, no markings in text.
                  </li>
                  <li>
                    <strong>Good:</strong> Some wear, possibly some markings.
                  </li>
                  <li>
                    <strong>Acceptable:</strong> Readable copy, may have significant wear.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="shipping" className="py-4">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Shipping Information</h3>
              <p>We ship all books within 1-2 business days of receiving your order.</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Standard Shipping: 3-5 business days</li>
                <li>Express Shipping: 1-2 business days (additional fee)</li>
                <li>Free shipping on orders over $35</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Return Policy</h3>
              <p>If you're not satisfied with your purchase, we accept returns within 30 days of delivery.</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Items must be in original condition</li>
                <li>Include original packaging and receipt</li>
                <li>Refunds will be issued to the original payment method</li>
              </ul>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="seller" className="py-4">
          <div>
            <h3 className="text-lg font-semibold mb-4">About the Seller</h3>
            <p className="mb-4">
              <strong>{book.seller.name}</strong> is a trusted seller on our platform with a history of providing
              quality books and excellent customer service.
            </p>
            <div className="flex items-center mb-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                ))}
              </div>
              <span className="ml-2 text-gray-600">4.9 out of 5</span>
            </div>
            <p>Member since January 2022</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

