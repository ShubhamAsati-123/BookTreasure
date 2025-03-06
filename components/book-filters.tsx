"use client"

import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

const categories = [
  "Fiction",
  "Non-Fiction",
  "Mystery",
  "Science Fiction",
  "Fantasy",
  "Biography",
  "History",
  "Self-Help",
]

const conditions = ["Like New", "Very Good", "Good", "Acceptable"]

interface BookFiltersProps {
  selectedCategory?: string
  selectedCondition?: string
  minPrice?: number
  maxPrice?: number
  sortBy?: string
}

export default function BookFilters({
  selectedCategory = "",
  selectedCondition = "",
  minPrice = 0,
  maxPrice = 100,
  sortBy = "newest",
}: BookFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()

  const [priceRange, setPriceRange] = useState<[number, number]>([minPrice || 0, maxPrice || 100])
  const [category, setCategory] = useState<string>(selectedCategory)
  const [condition, setCondition] = useState<string>(selectedCondition)
  const [sort, setSort] = useState<string>(sortBy)

  const applyFilters = () => {
    const params = new URLSearchParams()

    if (category) params.set("category", category)
    if (condition) params.set("condition", condition)
    if (priceRange[0] > 0) params.set("minPrice", priceRange[0].toString())
    if (priceRange[1] < 100) params.set("maxPrice", priceRange[1].toString())
    if (sort) params.set("sortBy", sort)

    router.push(`${pathname}?${params.toString()}`)
  }

  const resetFilters = () => {
    setPriceRange([0, 100])
    setCategory("")
    setCondition("")
    setSort("newest")
    router.push(pathname)
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border">
      <h2 className="font-semibold text-lg mb-4">Filters</h2>

      <Accordion type="multiple" defaultValue={["sort", "price", "category", "condition"]}>
        <AccordionItem value="sort">
          <AccordionTrigger>Sort By</AccordionTrigger>
          <AccordionContent>
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="title">Title</SelectItem>
              </SelectContent>
            </Select>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="price">
          <AccordionTrigger>Price Range</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <Slider
                value={priceRange}
                min={0}
                max={100}
                step={1}
                onValueChange={(value) => setPriceRange(value as [number, number])}
              />
              <div className="flex items-center justify-between">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="category">
          <AccordionTrigger>Category</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {categories.map((cat) => (
                <div key={cat} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${cat}`}
                    checked={category === cat.toLowerCase()}
                    onCheckedChange={() => setCategory(category === cat.toLowerCase() ? "" : cat.toLowerCase())}
                  />
                  <Label htmlFor={`category-${cat}`}>{cat}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="condition">
          <AccordionTrigger>Condition</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {conditions.map((cond) => (
                <div key={cond} className="flex items-center space-x-2">
                  <Checkbox
                    id={`condition-${cond}`}
                    checked={condition === cond.toLowerCase()}
                    onCheckedChange={() => setCondition(condition === cond.toLowerCase() ? "" : cond.toLowerCase())}
                  />
                  <Label htmlFor={`condition-${cond}`}>{cond}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="mt-6 space-y-2">
        <Button onClick={applyFilters} className="w-full">
          Apply Filters
        </Button>
        <Button onClick={resetFilters} variant="outline" className="w-full">
          Reset Filters
        </Button>
      </div>
    </div>
  )
}

