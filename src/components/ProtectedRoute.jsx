import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Spinner } from './Spinner'

export function ProtectedRoute() {
  const { loading, user } = useAuth()
  const location = useLocation()

  if (loading) return <Spinner label="جاري التحقق من تسجيل الدخول..." />
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />
  return <Outlet />
}

