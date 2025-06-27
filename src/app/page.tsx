"use client"

import { useState } from "react"
import LoginPage from "@/components/modular/loginPage"
import WaterfallDashboard from "@/components/modular/waterfallDashboard"
// import { useRouter } from "next/navigation";

export default function Page() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLoginPage = () => {
    setIsLoggedIn(true)
  }

  if (!isLoggedIn) {
    return <WaterfallDashboard onLogin={handleLoginPage} />
  }

  return <LoginPage />
}
