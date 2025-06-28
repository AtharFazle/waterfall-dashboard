"use client"

    /* eslint-disable */

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import {
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  ArrowLeft,
  ImageIcon,
  GripVertical,
  Eye,
  UploadCloud,
  Settings,
  Download,
  Upload,
  Palette,
  Grid3X3,
  List,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { CreateImagePayload, Image } from "@/types/images"
import { useDeleteImage, useGetIMages, useStoreImages, useSwapOrdering, useToggleImagesActive, useUpdateImage } from "@/hooks/images"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "react-toastify"



// Types
// interface CarouselImage {
//   id: string
//   url: string
//   title: string
//   description: string
//   order: number
//   image?: File
//   isActive: boolean
//   uploadDate: string
// }


export default function ImageManagement() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: carouselImages, isLoading } = useGetIMages()
  const { mutate: storeImage } = useStoreImages()
  const { mutate: updateImage } = useUpdateImage()
  const { mutate: swapOrdering } = useSwapOrdering()
  const { mutate: toggleImage } = useToggleImagesActive()
  const { mutate: removeImage } = useDeleteImage()

  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false)
  const [editingImage, setEditingImage] = useState<Image | null>(null)
  const [draggedImage, setDraggedImage] = useState<Image | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const fileInputRef = useRef<HTMLInputElement>(null)

  const [imageForm, setImageForm] = useState<CreateImagePayload>({
    description: "",
    image: null,
    isActive: true,
    order: 0,
    title: "",
    uploadDate: new Date().toISOString(),
  })

  const resetImageForm = () => {
    setImageForm({
      description: "",
      image: null,
      isActive: true,
      order: 0,
      title: "",
      uploadDate: new Date().toISOString(),
    })
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) setImageForm({ ...imageForm, image: file })
  }

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault()
    setIsDragOver(false)
    const imageFile = Array.from(event.dataTransfer.files).find((f) => f.type.startsWith("image/"))
    if (imageFile) setImageForm({ ...imageForm, image: imageFile })
  }

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = () => setIsDragOver(false)

  const onBack = () => {
    router.push('/admin')
  }

  const handleAddImage = () => {
    if (imageForm.image) {
      storeImage(imageForm, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["images"] })
          toast.success("Image added successfully")
          resetImageForm()
          setIsImageDialogOpen(false)
          if (fileInputRef.current) fileInputRef.current.value = ""
        },
        onError: () => {
          toast.error("Failed to add image")
          // if (fileInputRef.current) fileInputRef.current.value = ""
        },
      })
    }
  }

  const handleEditImage = (image: Image) => {
    setEditingImage(image)
    setImageForm({
      title: image.title,
      description: image.description,
      image: null,
      uploadDate: image.uploadDate,
      order: image.order,
      isActive: image.isActive,
    })
    setIsImageDialogOpen(true)
  }

  const handleUpdateImage = () => {
    if (editingImage) {
      updateImage(
        { id: Number(editingImage.id), data: imageForm },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["images"] })
            resetImageForm()
            setEditingImage(null)
            setIsImageDialogOpen(false)
            toast.success("Image updated successfully")
            if (fileInputRef.current) fileInputRef.current.value = ""
          },
          onError: () => {
            toast.error("Failed to update image")
            // if (fileInputRef.current) fileInputRef.current.value = ""
          },
        },
      )
    }
  }

  const handleDeleteImage = (id: Image['id']) => {
    removeImage(id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["images"] })
        toast.success("Image deleted successfully")
      },
      onError: () => {
        toast.error("Failed to delete image")
      }
    })
  }

  const handleToggleActive = (id: Image['id'], isActiveNow: boolean) => {
    toggleImage({id,isActiveNow}, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["images"] })
        toast.success("Image Toggled successfully")
      },
      onError: () => {
        toast.error("Failed to toggle image")
      }
    })
  }

  const handleImageDragStart = (image: Image) => setDraggedImage(image)

  const handleImageDragOver = (e: React.DragEvent) => e.preventDefault()

  const handleImageDrop = (event: React.DragEvent, targetImage: Image) => {
    event.preventDefault()
    if (draggedImage && draggedImage.id !== targetImage.id) {
      swapOrdering(
        { targetId: Number(targetImage.id), draggedId: Number(draggedImage.id) },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["images"] })
            toast.success("Image reordered successfully")
          },
          onError: () => {
            toast.error("Failed to reorder image")
          },
        },
      )
    }
    setDraggedImage(null)
  }

  const handleImageError = (e : React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = "https://placehold.co/600x400"
    // setImageForm({ ...imageForm, image: null })
  }

  if (isLoading) return <div>Loading...</div>

  const activeImages = carouselImages?.data?.filter((img: Image) => img.isActive) || []
  const inactiveImages = carouselImages?.data?.filter((img: Image) => !img.isActive) || []
  const imagesToday = activeImages.filter((img: Image) => new Date(img.uploadDate).toDateString() === new Date().toDateString())

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b border-green-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Button onClick={onBack} variant="ghost" size="sm" className="text-green-700 hover:bg-green-50">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kembali ke Pengaturan
              </Button>
              <div className="h-6 w-px bg-gray-300" />
              <div className="flex items-center gap-2">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Palette className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-gray-900">Manajemen Gambar Carousel</h1>
                  <p className="text-sm text-gray-500">Kelola gambar untuk carousel dashboard</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="border-green-200 text-green-700 hover:bg-green-50 bg-transparent"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-green-200 text-green-700 hover:bg-green-50 bg-transparent"
              >
                <Upload className="h-4 w-4 mr-2" />
                Import
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Total Gambar</p>
                  <p className="text-2xl font-bold">{carouselImages?.data?.length}</p>
                </div>
                <ImageIcon className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Gambar Aktif</p>
                  <p className="text-2xl font-bold">{activeImages.length}</p>
                </div>
                <Eye className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">Gambar Nonaktif</p>
                  <p className="text-2xl font-bold">{inactiveImages.length}</p>
                </div>
                <Settings className="h-8 w-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Upload Hari Ini</p>
                  <p className="text-2xl font-bold">
                    {imagesToday?.length}
                  </p>
                </div>
                <UploadCloud className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-green-500 hover:bg-green-600">
                  <Plus className="h-4 w-4 mr-2" />
                  Tambah Gambar
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>{editingImage ? "Edit Gambar" : "Tambah Gambar Baru"}</DialogTitle>
                  <DialogDescription>
                    {editingImage ? "Ubah informasi gambar" : "Upload gambar baru untuk carousel"}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label>Upload Gambar</Label>
                    <div
                      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                        isDragOver
                          ? "border-green-500 bg-green-50"
                          : "border-gray-300 hover:border-green-400 hover:bg-green-50"
                      }`}
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                      <UploadCloud className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">
                        {imageForm.image ? (
                          <span className="text-green-600 font-medium">{imageForm.image.name}</span>
                        ) : (
                          <>
                            Drag & drop gambar atau{" "}
                            <span className="text-green-600 font-medium">klik untuk browse</span>
                          </>
                        )}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF hingga 10MB</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="image-title">Judul Gambar</Label>
                    <Input
                      id="image-title"
                      value={imageForm.title}
                      onChange={(e) => setImageForm({ ...imageForm, title: e.target.value })}
                      placeholder="Masukkan judul gambar"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="image-description">Deskripsi</Label>
                    <Textarea
                      id="image-description"
                      value={imageForm.description}
                      onChange={(e) => setImageForm({ ...imageForm, description: e.target.value })}
                      placeholder="Masukkan deskripsi gambar"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="image-active"
                      checked={imageForm.isActive}
                      onChange={(e) => setImageForm({ ...imageForm, isActive: e.target.checked })}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <Label htmlFor="image-active" className="text-sm">
                      Aktifkan gambar di carousel
                    </Label>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsImageDialogOpen(false)
                      setEditingImage(null)
                      resetImageForm()
                      if (fileInputRef.current) {
                        fileInputRef.current.value = ""
                      }
                    }}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Batal
                  </Button>
                  <Button
                    onClick={editingImage ? handleUpdateImage : handleAddImage}
                    className="bg-green-500 hover:bg-green-600"
                    disabled={!imageForm.title || (!imageForm.image && !editingImage)}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {editingImage ? "Update" : "Simpan"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className={viewMode === "grid" ? "bg-green-500 hover:bg-green-600" : ""}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
              className={viewMode === "list" ? "bg-green-500 hover:bg-green-600" : ""}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Instructions */}
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <GripVertical className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-blue-900 mb-1">Cara Menggunakan</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Drag dan drop gambar untuk mengubah urutan tampilan di carousel</li>
                  <li>• Gambar aktif akan ditampilkan di carousel dashboard utama</li>
                  <li>• Gunakan toggle untuk mengaktifkan/nonaktifkan gambar tanpa menghapus</li>
                  <li>• Klik preview untuk melihat gambar dalam ukuran penuh</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active Images Section */}
        <Card className="shadow-lg border-green-100">
          <CardHeader>
            <CardTitle className="text-green-800 flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Gambar Aktif ({activeImages.length})
            </CardTitle>
            <CardDescription>Gambar yang ditampilkan di carousel dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeImages
                  .sort((a, b) => a.order - b.order)
                  .map((image) => (
                    <div
                      key={image.id}
                      draggable
                      onDragStart={() => handleImageDragStart(image)}
                      onDragOver={handleImageDragOver}
                      onDrop={(e) => handleImageDrop(e, image)}
                      className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden cursor-move hover:shadow-lg transition-shadow"
                    >
                      <div className="relative">
                        <img
                          src={image.url}
                          alt={image.title}
                          className="w-full h-48 object-cover"
                          onError={handleImageError}
                        />
                        <div className="absolute top-2 left-2">
                          <Badge variant="secondary" className="bg-white/90 text-gray-800">
                            #{image.order}
                          </Badge>
                        </div>
                        <div className="absolute top-2 right-2">
                          <GripVertical className="h-5 w-5 text-white bg-black/50 rounded p-1" />
                        </div>
                        <div className="absolute bottom-2 right-2">
                          <Badge variant="secondary" className="bg-green-500 text-white">
                            Aktif
                          </Badge>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-1 truncate">{image.title}</h3>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{image.description}</p>
                        <div className="text-xs text-gray-500 mb-3">
                          Upload: {new Date(image.uploadDate).toLocaleDateString("id-ID")}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditImage(image)}
                            className="flex-1 border-green-200 text-green-700 hover:bg-green-50"
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(image.url, "_blank")}
                            className="border-blue-200 text-blue-700 hover:bg-blue-50"
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleToggleActive(image.id,image.isActive)}
                            className="border-orange-200 text-orange-700 hover:bg-orange-50"
                          >
                            {image.isActive ? "Nonaktifkan" : "Aktifkan"}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteImage(image.id)}
                            className="border-red-200 text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="space-y-2">
                {activeImages
                  .sort((a, b) => a.order - b.order)
                  .map((image) => (
                    <div
                      key={image.id}
                      draggable
                      onDragStart={() => handleImageDragStart(image)}
                      onDragOver={handleImageDragOver}
                      onDrop={(e) => handleImageDrop(e, image)}
                      className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow cursor-move"
                    >
                      <GripVertical className="h-5 w-5 text-gray-400" />
                      <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                        #{image.order}
                      </Badge>
                      <img
                        src={image.url}
                        alt={image.title}
                        className="w-16 h-16 object-cover rounded"
                        onError={handleImageError}
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{image.title}</h3>
                        <p className="text-sm text-gray-600 truncate">{image.description}</p>
                        <p className="text-xs text-gray-500">
                          Upload: {new Date(image.uploadDate).toLocaleDateString("id-ID")}
                        </p>
                      </div>
                      <Badge variant="secondary" className="bg-green-500 text-white">
                        Aktif
                      </Badge>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditImage(image)}
                          className="border-green-200 text-green-700 hover:bg-green-50"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(image.url, "_blank")}
                          className="border-blue-200 text-blue-700 hover:bg-blue-50"
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleToggleActive(image.id,image.isActive)}
                          className="border-orange-200 text-orange-700 hover:bg-orange-50"
                        >
                            {image.isActive ? "Nonaktifkan" : "Aktifkan"}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteImage(image.id)}
                          className="border-red-200 text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            )}

            {activeImages.length === 0 && (
              <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada gambar aktif</h3>
                <p className="text-gray-600 mb-4">Aktifkan gambar Atau Tambah Gambar untuk ditampilkan di carousel</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Inactive Images Section */}
        {inactiveImages.length > 0 && (
          <Card className="shadow-lg border-gray-100">
            <CardHeader>
              <CardTitle className="text-gray-800 flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Gambar Nonaktif ({inactiveImages.length})
              </CardTitle>
              <CardDescription>Gambar yang tidak ditampilkan di carousel</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {inactiveImages.map((image) => (
                  <div
                    key={image.id}
                    className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden opacity-75"
                  >
                    <div className="relative">
                      <img
                        src={image.url}
                        alt={image.title}
                        className="w-full h-48 object-cover grayscale"
                        onError={handleImageError}
                      />
                      <div className="absolute top-2 right-2">
                        <Badge variant="secondary" className="bg-gray-500 text-white">
                          Nonaktif
                        </Badge>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-1 truncate">{image.title}</h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{image.description}</p>
                      <div className="text-xs text-gray-500 mb-3">
                        Upload: {new Date(image.uploadDate).toLocaleDateString("id-ID")}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleToggleActive(image.id,image.isActive)}
                          className="flex-1 border-green-200 text-green-700 hover:bg-green-50"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          Aktifkan
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditImage(image)}
                          className="border-blue-200 text-blue-700 hover:bg-blue-50"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteImage(image.id)}
                          className="border-red-200 text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
