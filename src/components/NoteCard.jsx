export function NoteCard({ note, onDelete, showDelete }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            {note.subject_name}
          </h3>
          <p className="mt-1 text-sm text-slate-600">{note.subject_code}</p>
        </div>
        {showDelete ? (
          <button
            onClick={() => onDelete?.(note)}
            className="shrink-0 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 hover:bg-red-100 transition"
          >
            حذف
          </button>
        ) : null}
      </div>

      <p className="mt-3 text-sm text-slate-700 leading-relaxed">
        {note.description || 'لا يوجد وصف.'}
      </p>

      <div className="mt-4 flex items-center justify-between gap-3">
        <a
          href={note.file_url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 transition w-full"
        >
          تحميل PDF
        </a>
      </div>
    </div>
  )
}

