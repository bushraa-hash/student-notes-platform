import { supabase } from '../supabaseClient'

const BUCKET = 'notes'

function getPublicUrl(path) {
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return data?.publicUrl ?? null
}

function normalizeQuery(q) {
  return (q ?? '').toString().trim()
}

export async function listLatestNotes({ limit = 6 } = {}) {
  const { data, error } = await supabase
    .from('notes')
    .select(
      'id, subject_name, subject_code, description, file_url, created_at, user_id'
    )
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data ?? []
}

export async function listNotes({ query } = {}) {
  const q = normalizeQuery(query)

  let req = supabase
    .from('notes')
    .select(
      'id, subject_name, subject_code, description, file_url, created_at, user_id'
    )
    .order('created_at', { ascending: false })

  if (q) {
    req = req.or(`subject_name.ilike.%${q}%,subject_code.ilike.%${q}%`)
  }

  const { data, error } = await req
  if (error) throw error
  return data ?? []
}

export async function listMyNotes() {
  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser()
  if (userErr) throw userErr
  if (!user) return []

  const { data, error } = await supabase
    .from('notes')
    .select(
      'id, subject_name, subject_code, description, file_url, created_at, user_id'
    )
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data ?? []
}

export async function uploadNote({ subjectName, subjectCode, description, file }) {
  const subject_name = (subjectName ?? '').trim()
  const subject_code = (subjectCode ?? '').trim()
  const desc = (description ?? '').trim()

  if (!subject_name) throw new Error('اسم المادة مطلوب')
  if (!subject_code) throw new Error('كود المادة مطلوب')
  if (!file) throw new Error('ملف PDF مطلوب')
  if (file.type !== 'application/pdf') throw new Error('يجب رفع ملف PDF فقط')

  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser()
  if (userErr) throw userErr
  if (!user) throw new Error('يجب تسجيل الدخول أولاً')

  const safeCode = subject_code.replace(/[^\w.-]+/g, '-')
  const filePath = `${user.id}/${Date.now()}-${safeCode}.pdf`

  const { error: uploadErr } = await supabase.storage
    .from(BUCKET)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: 'application/pdf',
    })
  if (uploadErr) throw uploadErr

  const file_url = getPublicUrl(filePath)
  if (!file_url) throw new Error('تعذر إنشاء رابط الملف')

  const { data, error } = await supabase
    .from('notes')
    .insert({
      subject_name,
      subject_code,
      description: desc,
      file_url,
      user_id: user.id,
    })
    .select(
      'id, subject_name, subject_code, description, file_url, created_at, user_id'
    )
    .single()

  if (error) throw error
  return data
}

function extractBucketPathFromPublicUrl(publicUrl) {
  // شكل الرابط غالباً:
  // https://<project>.supabase.co/storage/v1/object/public/notes/<PATH>
  const marker = `/storage/v1/object/public/${BUCKET}/`
  const idx = publicUrl.indexOf(marker)
  if (idx === -1) return null
  return publicUrl.slice(idx + marker.length)
}

export async function deleteNote({ id, fileUrl }) {
  if (!id) throw new Error('المعرف مطلوب')

  // احذف الملف من Storage (إن أمكن استخراج المسار)
  if (fileUrl) {
    const path = extractBucketPathFromPublicUrl(fileUrl)
    if (path) {
      await supabase.storage.from(BUCKET).remove([path])
    }
  }

  const { error } = await supabase.from('notes').delete().eq('id', id)
  if (error) throw error
}

