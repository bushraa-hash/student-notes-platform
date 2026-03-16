import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { NoteCard } from '../components/NoteCard'
import { Spinner } from '../components/Spinner'
import { listLatestNotes } from '../services/notesService'

export function HomePage() {
  const navigate = useNavigate()
  const [q, setQ] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notes, setNotes] = useState([])

  useEffect(() => {
    let mounted = true
    setError('')
    listLatestNotes({ limit: 6 })
      .then((data) => {
        if (!mounted) return
        setNotes(data)
      })
      .catch((e) => {
        if (!mounted) return
        setError(e?.message || 'تعذر تحميل الملاحظات')
      })
      .finally(() => {
        if (!mounted) return
        setLoading(false)
      })
    return () => {
      mounted = false
    }
  }, [])

  const latest = useMemo(() => notes ?? [], [notes])

  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-white border border-slate-200 p-6 md:p-10 shadow-sm">
        <div className="grid gap-8 md:grid-cols-2 md:items-center">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
              منصة ملاحظات الطلاب
            </h1>
            <p className="mt-3 text-slate-600 leading-relaxed">
              حمّل ملاحظات وملخصات المواد بصيغة PDF، وابحث بسرعة حسب اسم أو كود
              المادة.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                const query = q.trim()
                navigate(query ? `/notes?q=${encodeURIComponent(query)}` : '/notes')
              }}
              className="mt-6 flex gap-2"
            >
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="ابحث عن مادة... مثال: MATH101"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-900/10"
              />
              <button className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white hover:bg-slate-800 transition">
                بحث
              </button>
            </form>
          </div>

          <div className="rounded-2xl bg-slate-900 text-white p-6 md:p-8">
            <h2 className="text-xl font-semibold">مميزات سريعة</h2>
            <ul className="mt-3 space-y-2 text-sm text-slate-200">
              <li>بحث حسب اسم المادة أو الكود</li>
              <li>رفع ملفات PDF (للمسجلين فقط)</li>
              <li>تنزيل مباشر من داخل البطاقة</li>
              <li>لوحة إدارة لحذف الملاحظات (للأدمن)</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              أحدث الملاحظات
            </h2>
            <p className="text-sm text-slate-600">
              آخر الملفات المرفوعة على المنصة
            </p>
          </div>
          <button
            onClick={() => navigate('/notes')}
            className="text-sm text-slate-700 hover:text-slate-900"
          >
            عرض الكل
          </button>
        </div>

        {loading ? <Spinner label="جاري تحميل أحدث الملاحظات..." /> : null}
        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </div>
        ) : null}

        {!loading && !error ? (
          latest.length ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {latest.map((n) => (
                <NoteCard key={n.id} note={n} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
              لا توجد ملاحظات حتى الآن. كن أول من يرفع ملفاً من لوحة التحكم.
            </div>
          )
        ) : null}
      </section>
    </div>
  )
}

