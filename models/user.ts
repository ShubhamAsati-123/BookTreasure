import type { ObjectId } from "mongodb"

export type UserRole = "buyer" | "seller" | "admin"

export interface User {
  _id?: ObjectId | string
  name: string
  email: string
  password?: string
  image?: string
  provider?: string
  providerId?: string
  role: UserRole
  createdAt: Date
  updatedAt: Date
}

export interface UserSession {
  _id: string
  name: string
  email: string
  image?: string
  role: UserRole
}

