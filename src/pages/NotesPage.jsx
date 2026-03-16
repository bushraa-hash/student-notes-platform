import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { NoteCard } from '../components/NoteCard'
import { Spinner } from '../components/Spinner'
import { listNotes } from '../services/notesService'

export function NotesPage() {
  const [params, setParams] = useSearchParams()
  const initialQ = params.get('q') ?? ''

  const [q, setQ] = useState(initialQ)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notes, setNotes] = useState([])

  useEffect(() => {
    setQ(initialQ)
  }, [initialQ])

  useEffect(() => {
    let mounted = true
    setLoading(true)
    setError('')
    listNotes({ query: initialQ })
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
  }, [initialQ])

  const items = useMemo(() => notes ?? [], [notes])

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">الملاحظات</h1>
          <p className="mt-1 text-sm text-slate-600">
            ابحث حسب اسم المادة أو كود المادة.
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            const next = q.trim()
            if (next) setParams({ q: next })
            else setParams({})
          }}
          className="flex w-full md:w-[420px] gap-2"
        >
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="ابحث... (مثال: CS201)"
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-900/10"
          />
          <button className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white hover:bg-slate-800 transition">
            بحث
          </button>
        </form>
      </div>

      {loading ? <Spinner label="جاري تحميل الملاحظات..." /> : null}
      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      ) : null}

      {!loading && !error ? (
        items.length ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((n) => (
              <NoteCard key={n.id} note={n} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
            لا توجد نتائج مطابقة.
          </div>
        )
      ) : null}
    </div>
  )
}

