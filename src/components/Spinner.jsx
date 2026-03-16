export function Spinner({ label = 'جاري التحميل...' }) {
  return (
    <div className="min-h-[50vh] w-full flex items-center justify-center">
      <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-700" />
        <span className="text-sm text-slate-700">{label}</span>
      </div>
    </div>
  )
}

