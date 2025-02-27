"use server"

import sharp from "sharp"

export async function processImage(formData: FormData) {
  try {
    const file = formData.get("image") as File
    if (!file) {
      throw new Error("No file uploaded")
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const image = await sharp(buffer);
    const metadata = await image.metadata()

    // Calculate new width while maintaining aspect ratio
    let width = metadata.width || 0
    let height = metadata.height || 0
    if (width > 2500) {
      height = Math.round((height * 2500) / width)
      width = 2500
    }

    const optimizedBuffer =  async(quality:number)=>{
     return await sharp(buffer)
      .resize(width, height, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: quality })
      .toBuffer()
    }

    let quality = 80;
    let optimizedImage = await optimizedBuffer(quality);


     // Reduce quality iteratively until the image is under 100KB
     while (optimizedImage.length > 100 * 1024 && quality >= 40) {
      quality -= 5; // Reduce quality by 5% in each iteration
      optimizedImage = await optimizedBuffer(quality);
    }

    
    

    // Convert buffer to base64 for preview
    const base64 = `data:image/webp;base64,${optimizedImage.toString("base64")}`

    // Get file size in KB
    const sizeInKb = Math.round(optimizedImage.length / 1024)

    return {
      success: true,
      data: {
        optimizedImage: base64,
        originalSize: Math.round(buffer.length / 1024),
        optimizedSize: sizeInKb,
        width,
        height,
        filename: file.name,
      },
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to process image",
    }
  }
}

