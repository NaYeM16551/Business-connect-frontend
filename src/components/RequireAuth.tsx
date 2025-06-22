// src/components/RequireAuth.tsx
import { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

type Props = {
  children: ReactNode
}

// If no token in localStorage, redirect to /login
export function RequireAuth({ children }: Props) {
  const token = localStorage.getItem('token')
  const location = useLocation()

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }
  return <>{children}</>
}
