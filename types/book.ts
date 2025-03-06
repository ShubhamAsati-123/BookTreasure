export interface Book {
  _id: string
  title: string
  author: string
  price: number
  originalPrice: number
  coverImage: string
  condition: string
  category: string
  seller: {
    _id: string
    name: string
  }
  description: string
  isbn: string
  language: string
  pages: number
  publishedYear: number
  quantity: number
  createdAt?: string
  updatedAt?: string
}

