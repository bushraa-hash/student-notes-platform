import { useEffect, useMemo, useState } from 'react'
import { NoteCard } from '../components/NoteCard'
import { Spinner } from '../components/Spinner'
import { deleteNote, listNotes } from '../services/notesService'

export function AdminPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notes, setNotes] = useState([])
  const [busyId, setBusyId] = useState(null)

  async function refresh() {
    setLoading(true)
    setError('')
    try {
      const data = await listNotes()
      setNotes(data)
    } catch (e) {
      setError(e?.message || 'تعذر تحميل الملاحظات')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
  }, [])

  const items = useMemo(() => notes ?? [], [notes])

  async function onDelete(note) {
    const ok = window.confirm(
      `هل تريد حذف "${note.subject_name}" (${note.subject_code})؟ سيتم حذف الملف أيضاً.`
    )
    if (!ok) return
    setBusyId(note.id)
    try {
      await deleteNote({ id: note.id, fileUrl: note.file_url })
      setNotes((prev) => prev.filter((n) => n.id !== note.id))
    } catch (e) {
      alert(e?.message || 'تعذر الحذف')
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">لوحة الإدارة</h1>
          <p className="mt-1 text-sm text-slate-600">
            حذف الملاحظات وإدارة الملفات المرفوعة.
          </p>
        </div>
        <button
          onClick={() => refresh()}
          className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-900 hover:bg-slate-50 transition"
        >
          تحديث
        </button>
      </div>

      <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        تنبيه: الحذف هنا نهائي وسيقوم بحذف السجل من قاعدة البيانات ومحاولة حذف
        الملف من Storage.
      </div>

      {loading ? <Spinner label="جاري تحميل..." /> : null}
      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      ) : null}

      {!loading && !error ? (
        items.length ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((n) => (
              <div key={n.id} className={busyId === n.id ? 'opacity-60' : ''}>
                <NoteCard note={n} showDelete onDelete={onDelete} />
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
            لا توجد ملاحظات.
          </div>
        )
      ) : null}
    </div>
  )
}

