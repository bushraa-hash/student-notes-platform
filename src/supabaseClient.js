import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'متغيرات البيئة الخاصة بـ Supabase غير موجودة. تأكد من إعداد VITE_SUPABASE_URL و VITE_SUPABASE_ANON_KEY في ملف .env'
  )
}

export const supabase = createClient(supabaseUrl ?? '', supabaseAnonKey ?? '')

