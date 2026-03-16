import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../supabaseClient'
import { AuthContext } from './authContext'

async function fetchProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, role')
    .eq('id', userId)
    .maybeSingle()

  if (error) throw error
  return data
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    supabase.auth.getSession().then(async ({ data, error }) => {
      if (!mounted) return
      if (error) {
        setLoading(false)
        return
      }
      setSession(data.session ?? null)
      if (data.session?.user?.id) {
        try {
          const p = await fetchProfile(data.session.user.id)
          setProfile(p ?? null)
        } catch {
          setProfile(null)
        }
      } else {
        setProfile(null)
      }
      setLoading(false)
    })

    const { data: sub } = supabase.auth.onAuthStateChange(
      async (_event, nextSession) => {
        if (!mounted) return
        setSession(nextSession ?? null)
        if (nextSession?.user?.id) {
          try {
            const p = await fetchProfile(nextSession.user.id)
            setProfile(p ?? null)
          } catch {
            setProfile(null)
          }
        } else {
          setProfile(null)
        }
      }
    )

    return () => {
      mounted = false
      sub?.subscription?.unsubscribe?.()
    }
  }, [])

  const value = useMemo(() => {
    return {
      loading,
      session,
      user: session?.user ?? null,
      profile,
      isAdmin: profile?.role === 'admin',
      async signIn({ email, password }) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
      },
      async signUp({ fullName, email, password }) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
          },
        })
        if (error) throw error

        // في حال عدم وجود Trigger لإنشاء profile
        const userId = data.user?.id
        if (userId) {
          await supabase.from('profiles').upsert({
            id: userId,
            full_name: fullName,
            role: 'student',
          })
        }

        return data
      },
      async signOut() {
        const { error } = await supabase.auth.signOut()
        if (error) throw error
      },
    }
  }, [loading, session, profile])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

