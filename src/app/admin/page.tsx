"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Plus,
  LogOut,
  Clock,
  User,
  DollarSign,
  ArrowLeft,
  Search,
  UserCheck,
  Users,
  Download,
  Upload,
  CheckCircle,
  AlertCircle,
  Loader2,
  Image,
} from "lucide-react";
import {
  useGetVisitorDataDaily,
  useCheckInVisitor,
  useCheckOutVisitor,
  visitorKey,
} from "@/hooks/visitor";
import { Visitor } from "@/types/visitor";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

interface VisitorManagementProps {
  onBack: () => void;
}

export default function VisitorManagement({ onBack }: VisitorManagementProps) {
  // React Query hooks
  const {
    data: visitorsResponse,
    isLoading,
    error,
    refetch,
  } = useGetVisitorDataDaily();
  const queryClient = useQueryClient();
  const checkInMutation = useCheckInVisitor();
  const checkOutMutation = useCheckOutVisitor();

  // Form states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [newVisitor, setNewVisitor] = useState({
    name: "",
    amount: "",
  });

  // Loading state - include mutation loading states
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Memuat Data Pengunjung
          </h2>
          <p className="text-gray-600">Mohon tunggu sebentar...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Gagal Memuat Data
          </h2>
          <p className="text-gray-600 mb-4">
            Terjadi kesalahan saat memuat data pengunjung
          </p>
          <Button
            onClick={() => refetch()}
            className="bg-green-500 hover:bg-green-600"
          >
            Coba Lagi
          </Button>
        </div>
      </div>
    );
  }

  // Extract visitors data from API response
  const visitors: Visitor[] = visitorsResponse?.data || [];

  // Filter visitors based on check_out_time
  const activeVisitors = visitors.filter(
    (v) => !v.check_out_time || v.check_out_time === ""
  );
  const checkedOutVisitors = visitors.filter(
    (v) => v.check_out_time && v.check_out_time !== ""
  );

  // Apply search filter
  const filteredActiveVisitors = activeVisitors.filter(
    (visitor) =>
      visitor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visitor?.ticket_number?.toLowerCase()?.includes(searchTerm.toLowerCase())
  );

  const filteredCheckedOutVisitors = checkedOutVisitors.filter(
    (visitor) =>
      visitor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visitor?.ticket_number?.toLowerCase()?.includes(searchTerm.toLowerCase())
  );

  const totalVisitors = visitors.reduce((sum, v) => sum + v.amount, 0);

  // Functions
  const handleCheckIn = () => {
    const visitorData = {
      name: newVisitor.name,
      amount: Number(newVisitor.amount),
    };

    checkInMutation.mutate(visitorData, {
      onSuccess: () => {
        // Reset form and close dialog on success
        setNewVisitor({ name: "", amount: "" });
        setIsAddDialogOpen(false);

        queryClient.refetchQueries({ queryKey: [visitorKey] });

        toast.success("Visitor checked in successfully");
      },
      onError: () => {
        toast.error("Failed to check in visitor");
      },
    });
  };

  const handleCheckOut = (visitorId: number) => {
    checkOutMutation.mutate(visitorId, {
      onSuccess: () => {
        queryClient.refetchQueries({ queryKey: [visitorKey] });
        toast.success("Visitor checked out successfully");
      },
      onError: () => {
        toast.error("Failed to check out visitor");
      },
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDateTime = (dateTime: string) => {
    if (!dateTime) return "-";
    return new Date(dateTime).toLocaleString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const calculateDuration = (checkIn: string, checkOut: string) => {
    if (!checkIn || !checkOut) return "-";
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffMs = end.getTime() - start.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${diffHours}j ${diffMinutes}m`;
  };

  const calculateCurrentDuration = (checkIn: string) => {
    if (!checkIn) return "-";
    const start = new Date(checkIn);
    const now = new Date();
    const diffMs = now.getTime() - start.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${diffHours}j ${diffMinutes}m`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button
                variant="outline"
                size="sm"
                className="border-green-200 text-green-700 hover:bg-green-50 bg-transparent"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kembali ke Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Kelola Data Pengunjung
              </h1>
              <p className="text-gray-600 text-sm">
                Sistem check-in dan check-out pengunjung wisata
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href="/admin/images">
              <Button
                variant="outline"
                size="sm"
                className="border-green-200 text-green-700 hover:bg-green-50 bg-transparent"
              >
                {/* <Upload className="h-4 w-4 mr-2" />
                 */}
                <Image />
                Image Management
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Pengunjung Aktif</p>
                  <p className="text-2xl font-bold">{activeVisitors.length}</p>
                </div>
                <UserCheck className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">
                    Total Rombongan Hari Ini
                  </p>
                  <p className="text-2xl font-bold">{visitors.length}</p>
                </div>
                <Users className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">
                    Total Pengunjung Hari Ini
                  </p>
                  <p className="text-2xl font-bold">{totalVisitors}</p>
                </div>
                <Users className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-100 text-sm">Sudah Check-out</p>
                  <p className="text-2xl font-bold">
                    {checkedOutVisitors.length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-emerald-200" />
              </div>
            </CardContent>
          </Card>

          {/* <Card className="bg-gradient-to-br from-teal-500 to-teal-600 text-white shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-teal-100 text-sm">Total Pendapatan</p>
                  <p className="text-xl font-bold">
                    {formatCurrency(totalRevenue * 30000)}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-teal-200" />
              </div>
            </CardContent>
          </Card> */}
        </div>

        {/* Search and Add */}
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Cari nama atau nomor tiket..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-green-200 focus:border-green-500 focus:ring-green-500"
            />
          </div>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-green-500 hover:bg-green-600">
                <Plus className="h-4 w-4 mr-2" />
                Check-in Pengunjung
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Check-in Pengunjung Baru</DialogTitle>
                <DialogDescription>
                  Masukkan data pengunjung untuk check-in
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="visitor-name">Nama Pengunjung</Label>
                  <Input
                    id="visitor-name"
                    value={newVisitor.name}
                    onChange={(e) =>
                      setNewVisitor({ ...newVisitor, name: e.target.value })
                    }
                    placeholder="Masukkan nama lengkap"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="visitor-amount">Jumlah Pengunjung</Label>
                  <Input
                    id="visitor-amount"
                    type="number"
                    value={newVisitor.amount}
                    onChange={(e) =>
                      setNewVisitor({ ...newVisitor, amount: e.target.value })
                    }
                    placeholder="Masukkan jumlah pembayaran"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  Batal
                </Button>
                <Button
                  onClick={handleCheckIn}
                  className="bg-green-500 hover:bg-green-600"
                  disabled={
                    !newVisitor.name ||
                    !newVisitor.amount ||
                    checkInMutation.isPending
                  }
                >
                  {checkInMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    <>
                      <UserCheck className="h-4 w-4 mr-2" />
                      Check-in
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="active" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 bg-green-100">
            <TabsTrigger
              value="active"
              className="data-[state=active]:bg-green-500 data-[state=active]:text-white"
            >
              <AlertCircle className="h-4 w-4 mr-2" />
              Pengunjung Aktif ({activeVisitors.length})
            </TabsTrigger>
            <TabsTrigger
              value="completed"
              className="data-[state=active]:bg-green-500 data-[state=active]:text-white"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Sudah Check-out ({checkedOutVisitors.length})
            </TabsTrigger>
          </TabsList>

          {/* Active Visitors Tab */}
          <TabsContent value="active">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredActiveVisitors.map((visitor) => (
                <Card
                  key={visitor.id}
                  className="shadow-lg border-green-100 hover:shadow-xl transition-shadow"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-800"
                      >
                        {visitor.ticket_number}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="border-orange-200 text-orange-700 bg-orange-50"
                      >
                        <Clock className="h-3 w-3 mr-1" />
                        Aktif
                      </Badge>
                    </div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <User className="h-5 w-5 text-green-600" />
                      {visitor.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        Jumlah Pengunjung:
                      </span>
                      <span className="font-semibold text-green-700">
                        {visitor.amount}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Check-in:</span>
                      <span className="text-sm font-medium">
                        {formatDateTime(visitor.check_in_time)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Durasi:</span>
                      <span className="text-sm font-medium text-blue-600">
                        {calculateCurrentDuration(visitor.check_in_time)}
                      </span>
                    </div>
                    <Button
                      onClick={() => handleCheckOut(visitor.id)}
                      className="w-full bg-red-500 hover:bg-red-600 text-white"
                      disabled={checkOutMutation.isPending}
                    >
                      {checkOutMutation.isPending ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Memproses...
                        </>
                      ) : (
                        <>
                          <LogOut className="h-4 w-4 mr-2" />
                          Check-out Sekarang
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            {filteredActiveVisitors.length === 0 && (
              <Card className="shadow-lg border-green-100">
                <CardContent className="text-center py-12">
                  <UserCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Tidak ada pengunjung aktif
                  </h3>
                  <p className="text-gray-600">
                    {searchTerm
                      ? "Tidak ditemukan pengunjung dengan kata kunci tersebut"
                      : "Semua pengunjung sudah check-out"}
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Completed Visitors Tab */}
          <TabsContent value="completed">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCheckedOutVisitors.map((visitor) => (
                <Card
                  key={visitor.id}
                  className="shadow-lg border-green-100 opacity-90"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <Badge
                        variant="secondary"
                        className="bg-gray-100 text-gray-800"
                      >
                        {visitor.ticket_number}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="border-green-200 text-green-700 bg-green-50"
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Selesai
                      </Badge>
                    </div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <User className="h-5 w-5 text-gray-600" />
                      {visitor.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        Jumlah Pengunjung:
                      </span>
                      <span className="font-semibold text-green-700">
                        {visitor.amount}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Check-in:</span>
                      <span className="text-sm">
                        {formatDateTime(visitor.check_in_time)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Check-out:</span>
                      <span className="text-sm">
                        {formatDateTime(visitor.check_out_time)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        Total Durasi:
                      </span>
                      <span className="text-sm font-medium text-blue-600">
                        {calculateDuration(
                          visitor.check_in_time,
                          visitor.check_out_time
                        )}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            {filteredCheckedOutVisitors.length === 0 && (
              <Card className="shadow-lg border-green-100">
                <CardContent className="text-center py-12">
                  <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Belum ada yang check-out
                  </h3>
                  <p className="text-gray-600">
                    {searchTerm
                      ? "Tidak ditemukan pengunjung dengan kata kunci tersebut"
                      : "Pengunjung yang sudah check-out akan muncul di sini"}
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
