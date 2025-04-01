"use client"

import type React from "react"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusCircle, Trash2, Loader2 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { addProduct } from "@/redux/slices/productSlice"
import CloudinaryUploader from "@/components/ui/CloudinaryUploader"
import { useRouter } from "next/navigation"

// Define types for specifications
type SpecificationItem = {
  key: string
  value: string
}

// Form validation schema using Zod
const formSchema = z.object({
  name: z.string().min(3, {
    message: "Product name must be at least 3 characters.",
  }),
  Category: z.string({
    required_error: "Please select a product category.",
  }),
  price: z.coerce.number().positive({
    message: "Price must be a positive number.",
  }),
  discount: z.coerce
    .number()
    .min(0)
    .max(100, {
      message: "Discount must be between 0 and 100 percent.",
    })
    .default(0),
  stock: z.coerce.number().int().nonnegative({
    message: "Stock must be a non-negative integer.",
  }),
  productDescription: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  features: z.string().optional(),
  isNew: z.boolean().default(false),
  productStatus: z.string().default("In Stock"),
})

type FormValues = z.infer<typeof formSchema>

const Page: React.FC = () => {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { isLoading } = useAppSelector((state) => state.products)
  const { user } = useAppSelector((state) => state.auth)

  const [images, setImages] = useState<string[]>([])
  const [productInfo, setProductInfo] = useState<SpecificationItem[]>([])
  const [additionalInfo, setAdditionalInfo] = useState<SpecificationItem[]>([])
  const [newInfoKey, setNewInfoKey] = useState("")
  const [newInfoValue, setNewInfoValue] = useState("")
  const [details, setDetails] = useState<string[]>([])
  const [newDetail, setNewDetail] = useState("")
  const [growingInfo, setGrowingInfo] = useState<{
    growingSeason?: string
    sunExposure?: string
    wateringNeeds?: string
    spacing?: string
    harvestTime?: string
    soilRequirements?: string
    plantingDepth?: string
    companions?: string
  }>({})

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      Category: "",
      price: undefined,
      discount: 0,
      stock: undefined,
      productDescription: "",
      features: "",
      isNew: false,
      productStatus: "In Stock",
    },
  })

  // Handle Cloudinary image upload
  const handleImageUpload = (newImageUrls: string[]) => {
    setImages([...images, ...newImageUrls])
    console.log("Images after upload:", [...images, ...newImageUrls])
  }

  // Remove image
  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  // Add product info item
  const addProductInfoItem = () => {
    if (newInfoKey.trim() && newInfoValue.trim()) {
      setProductInfo([...productInfo, { key: newInfoKey, value: newInfoValue }])
      setNewInfoKey("")
      setNewInfoValue("")
    }
  }

  // Remove product info item
  const removeProductInfoItem = (index: number) => {
    setProductInfo(productInfo.filter((_, i) => i !== index))
  }

  // Add additional info item
  const addAdditionalInfoItem = () => {
    if (newInfoKey.trim() && newInfoValue.trim()) {
      setAdditionalInfo([...additionalInfo, { key: newInfoKey, value: newInfoValue }])
      setNewInfoKey("")
      setNewInfoValue("")
    }
  }

  // Remove additional info item
  const removeAdditionalInfoItem = (index: number) => {
    setAdditionalInfo(additionalInfo.filter((_, i) => i !== index))
  }

  // Add product detail
  const addDetail = () => {
    if (newDetail.trim()) {
      setDetails([...details, newDetail])
      setNewDetail("")
    }
  }

  // Remove product detail
  const removeDetail = (index: number) => {
    setDetails(details.filter((_, i) => i !== index))
  }

  // Handle growing info change
  const handleGrowingInfoChange = (key: string, value: string) => {
    setGrowingInfo({
      ...growingInfo,
      [key]: value,
    })
  }

  async function onSubmit(values: FormValues) {
    try {
      if (!user) {
        toast.error("You must be logged in to add a product")
        return
      }

      // Combine features from details array
      const featuresText = details.join("\n")

      // Structure the product data
      const productData = {
        name: values.name,
        productDescription: values.productDescription,
        price: values.price,
        Category: values.Category,
        productStatus: values.productStatus,
        discount: values.discount,
        features: featuresText,
        isNew: values.isNew,
        ...growingInfo,
        SKU: additionalInfo.find((item) => item.key === "SKU")?.value,
        Brand: additionalInfo.find((item) => item.key === "Brand")?.value,
        ShelfLife: additionalInfo.find((item) => item.key === "ShelfLife")?.value,
        Storage: additionalInfo.find((item) => item.key === "Storage")?.value,
        Certification: additionalInfo.find((item) => item.key === "Certification")?.value,
        images,
      }

      console.log("Submitting product data:", productData)

      // Dispatch the addProduct action
      const result = await dispatch(addProduct(productData)).unwrap()
      console.log("Product added successfully:", result)

      toast.success(`${values.name} has been added successfully.`)

      // Reset form after submission
      form.reset()
      setImages([])
      setProductInfo([])
      setAdditionalInfo([])
      setDetails([])
      setGrowingInfo({})

      // Redirect to dashboard
      router.push("/dashboard")
    } catch (error: any) {
      console.error("Error adding product:", error)
      toast.error(error.message || "Failed to add product")
    }
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Add New Product</h1>
        <p className="text-muted-foreground mt-1">Create a new product listing for your store</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-6">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="details">Product Details</TabsTrigger>
              <TabsTrigger value="growing">Growing Info</TabsTrigger>
              <TabsTrigger value="specs">Specifications</TabsTrigger>
              <TabsTrigger value="images">Images</TabsTrigger>
            </TabsList>

            {/* Basic Info Tab */}
            <TabsContent value="basic" className="space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Product Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter product name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="Category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Seeds & Plants">Seeds & Plants</SelectItem>
                              <SelectItem value="Equipment & Tools">Equipment & Tools</SelectItem>
                              <SelectItem value="Fertilizers">Fertilizers</SelectItem>
                              <SelectItem value="Irrigation Systems">Irrigation Systems</SelectItem>
                              <SelectItem value="Organic Products">Organic Products</SelectItem>
                              <SelectItem value="Livestock Supplies">Livestock Supplies</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price ($)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" placeholder="0.00" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="discount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Discount (%)</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" max="100" placeholder="0" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="stock"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Stock Quantity</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="0" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="productStatus"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Product Status</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="In Stock">In Stock</SelectItem>
                              <SelectItem value="Low Stock">Low Stock</SelectItem>
                              <SelectItem value="Out of Stock">Out of Stock</SelectItem>
                              <SelectItem value="Pre-order">Pre-order</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex items-center space-x-4 mt-8">
                      <FormField
                        control={form.control}
                        name="isNew"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                            <FormLabel className="cursor-pointer">Mark as New</FormLabel>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <FormField
                control={form.control}
                name="productDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Describe your product in detail..." className="min-h-32" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </TabsContent>

            {/* Product Details Tab */}
            <TabsContent value="details" className="space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-medium mb-4">Product Features & Benefits</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Current Features</h4>
                      <ul className="space-y-2 list-disc pl-6">
                        {details.map((detail, index) => (
                          <li key={index} className="flex items-center justify-between group">
                            <span>{detail}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => removeDetail(index)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex items-end gap-2">
                      <div className="flex-1">
                        <FormLabel htmlFor="newDetail">Add Feature</FormLabel>
                        <Input
                          id="newDetail"
                          value={newDetail}
                          onChange={(e) => setNewDetail(e.target.value)}
                          placeholder="e.g., Non-GMO and certified organic"
                        />
                      </div>
                      <Button type="button" variant="outline" onClick={addDetail}>
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Add
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Growing Info Tab */}
            <TabsContent value="growing" className="space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-medium mb-4">Growing Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <FormLabel htmlFor="growingSeason">Growing Season</FormLabel>
                      <Input
                        id="growingSeason"
                        value={growingInfo.growingSeason || ""}
                        onChange={(e) => handleGrowingInfoChange("growingSeason", e.target.value)}
                        placeholder="e.g., Spring, Summer"
                      />
                    </div>
                    <div>
                      <FormLabel htmlFor="sunExposure">Sun Exposure</FormLabel>
                      <Input
                        id="sunExposure"
                        value={growingInfo.sunExposure || ""}
                        onChange={(e) => handleGrowingInfoChange("sunExposure", e.target.value)}
                        placeholder="e.g., Full Sun, Partial Shade"
                      />
                    </div>
                    <div>
                      <FormLabel htmlFor="wateringNeeds">Watering Needs</FormLabel>
                      <Input
                        id="wateringNeeds"
                        value={growingInfo.wateringNeeds || ""}
                        onChange={(e) => handleGrowingInfoChange("wateringNeeds", e.target.value)}
                        placeholder="e.g., Regular, Moderate"
                      />
                    </div>
                    <div>
                      <FormLabel htmlFor="spacing">Spacing</FormLabel>
                      <Input
                        id="spacing"
                        value={growingInfo.spacing || ""}
                        onChange={(e) => handleGrowingInfoChange("spacing", e.target.value)}
                        placeholder="e.g., 12-18 inches"
                      />
                    </div>
                    <div>
                      <FormLabel htmlFor="harvestTime">Harvest Time</FormLabel>
                      <Input
                        id="harvestTime"
                        value={growingInfo.harvestTime || ""}
                        onChange={(e) => handleGrowingInfoChange("harvestTime", e.target.value)}
                        placeholder="e.g., 60-80 days"
                      />
                    </div>
                    <div>
                      <FormLabel htmlFor="soilRequirements">Soil Requirements</FormLabel>
                      <Input
                        id="soilRequirements"
                        value={growingInfo.soilRequirements || ""}
                        onChange={(e) => handleGrowingInfoChange("soilRequirements", e.target.value)}
                        placeholder="e.g., Well-draining, rich in organic matter"
                      />
                    </div>
                    <div>
                      <FormLabel htmlFor="plantingDepth">Planting Depth</FormLabel>
                      <Input
                        id="plantingDepth"
                        value={growingInfo.plantingDepth || ""}
                        onChange={(e) => handleGrowingInfoChange("plantingDepth", e.target.value)}
                        placeholder="e.g., 1/4 inch"
                      />
                    </div>
                    <div>
                      <FormLabel htmlFor="companions">Companion Plants</FormLabel>
                      <Input
                        id="companions"
                        value={growingInfo.companions || ""}
                        onChange={(e) => handleGrowingInfoChange("companions", e.target.value)}
                        placeholder="e.g., Basil, Marigold"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Specifications Tab */}
            <TabsContent value="specs" className="space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-medium mb-4">Additional Information</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Current Additional Information</h4>
                      {additionalInfo.length === 0 ? (
                        <p className="text-muted-foreground">No additional information added yet.</p>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {additionalInfo.map((item, index) => (
                            <div key={index} className="border-b pb-2 group flex justify-between items-center">
                              <div>
                                <div className="font-medium text-muted-foreground">{item.key}</div>
                                <div>{item.value}</div>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => removeAdditionalInfoItem(index)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <FormLabel htmlFor="additionalInfoKey">Attribute</FormLabel>
                        <Input
                          id="additionalInfoKey"
                          value={newInfoKey}
                          onChange={(e) => setNewInfoKey(e.target.value)}
                          placeholder="e.g., SKU, Brand, Storage"
                        />
                      </div>
                      <div>
                        <FormLabel htmlFor="additionalInfoValue">Value</FormLabel>
                        <Input
                          id="additionalInfoValue"
                          value={newInfoValue}
                          onChange={(e) => setNewInfoValue(e.target.value)}
                          placeholder="e.g., SEED-TOM-ORG-100"
                        />
                      </div>
                    </div>
                    <Button type="button" variant="outline" onClick={addAdditionalInfoItem}>
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Add Additional Information
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Images Tab */}
            <TabsContent value="images" className="space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-medium mb-4">Product Images</h3>
                  <CloudinaryUploader onUpload={handleImageUpload} existingImages={images} onRemove={removeImage} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline">
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding Product...
                </>
              ) : (
                "Add Product"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default Page

