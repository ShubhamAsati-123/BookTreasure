import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import cloudinary from "@/lib/cloudinary"

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is a seller or admin
    if (session.user.role !== "seller" && session.user.role !== "admin") {
      return NextResponse.json({ error: "Only sellers can upload images" }, { status: 403 })
    }

    const formData = await request.formData()
    const file = formData.get("image") as File

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/webp"]
    if (!validTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type. Only JPG, PNG, and WebP are allowed" }, { status: 400 })
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large. Maximum size is 5MB" }, { status: 400 })
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString("base64")
    const dataURI = `data:${file.type};base64,${base64}`

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: "booktreasure",
      resource_type: "image",
      transformation: [
        { width: 800, height: 1000, crop: "limit" }, // Resize to reasonable dimensions
        { quality: "auto:good" }, // Optimize quality
      ],
    })

    return NextResponse.json({
      message: "File uploaded successfully",
      imageUrl: result.secure_url,
    })
  } catch (error) {
    console.error("Error uploading file:", error)
    return NextResponse.json({ error: "An error occurred while uploading the file" }, { status: 500 })
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}

