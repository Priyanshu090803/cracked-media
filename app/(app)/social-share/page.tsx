 
'use client'
import { useEffect, useRef, useState } from 'react'
import { CldImage } from 'next-cloudinary'
import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const socialFormats = {
    "Instagram Square (1:1)": { 
        width: 1080, 
        height: 1080, 
        aspectRatio: "1:1" 
    },
    "Instagram Portrait (4:5)": { 
        width: 1080, 
        height: 1350, 
        aspectRatio: "4:5" 
    },
    "Twitter Post (16:9)": { 
        width: 1200, 
        height: 675, 
        aspectRatio: "16:9" 
    },
    "Twitter Header (3:1)": { 
        width: 1500, 
        height: 500, 
        aspectRatio: "3:1" 
    },
    "Facebook Cover (205:78)": { 
        width: 820, 
        height: 312, 
        aspectRatio: "205:78" 
    }
}

type socialFormat = keyof typeof socialFormats

const SocialShare = () => {
    const [uploadedImage, setUploadedImage] = useState<string | null>(null)
    const [selectFormat, setSelectFormat] = useState<socialFormat>("Instagram Square (1:1)")
    const [isUploadingImage, setIsUploadingImage] = useState<boolean>(false)
    const [isTransformingImage, setIsTransformingImage] = useState<boolean>(false)
    const [uploadError, setUploadError] = useState<string | null>(null)
    const imageRef = useRef<HTMLImageElement>(null)

    // Fixed useEffect - should trigger transformation when format changes and image exists
    useEffect(() => {
        if (uploadedImage) {
            setIsTransformingImage(true)
        }
    }, [selectFormat, uploadedImage])

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        setIsUploadingImage(true)
        setUploadError(null)
        
        const formData = new FormData()
        formData.append("file", file)
        
        try {
            const response = await fetch("/api/image-upload", {
                method: "POST",
                body: formData
            })
            
            if (!response.ok) {
                throw new Error('Failed to upload image!')
            }
            
            // FIXED: Actually handle the response data
            const data = await response.json()
            
            // Assuming your API returns { publicId: "..." } or { url: "..." }
            if (data.publicId) {
                setUploadedImage(data.publicId)
            } else if (data.url) {
                setUploadedImage(data.url)
            } else {
                throw new Error('No image URL returned from server')
            }
            
        } catch (error) {
            console.error('Upload error:', error)
            setUploadError(error instanceof Error ? error.message : 'Failed to upload image!')
        } finally {
            setIsUploadingImage(false)
        }
    }

    const handleDownload = () => {
        if (!imageRef.current) return

        fetch(imageRef.current.src)
            .then((response) => response.blob())
            .then((blob) => {
                const url = window.URL.createObjectURL(blob)
                const link = document.createElement("a")
                link.href = url
                link.download = `${selectFormat.replace(/\s+/g, "_").toLowerCase()}.png` // or simply we can write `${selectFormat}.png ` if you want to keep spaces
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
                window.URL.revokeObjectURL(url)
                // FIXED: Removed duplicate removeChild call
            })
            .catch((error) => {
                console.error('Download error:', error)
                alert('Failed to download image!')
            })
    }

  return (
  <div className="min-h-screen w-full bg-transparent px-4 py-10">
    <div className="mx-auto max-w-4xl w-full space-y-8">
      <h2 className="text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-neutral-400">
        Social Media Image Creator
      </h2>

      <Card className="w-full shadow-lg border-gray-200">
        <CardHeader>
          <CardTitle className="mb-1">Upload an Image</CardTitle>
          <CardDescription>Choose an image file to get started.</CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-6">
          {/* Upload Field */}
          <div className="w-full max-w-md mx-auto">
            <div className="relative">
              <label
                htmlFor="file-upload"
                className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 hover:border-pink-400 transition-colors"
              >
                <div className="flex flex-col items-center p-4 text-center">
                  <svg
                    className="w-8 h-8 mb-2 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Click to upload</span> or drag & drop
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
              </label>
              <input
                id="file-upload"
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={isUploadingImage}
              />
            </div>

            {/* Uploading Indicator */}
            {isUploadingImage && (
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-pink-500 h-2 rounded-full animate-pulse w-3/5" />
                </div>
                <p className="text-sm text-gray-600 mt-2 text-center">Uploading image...</p>
              </div>
            )}

            {/* Upload Error */}
            {uploadError && (
              <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {uploadError}
              </div>
            )}
          </div>

          {/* Image Preview + Format Selection */}
          {uploadedImage && (
            <div className="w-full space-y-6">
              <div className="space-y-2">
                <label className="text-lg font-medium">Select Social Media Format</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  value={selectFormat}
                  onChange={(e) => setSelectFormat(e.target.value as socialFormat)}
                >
                  {Object.keys(socialFormats).map((format) => (
                    <option value={format} key={format}>
                      {format}
                    </option>
                  ))}
                </select>
              </div>

              {/* Preview Box */}
              <div className="relative w-full flex justify-center bg-gray-50 border rounded-lg p-4">
                {isTransformingImage && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-10 rounded-lg">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500" />
                  </div>
                )}

                <CldImage
                  ref={imageRef}
                  src={uploadedImage}
                  width={socialFormats[selectFormat].width}
                  height={socialFormats[selectFormat].height}
                  alt="Social Media Preview"
                  crop="fill"
                  aspectRatio={socialFormats[selectFormat].aspectRatio}
                  gravity="auto"
                  sizes="100vw"
                  className="rounded-md max-w-full h-auto shadow"
                  onLoad={() => setIsTransformingImage(false)}
                  onError={() => {
                    setIsTransformingImage(false)
                    setUploadError("Failed to load image preview")
                  }}
                />
              </div>

              {/* Download Button */}
              <div className="flex justify-center">
                <button
                  className="px-6 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleDownload}
                  disabled={isTransformingImage}
                >
                  Download {selectFormat}
                </button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  </div>
)

}

export default SocialShare  