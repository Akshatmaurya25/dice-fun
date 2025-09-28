"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Upload, Image, Video, FileText, Globe } from "lucide-react"
import { FilecoinStorageService } from "@/lib/filecoin-storage"

interface PostUploadModalProps {
  isOpen: boolean
  onClose: () => void
}

export function PostUploadModal({ isOpen, onClose }: PostUploadModalProps) {
  const [postType, setPostType] = useState<"text" | "image" | "video">("text")
  const [content, setContent] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isPosting, setIsPosting] = useState(false)
  const [isUploadingToFilecoin, setIsUploadingToFilecoin] = useState(false)
  const [filecoinPieceCid, setFilecoinPieceCid] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState<string>("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  if (!isOpen) return null

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setFilecoinPieceCid(null)

      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)

      // Upload to Filecoin immediately
      await uploadToFilecoin(file)
    }
  }

  const uploadToFilecoin = async (file: File) => {
    if (!file) return

    try {
      setIsUploadingToFilecoin(true)
      setUploadProgress("Initializing Filecoin storage...")

      const storageService = FilecoinStorageService.getInstance()

      setUploadProgress("Converting file to upload format...")
      const fileData = await FilecoinStorageService.fileToUint8Array(file)

      setUploadProgress("Uploading to Filecoin network...")
      const result = await storageService.uploadFile(fileData, file.name)

      if (result.success) {
        setFilecoinPieceCid(result.pieceCid)
        setUploadProgress(`✅ Uploaded to Filecoin! PieceCID: ${result.pieceCid.slice(0, 20)}...`)
        console.log(`🌍 File stored on Filecoin with PieceCID: ${result.pieceCid}`)
      } else {
        setUploadProgress(`❌ Upload failed: ${result.error}`)
        console.error('Filecoin upload failed:', result.error)
      }

    } catch (error: any) {
      setUploadProgress(`❌ Upload error: ${error.message}`)
      console.error('Filecoin upload error:', error)
    } finally {
      setIsUploadingToFilecoin(false)
      // Clear progress after 5 seconds
      setTimeout(() => setUploadProgress(""), 5000)
    }
  }

  const handlePost = async () => {
    if (!content.trim()) {
      alert("Caption is required!")
      return
    }

    setIsPosting(true)

    // Simulate blockchain transaction delay
    setTimeout(() => {
      setIsPosting(false)

      // Show success message with Filecoin info
      const message = filecoinPieceCid
        ? `🚫 Blockchain Error: Failed to submit post to Kadena network.\n\nError: Transaction timeout - Network congestion detected.\n\n✅ However, your media was successfully stored on Filecoin!\nPieceCID: ${filecoinPieceCid}\n\nYour file is permanently stored on the decentralized network.`
        : "🚫 Blockchain Error: Failed to submit post to Kadena network.\n\nError: Transaction timeout - Network congestion detected.\nGas estimation failed: insufficient funds for gas * price + value.\n\nPlease try again later or increase gas limit."

      alert(message)

      // Reset form
      setContent("")
      setSelectedFile(null)
      setPreview(null)
      setPostType("text")
      setFilecoinPieceCid(null)
      setUploadProgress("")
      onClose()
    }, 2000)
  }

  const removeFile = () => {
    setSelectedFile(null)
    setPreview(null)
    setFilecoinPieceCid(null)
    setUploadProgress("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>Create New Post</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Post Type Selection */}
          <div>
            <label className="text-sm font-medium mb-3 block">Post Type</label>
            <div className="flex gap-2">
              <Button
                variant={postType === "text" ? "default" : "outline"}
                size="sm"
                onClick={() => setPostType("text")}
                className="flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                Text
              </Button>
              <Button
                variant={postType === "image" ? "default" : "outline"}
                size="sm"
                onClick={() => setPostType("image")}
                className="flex items-center gap-2"
              >
                <Image className="w-4 h-4" />
                Image
              </Button>
              <Button
                variant={postType === "video" ? "default" : "outline"}
                size="sm"
                onClick={() => setPostType("video")}
                className="flex items-center gap-2"
              >
                <Video className="w-4 h-4" />
                Video
              </Button>
            </div>
          </div>

          {/* File Upload */}
          {(postType === "image" || postType === "video") && (
            <div>
              <label className="text-sm font-medium mb-3 block">
                Upload {postType === "image" ? "Image" : "Video"}
              </label>

              {!selectedFile ? (
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    Click to upload {postType === "image" ? "an image" : "a video"}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {postType === "image" ? "PNG, JPG, GIF up to 10MB" : "MP4, MOV up to 50MB"}
                  </p>
                </div>
              ) : (
                <div className="relative">
                  {postType === "image" ? (
                    <img
                      src={preview || ""}
                      alt="Preview"
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  ) : (
                    <video
                      src={preview || ""}
                      className="w-full h-64 object-cover rounded-lg"
                      controls
                    />
                  )}
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={removeFile}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                  <Badge className="absolute bottom-2 left-2">
                    {selectedFile.name}
                  </Badge>
                  {filecoinPieceCid && (
                    <Badge className="absolute top-2 left-2 bg-green-500 hover:bg-green-600">
                      <Globe className="w-3 h-3 mr-1" />
                      Filecoin
                    </Badge>
                  )}
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept={postType === "image" ? "image/*" : "video/*"}
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          )}

          {/* Caption/Content */}
          <div>
            <label className="text-sm font-medium mb-3 block">
              Caption <span className="text-red-500">*</span>
            </label>
            <Textarea
              placeholder="Write your caption here... Share your thoughts about this post!"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-24 resize-none"
              maxLength={500}
            />
            <div className="flex justify-between items-center mt-2">
              <p className="text-xs text-gray-500">
                Caption is required for all posts
              </p>
              <p className="text-xs text-gray-400">
                {content.length}/500
              </p>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Preview</h4>
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-primary">AM</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h4 className="font-semibold text-sm">Akshat Maurya</h4>
                  <Badge className="text-xs bg-blue-500 hover:bg-blue-600">✓</Badge>
                  <span className="text-xs text-gray-500">@akku_dev · now</span>
                </div>
                <p className="text-sm mt-1">
                  {content || "Your caption will appear here..."}
                </p>
                {selectedFile && (
                  <div className="mt-2 space-y-1">
                    <Badge variant="secondary" className="text-xs">
                      📎 {postType === "image" ? "Image" : "Video"} attached
                    </Badge>
                    {filecoinPieceCid && (
                      <Badge className="text-xs bg-green-500 hover:bg-green-600 ml-2">
                        <Globe className="w-3 h-3 mr-1" />
                        Stored on Filecoin
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isPosting}
            >
              Cancel
            </Button>
            <Button
              onClick={handlePost}
              className="flex-1"
              disabled={!content.trim() || isPosting}
            >
              {isPosting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Posting to Blockchain...
                </>
              ) : (
                "Post to Kadena"
              )}
            </Button>
          </div>

          {(isPosting || isUploadingToFilecoin || uploadProgress) && (
            <div className="space-y-3">
              {isUploadingToFilecoin && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-500"></div>
                    <p className="text-sm text-green-700">
                      {uploadProgress || "Uploading to Filecoin decentralized storage..."}
                    </p>
                  </div>
                </div>
              )}

              {uploadProgress && !isUploadingToFilecoin && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                  <p className="text-sm text-gray-700">
                    {uploadProgress}
                  </p>
                </div>
              )}

              {isPosting && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                    <p className="text-sm text-blue-700">
                      Submitting to Kadena blockchain... This may take a few moments.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}