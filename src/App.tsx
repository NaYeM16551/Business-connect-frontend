// src/App.tsx
import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'

import Index from './pages/Index'
import VerifyEmail from './pages/VerifyEmail'
import CompleteRegistration from './pages/CompleteRegistration'
import Login from './pages/Login'
import Feed from './pages/Feed'
import NotFound from './pages/NotFound'
import { RequireAuth } from '@/components/RequireAuth'

const queryClient = new QueryClient()

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />

        <Routes>
          {/* Public */}
          <Route path="/" element={<Index />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/login" element={<Login />} />

          {/* Protected */}
          <Route
            path="/complete-registration"
            element={
              <RequireAuth>
                <CompleteRegistration />
              </RequireAuth>
            }
          />
          <Route
            path="/feed"
            element={
              <RequireAuth>
                <Feed />
              </RequireAuth>
            }
          />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </QueryClientProvider>
  )
}
