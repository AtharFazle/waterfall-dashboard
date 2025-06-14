"use client"

import { useState } from "react"
import LoginPage from "@/components/modular/loginPage"
import WaterfallDashboard from "@/components/modular/waterfallDashboard"

export default function Page() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const handleLogin = () => {
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
  }

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />
  }

  return <WaterfallDashboard onLogout={handleLogout} />
}
