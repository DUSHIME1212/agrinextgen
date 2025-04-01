"use client"
import { useState } from "react"
import type React from "react"

import { Button } from "@/components/ui/button"
import { ImagePlus, Loader2, X } from "lucide-react"
import { toast } from "sonner"

interface CloudinaryUploaderProps {
  onUpload: (urls: string[]) => void
  existingImages?: string[]
  onRemove?: (index: number) => void
  multiple?: boolean
}

export default function CloudinaryUploader({
  onUpload,
  existingImages = [],
  onRemove,
  multiple = true,
}: CloudinaryUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)

    try {
      // Debug log before upload
      console.log(
        "Starting upload with files:",
        Array.from(files).map((f) => f.name),
      )

      // Validate files before upload
      const validFiles = Array.from(files).filter((file) => {
        const validTypes = ["image/jpeg", "image/png", "image/webp"]
        const isValidType = validTypes.includes(file.type)
        const isValidSize = file.size <= 5 * 1024 * 1024 // 5MB

        if (!isValidType) {
          toast.error(`Invalid file type: ${file.name}. Only JPG, PNG, WEBP are allowed.`)
          return false
        }
        if (!isValidSize) {
          toast.error(`File too large: ${file.name}. Max size is 5MB.`)
          return false
        }
        return true
      })

      if (validFiles.length === 0) {
        setIsUploading(false)
        return
      }

      const uploadPromises = validFiles.map((file) => {
        const formData = new FormData()
        formData.append("file", file)
        formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "ml_default")
        formData.append("cloud_name", process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dzybbmiu5")

        // Debug log before fetch
        console.log("Uploading file:", file.name, "size:", file.size)

        return fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dzybbmiu5"}/upload`,
          {
            method: "POST",
            body: formData,
          },
        ).then(async (res) => {
          const data = await res.json()
          console.log("Upload response:", data) // Debug log

          if (!res.ok) {
            const errorMsg = data.error?.message || (data.errors ? JSON.stringify(data.errors) : "Upload failed")
            throw new Error(`Cloudinary error: ${errorMsg}`)
          }

          if (!data.secure_url) {
            throw new Error("No secure_url returned from Cloudinary")
          }

          return data
        })
      })

      const results = await Promise.all(uploadPromises)
      const urls = results.map((result) => result.secure_url)
      onUpload(urls)
      toast.success(`${urls.length} image(s) uploaded successfully!`)
    } catch (error: any) {
      console.error("Full upload error:", error)
      toast.error(`Upload failed: ${error.message}`)
    } finally {
      setIsUploading(false)
      if (e.target) e.target.value = ""
    }
  }

  return (
    <div className="space-y-4">
      {existingImages.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {existingImages.map((image, index) => (
            <div key={index} className="relative group aspect-square rounded-md overflow-hidden border">
              <img
                src={image || "/placeholder.svg"}
                alt={`Uploaded image ${index + 1}`}
                className="w-full h-full object-cover"
              />
              {onRemove && (
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onRemove(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center">
        {isUploading ? (
          <Loader2 size={48} className="text-muted-foreground mb-4 animate-spin" />
        ) : (
          <ImagePlus size={48} className="text-muted-foreground mb-4" />
        )}
        <p className="text-sm text-muted-foreground mb-2">{isUploading ? "Uploading..." : "Click to select images"}</p>

        <label className="cursor-pointer">
          <Button variant="outline" size="sm" disabled={isUploading} asChild>
            <span>{isUploading ? "Uploading..." : "Select Images"}</span>
          </Button>
          <input
            type="file"
            accept="image/jpeg, image/png, image/webp"
            multiple={multiple}
            onChange={handleFileChange}
            className="hidden"
            disabled={isUploading}
          />
        </label>

        <p className="text-xs text-muted-foreground mt-2">Supported formats: JPG, PNG, WEBP. Max file size: 5MB.</p>
      </div>
    </div>
  )
}

