import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export function RegisterPage() {
  const { signUp } = useAuth()
  const navigate = useNavigate()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function onSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')
    try {
      const data = await signUp({ fullName, email, password })
      const hasSession = Boolean(data?.session)

      if (hasSession) {
        navigate('/dashboard')
        return
      }

      setSuccess(
        'تم إنشاء الحساب بنجاح. قد تحتاج لتأكيد البريد الإلكتروني أولاً، ثم قم بتسجيل الدخول.'
      )
      navigate('/login', {
        replace: true,
        state: {
          info:
            'تم إنشاء الحساب. إذا كان تأكيد البريد مفعّلًا، افحص بريدك ثم سجّل الدخول.',
          email,
        },
      })
    } catch (err) {
      setError(err?.message || 'تعذر إنشاء الحساب')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">إنشاء حساب</h1>
        <p className="mt-2 text-sm text-slate-600">
          أنشئ حساباً جديداً لرفع الملاحظات.
        </p>

        {error ? (
          <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </div>
        ) : null}
        {success ? (
          <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
            {success}
          </div>
        ) : null}

        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <label className="block space-y-1">
            <span className="text-sm font-medium text-slate-800">الاسم</span>
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-900/10"
              placeholder="اسمك الكامل"
            />
          </label>

          <label className="block space-y-1">
            <span className="text-sm font-medium text-slate-800">
              البريد الإلكتروني
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-900/10"
              placeholder="name@example.com"
            />
          </label>

          <label className="block space-y-1">
            <span className="text-sm font-medium text-slate-800">كلمة المرور</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-900/10"
              placeholder="على الأقل 6 أحرف"
            />
          </label>

          <button
            disabled={loading}
            className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60 transition"
          >
            {loading ? 'جاري الإنشاء...' : 'إنشاء حساب'}
          </button>
        </form>

        <p className="mt-5 text-sm text-slate-600">
          لديك حساب بالفعل؟{' '}
          <Link className="text-slate-900 font-medium hover:underline" to="/login">
            تسجيل الدخول
          </Link>
        </p>
      </div>
    </div>
  )
}

