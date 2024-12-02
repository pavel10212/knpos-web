'use client'
import { useAdminStore } from "@/store/adminStore"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function AdminLayout({ children }) {
  const router = useRouter()
  const { isAdmin } = useAdminStore()

  useEffect(() => {
    if (isAdmin === false) {
      router.push('/admin')
    }
  }, [isAdmin, router])



  return (
    <div suppressHydrationWarning>
      {children}
    </div>
  )
}
