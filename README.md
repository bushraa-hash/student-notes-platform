# منصة ملاحظات الطلاب (Student Notes Platform)

مشروع Full‑Stack (فرونت) مبني باستخدام:

- React + Vite
- Tailwind CSS
- Supabase (Auth + Database + Storage)

## المميزات

- تسجيل/دخول/خروج عبر Supabase Authentication
- رفع ملفات PDF (للمستخدمين المسجلين فقط)
- عرض الملاحظات كبطاقات مع تنزيل PDF
- بحث حسب اسم المادة أو كود المادة
- لوحة تحكم لرفع الملاحظات
- لوحة إدارة (Admin) لحذف الملاحظات والملفات

## تشغيل المشروع محلياً

1) تثبيت الاعتماديات:

```bash
npm install
```

2) إنشاء ملف `.env` (انسخ من `.env.example`) ثم ضع بيانات Supabase:

```bash
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

3) تشغيل السيرفر:

```bash
npm run dev
```

## إعداد Supabase

### 1) إنشاء Bucket للملفات

- أنشئ Bucket باسم: `notes`
- اجعله **Public** (لتنزيل الملف عبر رابط مباشر)

### 2) إنشاء الجداول والسياسات (SQL)

> ملاحظة: لا يمكن تعديل جدول `auth.users` مباشرة كـ “users table” بالشكل المعتاد، لذلك نستخدم جدول `profiles` لتخزين `role` و `full_name` (وهذا هو الأسلوب القياسي في Supabase).

افتح Supabase → SQL Editor وشغّل التالي:

```sql
-- 1) جدول الملفات/الملاحظات
create table if not exists public.notes (
  id bigserial primary key,
  subject_name text not null,
  subject_code text not null,
  description text,
  file_url text not null,
  created_at timestamptz not null default now(),
  user_id uuid not null references auth.users(id) on delete cascade
);

-- 2) جدول البروفايل + الدور
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'student' check (role in ('admin', 'student'))
);

alter table public.notes enable row level security;
alter table public.profiles enable row level security;

-- قراءة الملاحظات للجميع
create policy "notes_select_public"
on public.notes for select
to anon, authenticated
using (true);

-- إدخال الملاحظات للمستخدمين المسجلين فقط
create policy "notes_insert_authenticated"
on public.notes for insert
to authenticated
with check (auth.uid() = user_id);

-- حذف الملاحظات: للأدمن فقط (بناءً على profiles.role)
create policy "notes_delete_admin_only"
on public.notes for delete
to authenticated
using (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  )
);

-- قراءة/تعديل البروفايل: صاحب الحساب فقط
create policy "profiles_select_own"
on public.profiles for select
to authenticated
using (auth.uid() = id);

create policy "profiles_upsert_own"
on public.profiles for insert
to authenticated
with check (auth.uid() = id);

create policy "profiles_update_own"
on public.profiles for update
to authenticated
using (auth.uid() = id);

-- Trigger لإنشاء profile تلقائياً عند التسجيل
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, role)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''), 'student')
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();
```

### 2.1) سياسات Storage (رفع/حذف الملفات)

في Supabase Storage يتم تطبيق سياسات RLS على جدول `storage.objects`. شغّل التالي للسماح بالرفع للمستخدمين المسجلين، والحذف للأدمن فقط داخل Bucket `notes`:

```sql
-- السماح بالقراءة للجميع (لأن الـ Bucket public)
create policy "storage_read_notes_public"
on storage.objects for select
to public
using (bucket_id = 'notes');

-- السماح بالرفع للمسجلين فقط
create policy "storage_upload_notes_authenticated"
on storage.objects for insert
to authenticated
with check (bucket_id = 'notes');

-- السماح بالحذف للأدمن فقط
create policy "storage_delete_notes_admin_only"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'notes'
  and exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  )
);
```

### 3) جعل مستخدم أدمن

بعد إنشاء حساب (تسجيل في الموقع)، غيّر دوره من لوحة SQL:

```sql
update public.profiles
set role = 'admin'
where id = '<USER_UUID_HERE>';
```

## الصفحات (Routes)

- `/` الرئيسية (آخر الملاحظات + بحث)
- `/notes` صفحة الملاحظات (بحث + بطاقات)
- `/login` تسجيل الدخول
- `/register` إنشاء حساب
- `/dashboard` لوحة التحكم (محمي)
- `/admin` لوحة الإدارة (محمي للأدمن فقط)
