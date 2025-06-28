"use client"

import { useEffect, useState } from "react"
import { TreePine, Droplets, Waves, MapPin } from "lucide-react"

interface LoadingPageProps {
  onLoadingComplete?: () => void
  duration?: number
}

export default function LoadingPage({ onLoadingComplete, duration = 3000 }: LoadingPageProps) {
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)
  const [isClient, setIsClient] = useState(false)

  const loadingSteps = [
    { text: "Memuat sistem monitoring...", icon: MapPin },
    { text: "Menghubungkan sensor cuaca...", icon: Droplets },
    { text: "Menyinkronkan data pengunjung...", icon: TreePine },
    { text: "Mempersiapkan dashboard...", icon: Waves },
  ]

  // Fixed particle positions to avoid hydration mismatch
  const particlePositions = [
    { left: '10%', top: '20%', delay: 0.5, duration: 3 },
    { left: '85%', top: '15%', delay: 1.2, duration: 2.5 },
    { left: '70%', top: '80%', delay: 0.8, duration: 3.5 },
    { left: '20%', top: '70%', delay: 2.1, duration: 2.8 },
    { left: '45%', top: '25%', delay: 1.5, duration: 3.2 },
    { left: '90%', top: '60%', delay: 0.3, duration: 2.7 },
    { left: '15%', top: '45%', delay: 1.8, duration: 3.1 },
    { left: '65%', top: '10%', delay: 0.9, duration: 2.9 },
    { left: '30%', top: '85%', delay: 2.3, duration: 2.6 },
    { left: '80%', top: '35%', delay: 1.1, duration: 3.3 },
    { left: '5%', top: '55%', delay: 1.7, duration: 2.4 },
    { left: '95%', top: '25%', delay: 0.6, duration: 3.4 },
    { left: '40%', top: '5%', delay: 2.0, duration: 2.3 },
    { left: '75%', top: '75%', delay: 1.4, duration: 3.6 },
    { left: '25%', top: '40%', delay: 0.7, duration: 2.1 },
    { left: '60%', top: '90%', delay: 1.9, duration: 3.0 },
    { left: '12%', top: '65%', delay: 0.4, duration: 2.8 },
    { left: '88%', top: '50%', delay: 1.6, duration: 2.2 },
    { left: '35%', top: '15%', delay: 2.2, duration: 3.7 },
    { left: '55%', top: '70%', delay: 1.0, duration: 2.5 }
  ]

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 1

        // Update current step based on progress
        const stepIndex = Math.floor((newProgress / 100) * loadingSteps.length)
        setCurrentStep(Math.min(stepIndex, loadingSteps.length - 1))

        if (newProgress >= 100) {
          clearInterval(interval)
          setTimeout(() => {
            onLoadingComplete?.()
          }, 500)
          return 100
        }
        return newProgress
      })
    }, duration / 100)

    return () => clearInterval(interval)
  }, [duration, onLoadingComplete, loadingSteps.length])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating particles - only render on client */}
        {isClient && particlePositions.map((particle, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-green-200 rounded-full opacity-30 animate-pulse"
            style={{
              left: particle.left,
              top: particle.top,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`,
            }}
          />
        ))}

        {/* Animated waves */}
        <div className="absolute bottom-0 left-0 w-full">
          <svg className="w-full h-32 text-green-100 opacity-50" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path
              d="M0,60 C150,100 350,0 600,60 C850,120 1050,20 1200,60 L1200,120 L0,120 Z"
              fill="currentColor"
              className="animate-pulse"
            />
          </svg>
        </div>

        {/* Gradient orbs */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute top-40 left-40 w-60 h-60 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
      </div>

      {/* Main Loading Content */}
      <div className="relative z-10 text-center max-w-md mx-auto px-6">
        {/* Logo and Title */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mb-6 shadow-2xl animate-bounce">
            <TreePine className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Wisata Air Terjun Sekumpul</h1>
          <p className="text-gray-600 text-lg">Sistem Monitoring & Manajemen</p>
        </div>

        {/* Loading Animation */}
        <div className="mb-8">
          {/* Waterfall Animation */}
          <div className="relative w-32 h-32 mx-auto mb-6">
            <div className="absolute inset-0 bg-gradient-to-b from-blue-400 to-blue-600 rounded-t-full opacity-80">
              {/* Water drops animation - fixed positions */}
              {[20, 35, 50, 65, 80, 95].map((leftPercent, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-4 bg-blue-300 rounded-full animate-pulse"
                  style={{
                    left: `${leftPercent}%`,
                    top: "80%",
                    animationDelay: `${i * 0.2}s`,
                    animationDuration: "1s",
                  }}
                />
              ))}
            </div>

            {/* Rotating ring */}
            <div className="absolute inset-2 border-4 border-green-300 border-t-green-600 rounded-full animate-spin"></div>

            {/* Center icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Droplets className="h-8 w-8 text-green-600 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="w-full bg-green-100 rounded-full h-3 shadow-inner">
            <div
              className="bg-gradient-to-r from-green-500 to-emerald-600 h-3 rounded-full transition-all duration-300 ease-out shadow-lg"
              style={{ width: `${progress}%` }}
            >
              <div className="h-full bg-white bg-opacity-30 rounded-full animate-pulse"></div>
            </div>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-sm text-gray-600">{progress}%</span>
            <span className="text-sm font-medium text-green-700">{progress === 100 ? "Selesai!" : "Memuat..."}</span>
          </div>
        </div>

        {/* Loading Steps */}
        <div className="space-y-3">
          {loadingSteps.map((step, index) => {
            const Icon = step.icon
            const isActive = index === currentStep
            const isCompleted = index < currentStep

            return (
              <div
                key={index}
                className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${
                  isActive
                    ? "bg-green-100 border border-green-200 shadow-md"
                    : isCompleted
                      ? "bg-gray-50 border border-gray-200"
                      : "bg-transparent"
                }`}
              >
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 ${
                    isActive
                      ? "bg-green-500 text-white animate-pulse"
                      : isCompleted
                        ? "bg-green-400 text-white"
                        : "bg-gray-200 text-gray-400"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <span
                  className={`text-sm transition-all duration-300 ${
                    isActive ? "text-green-800 font-medium" : isCompleted ? "text-gray-600" : "text-gray-400"
                  }`}
                >
                  {step.text}
                </span>
                {isActive && (
                  <div className="ml-auto">
                    <div className="flex space-x-1">
                      <div className="w-1 h-1 bg-green-500 rounded-full animate-bounce"></div>
                      <div
                        className="w-1 h-1 bg-green-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-1 h-1 bg-green-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                )}
                {isCompleted && (
                  <div className="ml-auto">
                    <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                      <div className="w-2 h-1 bg-white rounded-full transform rotate-45 translate-x-0.5"></div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center gap-2 text-xs text-gray-500 mb-2">
            <Waves className="h-3 w-3 text-green-500" />
            <span>Sistem Monitoring Wisata Alam</span>
          </div>
          <p className="text-xs text-gray-400">&copy; 2024 Wisata Air Terjun Sekumpul. All rights reserved.</p>
        </div>
      </div>

      {/* Loading overlay for final transition */}
      {progress === 100 && (
        <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center z-20 animate-fade-in">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4 mx-auto animate-pulse">
              <TreePine className="h-8 w-8 text-white" />
            </div>
            <p className="text-lg font-semibold text-green-700">Dashboard Siap!</p>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-in-out;
        }
      `}</style>
    </div>
  )
}