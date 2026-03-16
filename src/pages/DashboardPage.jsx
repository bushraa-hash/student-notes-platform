import { useEffect, useMemo, useState } from 'react'
import { UploadModal } from '../components/UploadModal'
import { NoteCard } from '../components/NoteCard'
import { Spinner } from '../components/Spinner'
import { listMyNotes } from '../services/notesService'

export function DashboardPage() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notes, setNotes] = useState([])

  async function refresh() {
    setLoading(true)
    setError('')
    try {
      const data = await listMyNotes()
      setNotes(data)
    } catch (e) {
      setError(e?.message || 'تعذر تحميل ملاحظاتك')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
  }, [])

  const items = useMemo(() => notes ?? [], [notes])

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">لوحة التحكم</h1>
          <p className="mt-1 text-sm text-slate-600">
            من هنا يمكنك رفع ملفات PDF الخاصة بملاحظاتك.
          </p>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white hover:bg-slate-800 transition"
        >
          رفع ملاحظات
        </button>
      </div>

      <UploadModal
        open={open}
        onClose={() => setOpen(false)}
        onUploaded={() => refresh()}
      />

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">ملاحظاتي</h2>
          <button
            onClick={() => refresh()}
            className="text-sm text-slate-700 hover:text-slate-900"
          >
            تحديث
          </button>
        </div>

        {loading ? <Spinner label="جاري تحميل ملاحظاتك..." /> : null}
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
              لم تقم برفع أي ملاحظات بعد.
            </div>
          )
        ) : null}
      </section>
    </div>
  )
}

