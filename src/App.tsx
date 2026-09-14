import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from '@/hooks/use-theme'
import { AuthProvider } from '@/hooks/use-auth'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { AppShell } from '@/components/layout/AppShell'
import Login from '@/pages/auth/Login'
import Signup from '@/pages/auth/Signup'
import Conversations from '@/pages/Conversations'
import Products from '@/pages/Products'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            <Route
              path="/conversations"
              element={
                <ProtectedRoute>
                  <AppShell>
                    <Conversations />
                  </AppShell>
                </ProtectedRoute>
              }
            />
            <Route
              path="/products"
              element={
                <ProtectedRoute>
                  <AppShell>
                    <Products />
                  </AppShell>
                </ProtectedRoute>
              }
            />

            <Route path="/" element={<Navigate to="/conversations" replace />} />
            <Route path="*" element={<Navigate to="/conversations" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
