"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Cloud,
  Droplets,
  Users,
  UserCheck,
  Thermometer,
  Wind,
  Calendar,
  Clock,
  // LogOut,
  TreePine,
  // Database,
  LogIn,
  Waves,
  Activity,
  CloudRain,
} from "lucide-react";
import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useGetDashboardData } from "@/hooks/sensor";
import { getStatusByKelembapan } from "@/lib/sensor";
import { cn } from "@/lib/utils";
import { useGetVisitorData, useGetVisitorDataHourly } from "@/hooks/visitor";
import { useMemo } from "react";
import { getWeatherData } from "@/service/cuaca";
import { useGetWeatherData } from "@/hooks/cuaca";

// Data cuaca per jam hari ini
// const weatherData = [
//   { time: "06:00", temp: 22, humidity: 85 },
//   { time: "08:00", temp: 24, humidity: 82 },
//   { time: "10:00", temp: 27, humidity: 78 },
//   { time: "12:00", temp: 29, humidity: 75 },
//   { time: "14:00", temp: 31, humidity: 72 },
//   { time: "16:00", temp: 28, humidity: 76 },
//   { time: "18:00", temp: 25, humidity: 80 },
// ];

// Data pengunjung per jam
// const visitorData = [
//   { time: "08:00", masuk: 5, keluar: 0 },
//   { time: "09:00", masuk: 12, keluar: 2 },
//   { time: "10:00", masuk: 18, keluar: 3 },
//   { time: "11:00", masuk: 25, keluar: 8 },
//   { time: "12:00", masuk: 15, keluar: 12 },
//   { time: "13:00", masuk: 20, keluar: 15 },
//   { time: "14:00", masuk: 22, keluar: 18 },
//   { time: "15:00", masuk: 18, keluar: 20 },
//   { time: "16:00", masuk: 10, keluar: 25 },
// ];

interface DashboardProps {
  onLogin: () => void;
}
export default function WaterfallDashboard({ onLogin }: DashboardProps) {
  const { data, isLoading, isError, error } = useGetDashboardData();
  const {
    data: visitorData,
    isLoading: isLoadingVisitor,
    isError: isErrorVisitor,
    error: errorVisitor,
  } = useGetVisitorDataHourly();

  const {
    data: weatherData,
    isLoading: isLoadingWeather,
    isError: isErrorWeather,
    error: errorWeather,
  } = useGetWeatherData();

  const totalMasuk = useMemo(() => {
    return visitorData?.data.reduce((sum, data) => sum + data.masuk, 0) || 0;
  }, [visitorData?.data]);

  const totalKeluar = useMemo(() => {
    return visitorData?.data.reduce((sum, data) => sum + data.keluar, 0) || 0;
  }, [visitorData?.data]);

  const pengunjungSaatIni = useMemo(() => {
    if (totalMasuk == 0) return 0;
    return totalMasuk - totalKeluar;
  }, [visitorData?.data]);

  if (isLoading || isLoadingVisitor || isLoadingWeather) return <div>Loading...</div>;

  if (isError || isErrorVisitor || isErrorWeather)
    return (
      <div>
        Error: {error?.message} {errorVisitor?.message} {errorWeather?.message}
      </div>
    );

  const currentTime = new Date().toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const currentDate = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

    const getCuacaLatest = () => {
      if (!weatherData?.length) return null;

      const now = new Date();
      const nowMinutes = now.getHours() * 60 + now.getMinutes();

      let closest = weatherData[0];
      let closestDiff = Math.abs(
        nowMinutes - convertTimeToMinutes(weatherData[0].time)
      );

      for (let i = 1; i < weatherData.length; i++) {
        const itemMinutes = convertTimeToMinutes(weatherData[i].time);
        const diff = Math.abs(nowMinutes - itemMinutes);

        if (diff < closestDiff) {
          closest = weatherData[i];
          closestDiff = diff;
        }
      }

      return closest.weatherDesc || 'Normal';
    };

    function convertTimeToMinutes(timeStr: string): number {
      const [hour, minute] = timeStr.split(":").map(Number);
      return hour * 60 + minute;
    }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="text-center flex-1 space-y-2">
            <div className="flex items-center justify-center gap-2 text-2xl font-bold text-gray-800">
              <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg">
                <TreePine className="h-6 w-6 text-white" />
              </div>
              Dashboard Wisata Air Terjun Banyumaro
            </div>
            <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {currentDate}
              </div>
              <Separator orientation="vertical" className="h-4" />
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {currentTime}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={onLogin}
              variant="outline"
              size="sm"
              className="border-green-200 text-green-700 hover:bg-green-50"
            >
              <LogIn className="h-4 w-4 mr-2" />
              Login
            </Button>
          </div>
        </div>

        {/* Image Carousel */}
        <Card className="shadow-lg border-green-100 overflow-hidden">
          <CardContent className="p-0">
            <Carousel className="w-full">
              <CarouselContent>
                <CarouselItem>
                  <div className="relative h-64 md:h-80 lg:h-96">
                    <img
                      src="https://live.staticflickr.com/65535/50647347593_ecc150826b_o.jpg"
                      alt="Air Terjun Sekumpul - Pemandangan Utama"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="text-xl font-bold mb-1">
                        Air Terjun Sekumpul
                      </h3>
                      <p className="text-sm opacity-90">
                        Pemandangan utama air terjun yang menakjubkan
                      </p>
                    </div>
                  </div>
                </CarouselItem>
                <CarouselItem>
                  <div className="relative h-64 md:h-80 lg:h-96">
                    <img
                      src="https://live.staticflickr.com/65535/50647347593_ecc150826b_o.jpg"
                      alt="Area Pengunjung"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="text-xl font-bold mb-1">
                        Area Pengunjung
                      </h3>
                      <p className="text-sm opacity-90">
                        Fasilitas dan area rekreasi untuk wisatawan
                      </p>
                    </div>
                  </div>
                </CarouselItem>
                <CarouselItem>
                  <div className="relative h-64 md:h-80 lg:h-96">
                    <img
                      src="https://live.staticflickr.com/65535/50647347593_ecc150826b_o.jpg"
                      alt="Jalur Trekking"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="text-xl font-bold mb-1">Jalur Trekking</h3>
                      <p className="text-sm opacity-90">
                        Perjalanan menuju air terjun melalui alam
                      </p>
                    </div>
                  </div>
                </CarouselItem>
                <CarouselItem>
                  <div className="relative h-64 md:h-80 lg:h-96">
                    <img
                      src="https://live.staticflickr.com/65535/50647347593_ecc150826b_o.jpg"
                      alt="Kolam Alami"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="text-xl font-bold mb-1">Kolam Alami</h3>
                      <p className="text-sm opacity-90">
                        Kolam alami untuk berenang dan bersantai
                      </p>
                    </div>
                  </div>
                </CarouselItem>
                <CarouselItem>
                  <div className="relative h-64 md:h-80 lg:h-96">
                    <img
                      src="https://live.staticflickr.com/65535/50647347593_ecc150826b_o.jpg"
                      alt="Sunrise di Air Terjun"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="text-xl font-bold mb-1">
                        Sunrise di Air Terjun
                      </h3>
                      <p className="text-sm opacity-90">
                        Momen sunrise yang memukau di pagi hari
                      </p>
                    </div>
                  </div>
                </CarouselItem>
              </CarouselContent>
              <CarouselPrevious className="left-4 bg-white/80 hover:bg-white border-green-200 text-green-700" />
              <CarouselNext className="right-4 bg-white/80 hover:bg-white border-green-200 text-green-700" />
            </Carousel>
          </CardContent>
        </Card>

        {/* Kartu Informasi Utama */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Curah Hujan */}
          <Card className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <CloudRain className="h-4 w-4" />
                Curah Hujan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {data?.data?.curah_hujan?.toFixed(1) || 0}
              </div>
              <p className="text-indigo-100 text-sm">mm hari ini</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge
                  variant="secondary"
                  className={`text-xs ${
                    data?.data?.curah_hujan || 0 > 10
                      ? "bg-red-400 text-red-900"
                      : "bg-indigo-400 text-indigo-900"
                  }`}
                >
                  {data?.data?.curah_hujan || 0 > 10
                    ? "Hujan Lebat"
                    : data?.data?.curah_hujan || 0 > 5
                    ? "Hujan Sedang"
                    : "Ringan"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Debit Air */}
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Debit Air
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {data?.data?.debit_air || 0}
              </div>
              <p className="text-blue-100 text-sm">m³/detik</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge
                  variant="secondary"
                  className={`text-xs ${
                    data?.data?.debit_air || 0 > 20
                      ? "bg-red-400 text-red-900"
                      : "bg-blue-400 text-blue-900"
                  }`}
                >
                  {data?.data?.debit_air || 0 > 20 ? "Deras" : "Normal"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Ketinggian Air */}
          <Card className="bg-gradient-to-br from-cyan-500 to-cyan-600 text-white shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Waves className="h-4 w-4" />
                Ketinggian Air
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {data?.data?.ketinggian_air || 0}m
              </div>
              <p className="text-cyan-100 text-sm">
                {data?.data?.ketinggian_air || 0 > 1.5
                  ? "Tinggi"
                  : data?.data?.ketinggian_air || 0 > 1.0
                  ? "Normal"
                  : "Rendah"}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Badge
                  variant="secondary"
                  className={`text-xs ${
                    data?.data?.ketinggian_air || 0 > 1.5
                      ? "bg-red-400 text-red-900"
                      : "bg-cyan-400 text-cyan-900"
                  }`}
                >
                  {data?.data?.ketinggian_air || 0 > 1.5 ? "Waspada" : "Aman"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Kelembapan */}
          <Card
            className={cn(
              " text-white shadow-lg",
              getStatusByKelembapan(data?.data?.kelembapan) === "Kering" &&
                "bg-gradient-to-br from-red-500 to-red-600",
              getStatusByKelembapan(data?.data?.kelembapan) === "Normal" &&
                "bg-gradient-to-br from-emerald-500 to-emerald-600",
              getStatusByKelembapan(data?.data?.kelembapan) === "Basah" &&
                "bg-gradient-to-br from-blue-500 to-blue-600"
            )}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Droplets className="h-4 w-4" />
                Kelembapan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data?.data?.kelembapan}</div>
              <p className="text-emerald-100 text-sm">
                {getStatusByKelembapan(data?.data?.kelembapan)}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Thermometer className="h-3 w-3" />
                <span className="text-xs">
                  Terasa {Math.round(data?.data?.kelembapan || 0)}°C
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Cuaca Saat Ini */}
          <Card className="col-span-1 lg:col-span-2 bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Cloud className="h-4 w-4" />
                Cuaca Saat Ini
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data?.data?.suhu}°C</div>
              <p className="text-green-100 text-sm">{getCuacaLatest()}</p>
              <div className="flex items-center gap-2 mt-2">
                <Wind className="h-3 w-3" />
                <span className="text-xs">
                  Angin {data?.data?.kecepatan_angin} km/h
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Total Pengunjung Hari Ini */}
          <Card className="bg-gradient-to-br from-teal-500 to-teal-600 text-white shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Users className="h-4 w-4" />
                Pengunjung Hari Ini
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalMasuk}</div>
              <p className="text-teal-100 text-sm">Total masuk</p>
              <div className="flex items-center gap-2 mt-2">
                {visitorData?.data[visitorData?.data.length - 1]?.masuk !==
                  0 && (
                  <Badge
                    variant="secondary"
                    className="text-xs bg-teal-400 text-teal-900"
                  >
                    +
                    {visitorData?.data[visitorData?.data.length - 1]?.masuk ||
                      0}{" "}
                    jam terakhir
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Pengunjung Saat Ini */}
          <Card className="bg-gradient-to-br from-lime-500 to-lime-600 text-white shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <UserCheck className="h-4 w-4" />
                Pengunjung Saat Ini
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pengunjungSaatIni}</div>
              <p className="text-lime-100 text-sm">Sedang berkunjung</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge
                  variant="secondary"
                  className={`text-xs ${
                    pengunjungSaatIni > 50
                      ? "bg-red-400 text-red-900"
                      : "bg-lime-400 text-lime-900"
                  }`}
                >
                  {pengunjungSaatIni > 50 ? "Ramai" : "Normal"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Grafik */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Grafik Cuaca & Kelembapan */}
          <Card className="shadow-lg border-green-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-800">
                <Thermometer className="h-5 w-5 text-green-600" />
                Tren Cuaca & Kelembapan Hari Ini
              </CardTitle>
              <CardDescription>
                Suhu dan kelembapan sepanjang hari
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  temp: {
                    label: "Suhu (°C)",
                    color: "#10b981",
                  },
                  humidity: {
                    label: "Kelembapan (%)",
                    color: "#06b6d4",
                  }
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weatherData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="time" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line
                      type="monotone"
                      dataKey="temp"
                      stroke="#10b981"
                      strokeWidth={3}
                      name="Suhu (°C)"
                    />
                    <Line
                      type="monotone"
                      dataKey="humidity"
                      stroke="#06b6d4"
                      strokeWidth={3}
                      name="Kelembapan (%)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Grafik Pengunjung */}
          <Card className="shadow-lg border-green-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-800">
                <Users className="h-5 w-5 text-green-600" />
                Aktivitas Pengunjung Hari Ini
              </CardTitle>
              <CardDescription>
                Jumlah pengunjung masuk dan keluar per jam
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  masuk: {
                    label: "Masuk",
                    color: "#22c55e",
                  },
                  keluar: {
                    label: "Keluar",
                    color: "#ef4444",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={visitorData?.data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="hour" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line
                      type="monotone"
                      dataKey="masuk"
                      stroke="#22c55e"
                      strokeWidth={3}
                      name="Masuk"
                    />
                    <Line
                      type="monotone"
                      dataKey="keluar"
                      stroke="#ef4444"
                      strokeWidth={3}
                      name="Keluar"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Informasi Tambahan */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="shadow-lg border-green-100">
            <CardHeader>
              <CardTitle className="text-sm text-green-800">
                Status Keamanan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-green-700">Aman</span>
              </div>
              <p className="text-xs text-gray-600 mt-1">
                Kondisi cuaca mendukung untuk aktivitas wisata
              </p>
            </CardContent>  
          </Card>

          <Card className="shadow-lg border-green-100">
            <CardHeader>
              <CardTitle className="text-sm text-green-800">
                Kapasitas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-sm text-green-700">
                  {pengunjungSaatIni}/100
                </span>
                <Badge
                  variant={pengunjungSaatIni > 80 ? "destructive" : "secondary"}
                  className="bg-green-100 text-green-800"
                >
                  {Math.round((pengunjungSaatIni / 100) * 100)}%
                </Badge>
              </div>
              <div className="w-full bg-green-100 rounded-full h-2 mt-2">
                <div
                  className={`h-2 rounded-full ${
                    pengunjungSaatIni > 80 ? "bg-red-500" : "bg-green-500"
                  }`}
                  style={{
                    width: `${Math.min((pengunjungSaatIni / 100) * 100, 100)}%`,
                  }}
                ></div>
              </div>
            </CardContent>
          </Card>

          {/* <Card className="shadow-lg border-green-100">
            <CardHeader>
              <CardTitle className="text-sm text-green-800">
                Prediksi Cuaca
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Cloud className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-700">
                  Berawan sore hari
                </span>
              </div>
              <p className="text-xs text-gray-600 mt-1">
                Kemungkinan hujan ringan 30%
              </p>
            </CardContent>
          </Card> */}
        </div>
      </div>
    </div>
  );
}
