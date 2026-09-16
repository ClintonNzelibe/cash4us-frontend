import { Navigate, Route, Routes } from 'react-router-dom'

import { useAuth } from '../context/AuthContext'
import AppLayout from '../components/layout/AppLayout'

import LoginPage from '../pages/auth/LoginPage'
import RegisterPage from '../pages/auth/RegisterPage'
import DashboardPage from '../pages/dashboard/DashboardPage'
import PackagesPage from '../pages/packages/PackagesPage'
import PackageDetailsPage from '../pages/packages/PackageDetailsPage'
import MyPackagesPage from '../pages/packages/MyPackagesPage'
import PaymentPage from '../pages/payments/PaymentPage'

function HomeRedirect() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) return null

  return (
    <Navigate
      to={isAuthenticated ? '/dashboard' : '/login'}
      replace
    />
  )
}

function ProtectedRoute({
  children,
}: {
  children: React.ReactNode
}) {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) return null

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<HomeRedirect />} />

      <Route path="/login" element={<LoginPage />} />

      <Route path="/register" element={<RegisterPage />} />

      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />

        <Route path="/packages" element={<PackagesPage />} />

        <Route
          path="/packages/my"
          element={<MyPackagesPage />}
        />

        <Route
          path="/packages/:slug"
          element={<PackageDetailsPage />}
        />

        <Route
          path="/packages/:slug/payment"
          element={<PaymentPage />}
        />
      </Route>

      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
    </Routes>
  )
}