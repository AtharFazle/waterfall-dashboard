"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Edit, Trash2, Save, X, Cloud, Users, Settings, Download, Upload, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

// Types
interface WeatherData {
  id: string
  date: string
  time: string
  temperature: number
  humidity: number
  condition: string
  windSpeed: number
  notes?: string
}

interface VisitorData {
  id: string
  date: string
  time: string
  visitorsIn: number
  visitorsOut: number
  currentVisitors: number
  notes?: string
}

interface SystemSettings {
  id: string
  setting: string
  value: string
  description: string
  category: string
}

// interface DataTablesProps {
//   onBack: () => void
// }

export default function DataTables() {
  const router = useRouter()
  // Sample data
  const [weatherData, setWeatherData] = useState<WeatherData[]>([
    {
      id: "1",
      date: "2024-01-15",
      time: "08:00",
      temperature: 24,
      humidity: 82,
      condition: "Berawan",
      windSpeed: 12,
      notes: "Kondisi normal",
    },
    {
      id: "2",
      date: "2024-01-15",
      time: "12:00",
      temperature: 29,
      humidity: 75,
      condition: "Cerah",
      windSpeed: 8,
      notes: "Cuaca ideal untuk wisata",
    },
  ])

  const [visitorData, setVisitorData] = useState<VisitorData[]>([
    {
      id: "1",
      date: "2024-01-15",
      time: "08:00",
      visitorsIn: 5,
      visitorsOut: 0,
      currentVisitors: 5,
      notes: "Pembukaan pagi",
    },
    {
      id: "2",
      date: "2024-01-15",
      time: "12:00",
      visitorsIn: 25,
      visitorsOut: 8,
      currentVisitors: 22,
      notes: "Peak hour",
    },
  ])

  const [systemSettings, setSystemSettings] = useState<SystemSettings[]>([
    {
      id: "1",
      setting: "max_capacity",
      value: "100",
      description: "Kapasitas maksimum pengunjung",
      category: "Pengunjung",
    },
    {
      id: "2",
      setting: "alert_weather",
      value: "true",
      description: "Aktifkan alert cuaca buruk",
      category: "Cuaca",
    },
  ])

  // Form states
  const [isWeatherDialogOpen, setIsWeatherDialogOpen] = useState(false)
  const [isVisitorDialogOpen, setIsVisitorDialogOpen] = useState(false)
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false)
  const [editingWeather, setEditingWeather] = useState<WeatherData | null>(null)
  const [editingVisitor, setEditingVisitor] = useState<VisitorData | null>(null)
  const [editingSettings, setEditingSettings] = useState<SystemSettings | null>(null)

  // Weather form
  const [weatherForm, setWeatherForm] = useState({
    date: new Date().toISOString().split("T")[0],
    time: new Date().toTimeString().slice(0, 5),
    temperature: "",
    humidity: "",
    condition: "",
    windSpeed: "",
    notes: "",
  })

  // Visitor form
  const [visitorForm, setVisitorForm] = useState({
    date: new Date().toISOString().split("T")[0],
    time: new Date().toTimeString().slice(0, 5),
    visitorsIn: "",
    visitorsOut: "",
    notes: "",
  })

  // Settings form
  const [settingsForm, setSettingsForm] = useState({
    setting: "",
    value: "",
    description: "",
    category: "",
  })

  // Weather functions
  const handleAddWeather = () => {
    const newWeather: WeatherData = {
      id: Date.now().toString(),
      date: weatherForm.date,
      time: weatherForm.time,
      temperature: Number(weatherForm.temperature),
      humidity: Number(weatherForm.humidity),
      condition: weatherForm.condition,
      windSpeed: Number(weatherForm.windSpeed),
      notes: weatherForm.notes,
    }
    setWeatherData([...weatherData, newWeather])
    setWeatherForm({
      date: new Date().toISOString().split("T")[0],
      time: new Date().toTimeString().slice(0, 5),
      temperature: "",
      humidity: "",
      condition: "",
      windSpeed: "",
      notes: "",
    })
    setIsWeatherDialogOpen(false)
  }

  const handleEditWeather = (weather: WeatherData) => {
    setEditingWeather(weather)
    setWeatherForm({
      date: weather.date,
      time: weather.time,
      temperature: weather.temperature.toString(),
      humidity: weather.humidity.toString(),
      condition: weather.condition,
      windSpeed: weather.windSpeed.toString(),
      notes: weather.notes || "",
    })
    setIsWeatherDialogOpen(true)
  }

  const handleUpdateWeather = () => {
    if (editingWeather) {
      const updatedWeather = weatherData.map((item) =>
        item.id === editingWeather.id
          ? {
              ...item,
              date: weatherForm.date,
              time: weatherForm.time,
              temperature: Number(weatherForm.temperature),
              humidity: Number(weatherForm.humidity),
              condition: weatherForm.condition,
              windSpeed: Number(weatherForm.windSpeed),
              notes: weatherForm.notes,
            }
          : item,
      )
      setWeatherData(updatedWeather)
      setEditingWeather(null)
      setIsWeatherDialogOpen(false)
    }
  }

  const handleDeleteWeather = (id: string) => {
    setWeatherData(weatherData.filter((item) => item.id !== id))
  }

  // Visitor functions
  const handleAddVisitor = () => {
    const currentVisitors = Number(visitorForm.visitorsIn) - Number(visitorForm.visitorsOut)
    const newVisitor: VisitorData = {
      id: Date.now().toString(),
      date: visitorForm.date,
      time: visitorForm.time,
      visitorsIn: Number(visitorForm.visitorsIn),
      visitorsOut: Number(visitorForm.visitorsOut),
      currentVisitors: Math.max(0, currentVisitors),
      notes: visitorForm.notes,
    }
    setVisitorData([...visitorData, newVisitor])
    setVisitorForm({
      date: new Date().toISOString().split("T")[0],
      time: new Date().toTimeString().slice(0, 5),
      visitorsIn: "",
      visitorsOut: "",
      notes: "",
    })
    setIsVisitorDialogOpen(false)
  }

  const handleEditVisitor = (visitor: VisitorData) => {
    setEditingVisitor(visitor)
    setVisitorForm({
      date: visitor.date,
      time: visitor.time,
      visitorsIn: visitor.visitorsIn.toString(),
      visitorsOut: visitor.visitorsOut.toString(),
      notes: visitor.notes || "",
    })
    setIsVisitorDialogOpen(true)
  }

  const handleUpdateVisitor = () => {
    if (editingVisitor) {
      const currentVisitors = Number(visitorForm.visitorsIn) - Number(visitorForm.visitorsOut)
      const updatedVisitor = visitorData.map((item) =>
        item.id === editingVisitor.id
          ? {
              ...item,
              date: visitorForm.date,
              time: visitorForm.time,
              visitorsIn: Number(visitorForm.visitorsIn),
              visitorsOut: Number(visitorForm.visitorsOut),
              currentVisitors: Math.max(0, currentVisitors),
              notes: visitorForm.notes,
            }
          : item,
      )
      setVisitorData(updatedVisitor)
      setEditingVisitor(null)
      setIsVisitorDialogOpen(false)
    }
  }

  const handleDeleteVisitor = (id: string) => {
    setVisitorData(visitorData.filter((item) => item.id !== id))
  }

  // Settings functions
  const handleAddSettings = () => {
    const newSetting: SystemSettings = {
      id: Date.now().toString(),
      setting: settingsForm.setting,
      value: settingsForm.value,
      description: settingsForm.description,
      category: settingsForm.category,
    }
    setSystemSettings([...systemSettings, newSetting])
    setSettingsForm({
      setting: "",
      value: "",
      description: "",
      category: "",
    })
    setIsSettingsDialogOpen(false)
  }

  const handleEditSettings = (setting: SystemSettings) => {
    setEditingSettings(setting)
    setSettingsForm({
      setting: setting.setting,
      value: setting.value,
      description: setting.description,
      category: setting.category,
    })
    setIsSettingsDialogOpen(true)
  }

  const handleUpdateSettings = () => {
    if (editingSettings) {
      const updatedSettings = systemSettings.map((item) =>
        item.id === editingSettings.id
          ? {
              ...item,
              setting: settingsForm.setting,
              value: settingsForm.value,
              description: settingsForm.description,
              category: settingsForm.category,
            }
          : item,
      )
      setSystemSettings(updatedSettings)
      setEditingSettings(null)
      setIsSettingsDialogOpen(false)
    }
  }

  const handleDeleteSettings = (id: string) => {
    setSystemSettings(systemSettings.filter((item) => item.id !== id))
  }

  const onBack =()  => {
    router.push('/');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              onClick={onBack}
              variant="outline"
              size="sm"
              className="border-green-200 text-green-700 hover:bg-green-50"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali ke Dashboard
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Manajemen Data</h1>
              <p className="text-gray-600 text-sm">Kelola data cuaca, pengunjung, dan pengaturan sistem</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="border-green-200 text-green-700 hover:bg-green-50">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm" className="border-green-200 text-green-700 hover:bg-green-50">
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="weather" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 bg-green-100">
            <TabsTrigger value="weather" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">
              <Cloud className="h-4 w-4 mr-2" />
              Data Cuaca
            </TabsTrigger>
            <TabsTrigger value="visitors" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">
              <Users className="h-4 w-4 mr-2" />
              Data Pengunjung
            </TabsTrigger>
            {/* <TabsTrigger value="settings" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">
              <Settings className="h-4 w-4 mr-2" />
              Pengaturan
            </TabsTrigger> */}
          </TabsList>

          {/* Weather Data Tab */}
          <TabsContent value="weather">
            <Card className="shadow-lg border-green-100">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-green-800">Data Cuaca</CardTitle>
                    <CardDescription>Kelola data cuaca dan kondisi lingkungan</CardDescription>
                  </div>
                  <Dialog open={isWeatherDialogOpen} onOpenChange={setIsWeatherDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-green-500 hover:bg-green-600">
                        <Plus className="h-4 w-4 mr-2" />
                        Tambah Data
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>{editingWeather ? "Edit Data Cuaca" : "Tambah Data Cuaca"}</DialogTitle>
                        <DialogDescription>
                          {editingWeather ? "Ubah informasi data cuaca" : "Masukkan data cuaca baru"}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="date">Tanggal</Label>
                            <Input
                              id="date"
                              type="date"
                              value={weatherForm.date}
                              onChange={(e) => setWeatherForm({ ...weatherForm, date: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="time">Waktu</Label>
                            <Input
                              id="time"
                              type="time"
                              value={weatherForm.time}
                              onChange={(e) => setWeatherForm({ ...weatherForm, time: e.target.value })}
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="temperature">Suhu (°C)</Label>
                            <Input
                              id="temperature"
                              type="number"
                              value={weatherForm.temperature}
                              onChange={(e) => setWeatherForm({ ...weatherForm, temperature: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="humidity">Kelembapan (%)</Label>
                            <Input
                              id="humidity"
                              type="number"
                              value={weatherForm.humidity}
                              onChange={(e) => setWeatherForm({ ...weatherForm, humidity: e.target.value })}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="condition">Kondisi Cuaca</Label>
                          <Select
                            value={weatherForm.condition}
                            onValueChange={(value) => setWeatherForm({ ...weatherForm, condition: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih kondisi cuaca" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Cerah">Cerah</SelectItem>
                              <SelectItem value="Berawan">Berawan</SelectItem>
                              <SelectItem value="Mendung">Mendung</SelectItem>
                              <SelectItem value="Hujan Ringan">Hujan Ringan</SelectItem>
                              <SelectItem value="Hujan Lebat">Hujan Lebat</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="windSpeed">Kecepatan Angin (km/h)</Label>
                          <Input
                            id="windSpeed"
                            type="number"
                            value={weatherForm.windSpeed}
                            onChange={(e) => setWeatherForm({ ...weatherForm, windSpeed: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="notes">Catatan</Label>
                          <Textarea
                            id="notes"
                            value={weatherForm.notes}
                            onChange={(e) => setWeatherForm({ ...weatherForm, notes: e.target.value })}
                            placeholder="Catatan tambahan..."
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setIsWeatherDialogOpen(false)
                            setEditingWeather(null)
                          }}
                        >
                          <X className="h-4 w-4 mr-2" />
                          Batal
                        </Button>
                        <Button
                          onClick={editingWeather ? handleUpdateWeather : handleAddWeather}
                          className="bg-green-500 hover:bg-green-600"
                        >
                          <Save className="h-4 w-4 mr-2" />
                          {editingWeather ? "Update" : "Simpan"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tanggal</TableHead>
                      <TableHead>Waktu</TableHead>
                      <TableHead>Suhu</TableHead>
                      <TableHead>Kelembapan</TableHead>
                      <TableHead>Kondisi</TableHead>
                      <TableHead>Angin</TableHead>
                      <TableHead>Catatan</TableHead>
                      <TableHead>Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {weatherData.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{new Date(item.date).toLocaleDateString("id-ID")}</TableCell>
                        <TableCell>{item.time}</TableCell>
                        <TableCell>{item.temperature}°C</TableCell>
                        <TableCell>{item.humidity}%</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            {item.condition}
                          </Badge>
                        </TableCell>
                        <TableCell>{item.windSpeed} km/h</TableCell>
                        <TableCell className="max-w-32 truncate">{item.notes}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditWeather(item)}
                              className="border-green-200 text-green-700 hover:bg-green-50"
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteWeather(item.id)}
                              className="border-red-200 text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Visitor Data Tab */}
          <TabsContent value="visitors">
            <Card className="shadow-lg border-green-100">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-green-800">Data Pengunjung</CardTitle>
                    <CardDescription>Kelola data pengunjung masuk dan keluar</CardDescription>
                  </div>
                  <Dialog open={isVisitorDialogOpen} onOpenChange={setIsVisitorDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-green-500 hover:bg-green-600">
                        <Plus className="h-4 w-4 mr-2" />
                        Tambah Data
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>{editingVisitor ? "Edit Data Pengunjung" : "Tambah Data Pengunjung"}</DialogTitle>
                        <DialogDescription>
                          {editingVisitor ? "Ubah informasi data pengunjung" : "Masukkan data pengunjung baru"}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="visitor-date">Tanggal</Label>
                            <Input
                              id="visitor-date"
                              type="date"
                              value={visitorForm.date}
                              onChange={(e) => setVisitorForm({ ...visitorForm, date: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="visitor-time">Waktu</Label>
                            <Input
                              id="visitor-time"
                              type="time"
                              value={visitorForm.time}
                              onChange={(e) => setVisitorForm({ ...visitorForm, time: e.target.value })}
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="visitors-in">Pengunjung Masuk</Label>
                            <Input
                              id="visitors-in"
                              type="number"
                              value={visitorForm.visitorsIn}
                              onChange={(e) => setVisitorForm({ ...visitorForm, visitorsIn: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="visitors-out">Pengunjung Keluar</Label>
                            <Input
                              id="visitors-out"
                              type="number"
                              value={visitorForm.visitorsOut}
                              onChange={(e) => setVisitorForm({ ...visitorForm, visitorsOut: e.target.value })}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="visitor-notes">Catatan</Label>
                          <Textarea
                            id="visitor-notes"
                            value={visitorForm.notes}
                            onChange={(e) => setVisitorForm({ ...visitorForm, notes: e.target.value })}
                            placeholder="Catatan tambahan..."
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setIsVisitorDialogOpen(false)
                            setEditingVisitor(null)
                          }}
                        >
                          <X className="h-4 w-4 mr-2" />
                          Batal
                        </Button>
                        <Button
                          onClick={editingVisitor ? handleUpdateVisitor : handleAddVisitor}
                          className="bg-green-500 hover:bg-green-600"
                        >
                          <Save className="h-4 w-4 mr-2" />
                          {editingVisitor ? "Update" : "Simpan"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tanggal</TableHead>
                      <TableHead>Waktu</TableHead>
                      <TableHead>Masuk</TableHead>
                      <TableHead>Keluar</TableHead>
                      <TableHead>Saat Ini</TableHead>
                      <TableHead>Catatan</TableHead>
                      <TableHead>Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {visitorData.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{new Date(item.date).toLocaleDateString("id-ID")}</TableCell>
                        <TableCell>{item.time}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            +{item.visitorsIn}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="bg-red-100 text-red-800">
                            -{item.visitorsOut}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                            {item.currentVisitors}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-32 truncate">{item.notes}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditVisitor(item)}
                              className="border-green-200 text-green-700 hover:bg-green-50"
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteVisitor(item.id)}
                              className="border-red-200 text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card className="shadow-lg border-green-100">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-green-800">Pengaturan Sistem</CardTitle>
                    <CardDescription>Kelola pengaturan dan konfigurasi sistem</CardDescription>
                  </div>
                  <Dialog open={isSettingsDialogOpen} onOpenChange={setIsSettingsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-green-500 hover:bg-green-600">
                        <Plus className="h-4 w-4 mr-2" />
                        Tambah Pengaturan
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>{editingSettings ? "Edit Pengaturan" : "Tambah Pengaturan"}</DialogTitle>
                        <DialogDescription>
                          {editingSettings ? "Ubah pengaturan sistem" : "Tambahkan pengaturan sistem baru"}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="setting-name">Nama Pengaturan</Label>
                          <Input
                            id="setting-name"
                            value={settingsForm.setting}
                            onChange={(e) => setSettingsForm({ ...settingsForm, setting: e.target.value })}
                            placeholder="contoh: max_capacity"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="setting-value">Nilai</Label>
                          <Input
                            id="setting-value"
                            value={settingsForm.value}
                            onChange={(e) => setSettingsForm({ ...settingsForm, value: e.target.value })}
                            placeholder="contoh: 100"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="setting-category">Kategori</Label>
                          <Select
                            value={settingsForm.category}
                            onValueChange={(value) => setSettingsForm({ ...settingsForm, category: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih kategori" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Pengunjung">Pengunjung</SelectItem>
                              <SelectItem value="Cuaca">Cuaca</SelectItem>
                              <SelectItem value="Sistem">Sistem</SelectItem>
                              <SelectItem value="Keamanan">Keamanan</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="setting-description">Deskripsi</Label>
                          <Textarea
                            id="setting-description"
                            value={settingsForm.description}
                            onChange={(e) => setSettingsForm({ ...settingsForm, description: e.target.value })}
                            placeholder="Deskripsi pengaturan..."
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setIsSettingsDialogOpen(false)
                            setEditingSettings(null)
                          }}
                        >
                          <X className="h-4 w-4 mr-2" />
                          Batal
                        </Button>
                        <Button
                          onClick={editingSettings ? handleUpdateSettings : handleAddSettings}
                          className="bg-green-500 hover:bg-green-600"
                        >
                          <Save className="h-4 w-4 mr-2" />
                          {editingSettings ? "Update" : "Simpan"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Pengaturan</TableHead>
                      <TableHead>Nilai</TableHead>
                      <TableHead>Kategori</TableHead>
                      <TableHead>Deskripsi</TableHead>
                      <TableHead>Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {systemSettings.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-mono text-sm">{item.setting}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            {item.value}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="border-green-200 text-green-700">
                            {item.category}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-48 truncate">{item.description}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditSettings(item)}
                              className="border-green-200 text-green-700 hover:bg-green-50"
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteSettings(item.id)}
                              className="border-red-200 text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
