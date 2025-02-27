"use client"

import { useState } from "react"
import { Upload, ImageIcon } from "lucide-react"
import { processImage } from "@/actions/process-image"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

interface OptimizedImage {
  optimizedImage: string
  originalSize: number
  optimizedSize: number
  width: number
  height: number
  filename: string
}

export default function ImageOptimizer() {
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState<OptimizedImage | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true)
    } else if (e.type === "dragleave") {
      setIsDragging(false)
    }
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    setError(null)

    const file = e.dataTransfer.files[0]
    if (file) {
      await processImageFile(file)
    }
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      await processImageFile(file)
    }
  }

  const processImageFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file")
      return
    }

    setIsProcessing(true)
    setResult(null)

    const formData = new FormData()
    formData.append("image", file)

    const response = await processImage(formData)

    if (response.success && response.data) {
      console.log("response", response.data)
      setResult(response.data)
    } else {
      setError(response.error || "Failed to process image")
    }

    setIsProcessing(false)
  }

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      <Card
        className={`p-8 border-2 border-dashed rounded-lg ${
          isDragging ? "border-primary bg-primary/5" : "border-border"
        }`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <div className="p-4 rounded-full bg-primary/10">
            <Upload className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Drop your image here</h3>
            <p className="text-sm text-muted-foreground">or click to select a file to optimize</p>
          </div>
          <input type="file" accept="image/*" className="hidden" onChange={handleFileSelect} id="file-upload" />
          <Button asChild>
            <label htmlFor="file-upload" className="cursor-pointer">
              Select Image
            </label>
          </Button>
        </div>
      </Card>

      {isProcessing && (
        <Card className="p-4">
          <div className="space-y-2">
            <p className="text-sm text-center">Processing image...</p>
            <Progress value={66}  />
          </div>
        </Card>
      )}

      {error && (
        <Card className="p-4 border-destructive">
          <p className="text-sm text-destructive text-center">{error}</p>
        </Card>
      )}

      {result && (
        <Card className="p-4 space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h3 className="font-medium">Original Size</h3>
              <p className="text-2xl font-bold">{result.originalSize} KB</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">Optimized Size</h3>
              <p className="text-2xl font-bold text-primary">{result.optimizedSize} KB</p>
            </div>
          </div>

          <div className="aspect-video relative rounded-lg overflow-hidden bg-muted">
            {result.optimizedImage && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={result.optimizedImage || "/placeholder.svg"}
                alt="Optimized preview"
                className="object-contain w-full h-full"
              />
            )}
          </div>

          <div className="text-sm text-muted-foreground">
            <p>
              Dimensions: {result.width} x {result.height}px
            </p>
            <p>Format: WebP</p>
          </div>

          <Button
            className="w-full"
            onClick={() => {
              const link = document.createElement("a")
              link.href = result.optimizedImage
              link.download = `${result.filename.split(".")[0].substring(0,100)}-optimized.webp`
              link.click()
            }}
          >
            <ImageIcon className="w-4 h-4 mr-2" />
            Download Optimized Image
          </Button>
        </Card>
      )}
    </div>
  )
}

