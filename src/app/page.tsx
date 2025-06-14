"use client"

import { useState } from "react"
import LoginPage from "@/components/modular/loginPage"
import WaterfallDashboard from "@/components/modular/waterfallDashboard"
import { useRouter } from "next/navigation";

export default function Page() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  const handleLogin = ({ email, password }: { email: string; password: string }) => {

    if(email == 'admin@sekumpul.com'){
        router.push('/admin')
        return;
    }
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
  }

  const handleLoginPage = () => {
    setIsLoggedIn(true)
  }

  if (!isLoggedIn) {
    return <WaterfallDashboard onLogin={handleLoginPage} />
  }

  return <LoginPage onLogin={handleLogin} />
}
