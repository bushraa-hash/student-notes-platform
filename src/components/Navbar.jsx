import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

function LinkItem({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          'px-3 py-2 rounded-lg text-sm transition',
          isActive
            ? 'bg-slate-900 text-white'
            : 'text-slate-700 hover:bg-slate-100',
        ].join(' ')
      }
    >
      {children}
    </NavLink>
  )
}

export function Navbar() {
  const { user, profile, isAdmin, signOut } = useAuth()
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-slate-900 text-white grid place-items-center font-bold">
              SN
            </div>
            <div className="leading-tight">
              <div className="font-semibold text-slate-900">
                منصة ملاحظات الطلاب
              </div>
              <div className="text-xs text-slate-500">
                رفع وتحميل ملخصات PDF بسهولة
              </div>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            <LinkItem to="/">الرئيسية</LinkItem>
            <LinkItem to="/notes">الملاحظات</LinkItem>
            {user && <LinkItem to="/dashboard">لوحة التحكم</LinkItem>}
            {isAdmin && <LinkItem to="/admin">لوحة الإدارة</LinkItem>}
          </nav>

          <div className="flex items-center gap-2">
            {!user ? (
              <>
                <NavLink
                  to="/login"
                  className="px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-100 transition"
                >
                  تسجيل الدخول
                </NavLink>
                <NavLink
                  to="/register"
                  className="px-3 py-2 rounded-lg text-sm bg-slate-900 text-white hover:bg-slate-800 transition"
                >
                  إنشاء حساب
                </NavLink>
              </>
            ) : (
              <>
                <div className="hidden sm:block text-sm text-slate-600">
                  مرحباً،{' '}
                  <span className="font-medium text-slate-900">
                    {profile?.full_name || user.email}
                  </span>
                </div>
                <button
                  onClick={async () => {
                    await signOut()
                    navigate('/')
                  }}
                  className="px-3 py-2 rounded-lg text-sm bg-red-50 text-red-700 hover:bg-red-100 transition"
                >
                  تسجيل الخروج
                </button>
              </>
            )}
          </div>
        </div>

        <nav className="md:hidden pb-3 flex flex-wrap gap-2">
          <LinkItem to="/">الرئيسية</LinkItem>
          <LinkItem to="/notes">الملاحظات</LinkItem>
          {user && <LinkItem to="/dashboard">لوحة التحكم</LinkItem>}
          {isAdmin && <LinkItem to="/admin">لوحة الإدارة</LinkItem>}
        </nav>
      </div>
    </header>
  )
}

