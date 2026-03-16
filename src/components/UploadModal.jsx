import { useState } from 'react'
import { uploadNote } from '../services/notesService'

export function UploadModal({ open, onClose, onUploaded }) {
  const [subjectName, setSubjectName] = useState('')
  const [subjectCode, setSubjectCode] = useState('')
  const [description, setDescription] = useState('')
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (!open) return null

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const note = await uploadNote({
        subjectName,
        subjectCode,
        description,
        file,
      })
      onUploaded?.(note)
      onClose?.()
      setSubjectName('')
      setSubjectCode('')
      setDescription('')
      setFile(null)
    } catch (err) {
      setError(err?.message || 'حدث خطأ أثناء الرفع')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={() => (loading ? null : onClose?.())}
      />

      <div className="relative w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              رفع ملاحظات جديدة
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              ارفع ملف PDF مع بيانات المادة.
            </p>
          </div>
          <button
            className="rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 transition"
            onClick={() => (loading ? null : onClose?.())}
          >
            إغلاق
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              {error}
            </div>
          ) : null}

          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-1">
              <span className="text-sm font-medium text-slate-800">
                اسم المادة
              </span>
              <input
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/10"
                placeholder="مثال: رياضيات 1"
                required
              />
            </label>

            <label className="space-y-1">
              <span className="text-sm font-medium text-slate-800">
                كود المادة
              </span>
              <input
                value={subjectCode}
                onChange={(e) => setSubjectCode(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/10"
                placeholder="مثال: MATH101"
                required
              />
            </label>
          </div>

          <label className="space-y-1 block">
            <span className="text-sm font-medium text-slate-800">الوصف</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-24 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/10"
              placeholder="اكتب وصفاً مختصراً للملاحظات..."
            />
          </label>

          <label className="space-y-1 block">
            <span className="text-sm font-medium text-slate-800">ملف PDF</span>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              required
            />
          </label>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => (loading ? null : onClose?.())}
              className="rounded-xl px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 transition"
            >
              إلغاء
            </button>
            <button
              disabled={loading}
              className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60 transition"
              type="submit"
            >
              {loading ? 'جاري الرفع...' : 'رفع'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

