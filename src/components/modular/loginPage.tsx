"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Eye,
  EyeOff,
  MapPin,
  Droplets,
  TreePine,
  Lock,
  User,
  X,
  AlertCircle,
} from "lucide-react";
import { useLogin } from "@/hooks/auth";
// import { useRouter } from "next/router"
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { isPending,mutateAsync } = useLogin();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    mutateAsync(
      { email, password },
      {
        onSuccess: (result) => {
          console.log("Login berhasil:", result);

          // Clear form
          setEmail("");
          setPassword("");

          // Simpan ke localStorage
          localStorage.setItem("user", JSON.stringify(result.data.user));
          localStorage.setItem("accessToken", result.data.token);
          console.log(localStorage.getItem("accessToken"));
          console.log(localStorage.getItem("user"));

          // Tampilkan toast sukses
          toast.custom(
            (t) => (
              <div className="flex justify-between">
                <div className="flex items-center">
                  <AlertCircle />
                  <div className="ml-2">Login Success</div>
                </div>
                <Button
                  className="text-white"
                  variant="link"
                  onClick={() => toast.dismiss(t)}
                >
                  <X />
                </Button>
              </div>
            ),
            {
              unstyled: true,
              duration: 5000,
              classNames: {
                toast:
                  "bg-green-500 rounded-lg py-2 px-4 shadow-lg text-white w-96",
              },
            }
          );

          // router.push("/admin");
          window.location.href = "/admin";
        },
        onError: (error) => {
          toast.custom(
            (t) => (
              <div className="flex justify-between">
                <div className="flex items-center">
                  <AlertCircle />
                  <div className="ml-2">Login Credentials Invalid</div>
                </div>
                <Button
                  className="text-white"
                  variant="link"
                  onClick={() => toast.dismiss(t)}
                >
                  <X />
                </Button>
              </div>
            ),
            {
              unstyled: true,
              classNames: {
                toast:
                  "bg-red-500 rounded-lg py-2 px-4 shadow-lg text-white w-96",
              },
            }
          );
          console.error("Login gagal:", error);
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute top-40 left-40 w-60 h-60 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Header dengan logo dan nama */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mb-4 shadow-lg">
            <MapPin className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Wisata Air Terjun Banyumaro
          </h1>
          <p className="text-gray-600 text-sm">Sistem Monitoring & Manajemen</p>
        </div>

        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl text-center text-gray-800 flex items-center justify-center gap-2">
              <Lock className="h-5 w-5 text-green-600" />
              Masuk ke Dashboard
            </CardTitle>
            <CardDescription className="text-center text-gray-600">
              Masukkan kredensial Anda untuk mengakses sistem monitoring
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700"
                >
                  Email atau Username
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@banyumaro.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 border-gray-200 focus:border-green-500 focus:ring-green-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700"
                >
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Masukkan password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 border-gray-200 focus:border-green-500 focus:ring-green-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium py-2.5 transition-all duration-200 shadow-lg hover:shadow-xl"
                disabled={isPending}
              >
                {isPending ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Memverifikasi...
                  </div>
                ) : (
                  "Masuk ke Dashboard"
                )}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">
                  Demo Account
                </span>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <TreePine className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-green-700">
                  <p className="font-medium mb-1">Akun Demo:</p>
                  <p>Email: admin@banyumaro.com</p>
                  <p>Password: admin123</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6 text-xs text-gray-500">
          <div className="flex items-center justify-center gap-1 mb-2">
            <Droplets className="h-3 w-3 text-green-500" />
            <span>Sistem Monitoring Wisata Alam</span>
          </div>
          <p>&copy; 2024 Wisata Air Terjun Banyumaro. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
