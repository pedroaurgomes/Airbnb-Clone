'use client'
import { useEffect, useState } from "react"

export default function HealthPage() {
  const [status, setStatus] = useState("Checking...")
  
  const apiUrl = process.env.NEXT_PUBLIC_API_URL

  useEffect(() => {
    fetch(`${apiUrl}/ping`)
      .then(res => res.json())
      .then(data => setStatus(data.message))
      .catch(() => setStatus("Backend unreachable"))
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh]">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-[#222222]">Health Check</h1>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${status === "pong" ? "bg-green-500" : "bg-red-500"}`} />
          <p className="text-[#717171]">
            Backend status: <span className="font-semibold">{status}</span>
          </p>
        </div>
      </div>
    </div>
  )
}