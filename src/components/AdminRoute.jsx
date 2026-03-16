import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Spinner } from './Spinner'

export function AdminRoute() {
  const { loading, user, isAdmin } = useAuth()

  if (loading) return <Spinner label="جاري تحميل الصلاحيات..." />
  if (!user) return <Navigate to="/login" replace />
  if (!isAdmin) return <Navigate to="/" replace />
  return <Outlet />
}

