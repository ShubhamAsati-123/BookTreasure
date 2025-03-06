"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Upload, X } from "lucide-react"

export default function SellPage() {
  const { data: session, status } = useSession()
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    price: "",
    originalPrice: "",
    condition: "",
    category: "",
    description: "",
    isbn: "",
    language: "English",
    pages: "",
    publishedYear: "",
    quantity: "1",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isCheckingPermission, setIsCheckingPermission] = useState(true)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Check if user is authenticated and has seller permissions
    if (status === "loading") return

    if (!session) {
      router.push("/login?callbackUrl=/sell")
      return
    }

    const checkSellerPermission = async () => {
      try {
        const response = await fetch("/api/profile")
        if (response.ok) {
          const userData = await response.json()
          if (userData.role !== "seller" && userData.role !== "admin") {
            router.push("/become-seller")
          }
        } else {
          throw new Error("Failed to fetch user data")
        }
      } catch (error) {
        console.error("Error checking seller permission:", error)
        toast({
          title: "Error",
          description: "Failed to verify seller permissions",
          variant: "destructive",
        })
      } finally {
        setIsCheckingPermission(false)
      }
    }

    checkSellerPermission()
  }, [session, status, router, toast])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Image must be less than 5MB",
        variant: "destructive",
      })
      return
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive",
      })
      return
    }

    setImageFile(file)

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return null

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append("image", imageFile)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to upload image")
      }

      const data = await response.json()
      return data.imageUrl
    } catch (error) {
      console.error("Error uploading image:", error)
      toast({
        title: "Upload failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      })
      return null
    } finally {
      setIsUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Upload image first if there is one
      let coverImage = null
      if (imageFile) {
        coverImage = await uploadImage()
        if (!coverImage && imageFile) {
          // If image upload failed but user selected an image, stop the submission
          setIsLoading(false)
          return
        }
      }

      // Convert numeric fields
      const bookData = {
        ...formData,
        price: Number.parseFloat(formData.price),
        originalPrice: formData.originalPrice
          ? Number.parseFloat(formData.originalPrice)
          : Number.parseFloat(formData.price) * 1.2,
        pages: formData.pages ? Number.parseInt(formData.pages) : undefined,
        publishedYear: formData.publishedYear ? Number.parseInt(formData.publishedYear) : undefined,
        quantity: Number.parseInt(formData.quantity),
        coverImage: coverImage || "/placeholder.svg?height=400&width=300",
      }

      const response = await fetch("/api/books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to list book")
      }

      toast({
        title: "Book listed successfully",
        description: "Your book has been added to our marketplace.",
      })

      router.push("/dashboard/selling")
    } catch (error) {
      console.error("Error listing book:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to list your book",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isCheckingPermission) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Sell Your Book</h1>
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
        <div className="space-y-2">
          <Label htmlFor="image">Book Cover Image (Optional)</Label>
          <div className="flex items-center gap-4">
            {imagePreview ? (
              <div className="relative h-40 w-32 border rounded-md overflow-hidden">
                <Image
                  src={imagePreview || "/placeholder.svg"}
                  alt="Book cover preview"
                  fill
                  className="object-cover"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-1 right-1 h-6 w-6 rounded-full"
                  onClick={removeImage}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div
                className="h-40 w-32 border-2 border-dashed rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-8 w-8 text-gray-400 mb-2" />
                <p className="text-xs text-gray-500 text-center">
                  Click to upload
                  <br />
                  or drag and drop
                </p>
              </div>
            )}
            <div className="flex-1">
              <Input
                id="image"
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="w-full mb-2"
              >
                Select Image
              </Button>
              <p className="text-xs text-gray-500">Recommended: 600x800px JPG, PNG or WebP (max 5MB)</p>
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="title">Book Title</Label>
          <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="author">Author</Label>
          <Input id="author" name="author" value={formData.author} onChange={handleChange} required />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="price">Price ($)</Label>
            <Input
              id="price"
              name="price"
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="originalPrice">Original Price ($) (Optional)</Label>
            <Input
              id="originalPrice"
              name="originalPrice"
              type="number"
              step="0.01"
              min="0"
              value={formData.originalPrice}
              onChange={handleChange}
              placeholder="Leave blank for +20% of price"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="condition">Condition</Label>
            <Select name="condition" onValueChange={(value) => handleSelectChange("condition", value)} required>
              <SelectTrigger>
                <SelectValue placeholder="Select condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="New">New</SelectItem>
                <SelectItem value="Like New">Like New</SelectItem>
                <SelectItem value="Very Good">Very Good</SelectItem>
                <SelectItem value="Good">Good</SelectItem>
                <SelectItem value="Acceptable">Acceptable</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <Select name="category" onValueChange={(value) => handleSelectChange("category", value)} required>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Fiction">Fiction</SelectItem>
                <SelectItem value="Non-Fiction">Non-Fiction</SelectItem>
                <SelectItem value="Science Fiction">Science Fiction</SelectItem>
                <SelectItem value="Romance">Romance</SelectItem>
                <SelectItem value="Mystery">Mystery</SelectItem>
                <SelectItem value="Biography">Biography</SelectItem>
                <SelectItem value="History">History</SelectItem>
                <SelectItem value="Self-Help">Self-Help</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <Label htmlFor="isbn">ISBN (Optional)</Label>
          <Input id="isbn" name="isbn" value={formData.isbn} onChange={handleChange} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="language">Language</Label>
            <Input id="language" name="language" value={formData.language} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              name="quantity"
              type="number"
              min="1"
              value={formData.quantity}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="publishedYear">Published Year (Optional)</Label>
            <Input
              id="publishedYear"
              name="publishedYear"
              type="number"
              min="1000"
              max={new Date().getFullYear()}
              value={formData.publishedYear}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="pages">Number of Pages (Optional)</Label>
            <Input id="pages" name="pages" type="number" min="1" value={formData.pages} onChange={handleChange} />
          </div>
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className="min-h-[150px]"
          />
        </div>
        <Button type="submit" disabled={isLoading || isUploading}>
          {isLoading ? "Listing..." : "List Book for Sale"}
        </Button>
      </form>
    </main>
  )
}

