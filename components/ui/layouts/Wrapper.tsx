'use client'
import { useEffect, useState } from 'react'
import TeacherLayout from './TeacherLayout'
import StudentLayout from './StudentLayout'

export default function Wrapper({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<string | null>(null)

  useEffect(() => {
    async function fetchRole() {
      const accessToken = localStorage.getItem('accessToken')
      if (!accessToken) return

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/users/me/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        if (res.ok) {
          const data = await res.json()
          setRole(data.role)
        }
      } catch (err) {
        console.error('Error fetching role', err)
      }
    }

    fetchRole()
  }, [])

  return role === "teacher" ? (<TeacherLayout>{children}</TeacherLayout>) : (<StudentLayout>{children}</StudentLayout>)
}
