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
    <div className="p-4">
      <h1 className="text-xl font-bold">Health Check</h1>
      <p>Backend status: {status}</p>
    </div>
  )
}

