import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="mx-auto max-w-xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
      <div className="text-5xl font-black text-slate-900">404</div>
      <h1 className="mt-3 text-2xl font-bold text-slate-900">
        الصفحة غير موجودة
      </h1>
      <p className="mt-2 text-sm text-slate-600">
        الرابط الذي فتحته غير صحيح أو تم نقله.
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white hover:bg-slate-800 transition"
      >
        العودة للرئيسية
      </Link>
    </div>
  )
}

