import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react'
import type { User, Session } from '@supabase/supabase-js'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import type { Database, UserRole } from '../data/database.types'

type ProfileRow = Database['public']['Tables']['profiles']['Row']
type SellerRow = Database['public']['Tables']['sellers']['Row']
type RiderRow = Database['public']['Tables']['riders']['Row']

export interface SignUpParams {
  email: string
  password: string
  fullName: string
  phone: string
  role: 'seller' | 'rider'
  businessName?: string
  area?: string
  vehicleType?: 'bike' | 'bicycle' | 'van'
}

interface AuthContextValue {
  user: User | null
  session: Session | null
  profile: ProfileRow | null
  seller: SellerRow | null
  rider: RiderRow | null
  role: UserRole | null
  loading: boolean
  error: string | null
  signInWithEmail: (
    email: string,
    password: string,
  ) => Promise<{ error: Error | null }>
  signUpWithEmail: (
    params: SignUpParams,
  ) => Promise<{ error: Error | null; needsEmailConfirmation?: boolean }>
  signInDemo: (demoRole: UserRole, name: string, email: string) => void
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<ProfileRow | null>(null)
  const [seller, setSeller] = useState<SellerRow | null>(null)
  const [rider, setRider] = useState<RiderRow | null>(null)
  const [loading, setLoading] = useState<boolean>(() =>
    Boolean(supabase && isSupabaseConfigured),
  )
  const [error, setError] = useState<string | null>(null)

  const fetchProfileData = useCallback(async (userId: string) => {
    if (!supabase) return
    try {
      // 1. Fetch profile
      const { data: pData, error: pError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (pError) throw pError
      setProfile(pData)

      // 2. Fetch role-specific details
      if (pData.role === 'seller') {
        const { data: sData } = await supabase
          .from('sellers')
          .select('*')
          .eq('profile_id', userId)
          .maybeSingle()
        setSeller(sData)
        setRider(null)
      } else if (pData.role === 'rider') {
        const { data: rData } = await supabase
          .from('riders')
          .select('*')
          .eq('profile_id', userId)
          .maybeSingle()
        setRider(rData)
        setSeller(null)
      } else {
        setSeller(null)
        setRider(null)
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : 'Failed to fetch user profile'
      setError(msg)
    }
  }, [])

  useEffect(() => {
    if (!supabase || !isSupabaseConfigured) {
      return
    }

    let mounted = true

    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfileData(session.user.id).finally(() => {
          if (mounted) setLoading(false)
        })
      } else {
        setLoading(false)
      }
    })

    // Listen to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (!mounted) return
      setSession(newSession)
      setUser(newSession?.user ?? null)
      if (newSession?.user) {
        setLoading(true)
        fetchProfileData(newSession.user.id).finally(() => {
          if (mounted) setLoading(false)
        })
      } else {
        setProfile(null)
        setSeller(null)
        setRider(null)
        setLoading(false)
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [fetchProfileData])

  const signInWithEmail = async (email: string, password: string) => {
    setError(null)
    if (!supabase) {
      return { error: new Error('Supabase is not configured') }
    }
    const { data, error: signInError } = await supabase.auth.signInWithPassword(
      {
        email,
        password,
      },
    )
    if (signInError) {
      setError(signInError.message)
      return { error: signInError }
    }
    if (data.user) {
      await fetchProfileData(data.user.id)
    }
    return { error: null }
  }

  const signUpWithEmail = async (params: SignUpParams) => {
    setError(null)
    if (!supabase) {
      return { error: new Error('Supabase is not configured') }
    }

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: params.email,
      password: params.password,
      options: {
        data: {
          full_name: params.fullName,
          phone: params.phone,
          role: params.role,
          business_name: params.businessName || `${params.fullName}'s Business`,
          area: params.area || 'Ikeja',
          vehicle_type: params.vehicleType || 'bike',
        },
      },
    })

    if (signUpError) {
      setError(signUpError.message)
      return { error: signUpError }
    }

    if (data.user) {
      // Direct client upsert backup in case DB trigger is not yet active
      try {
        await supabase.from('profiles').upsert({
          id: data.user.id,
          role: params.role,
          full_name: params.fullName,
          phone: params.phone,
          status: 'active',
        })

        if (params.role === 'seller') {
          await supabase.from('sellers').upsert({
            profile_id: data.user.id,
            business_name:
              params.businessName || `${params.fullName}'s Business`,
            phone: params.phone,
            area: params.area || 'Ikeja',
          })
        } else if (params.role === 'rider') {
          await supabase.from('riders').upsert({
            profile_id: data.user.id,
            vehicle_type: params.vehicleType || 'bike',
            status: 'available',
            current_zone: params.area || 'Ikeja',
          })
        }
      } catch {
        // Handled by Postgres trigger if client RLS restricts insert
      }

      if (data.session) {
        await fetchProfileData(data.user.id)
        return { error: null, needsEmailConfirmation: false }
      } else {
        return { error: null, needsEmailConfirmation: true }
      }
    }

    return { error: null }
  }

  const signInDemo = (demoRole: UserRole, name: string, email: string) => {
    const demoId =
      demoRole === 'admin'
        ? '00000000-0000-0000-0000-000000000001'
        : demoRole === 'rider'
          ? '00000000-0000-0000-0000-000000000023'
          : '00000000-0000-0000-0000-000000000011'

    setUser({
      id: demoId,
      app_metadata: {},
      user_metadata: { full_name: name },
      aud: 'authenticated',
      created_at: new Date().toISOString(),
      email,
    } as User)

    setProfile({
      id: demoId,
      role: demoRole,
      full_name: name,
      phone: '+2348032214455',
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })

    if (demoRole === 'seller') {
      setSeller({
        id: '11111111-0000-0000-0000-000000000001',
        profile_id: '00000000-0000-0000-0000-000000000011',
        business_name: 'Adunni Fashion Hub',
        phone: '+2348032214455',
        area: 'Lekki Phase 1',
        address: '14 Admiralty Way, Lekki',
        approved_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      setRider(null)
    } else if (demoRole === 'rider') {
      setRider({
        id: '22222222-0000-0000-0000-000000000003',
        profile_id: '00000000-0000-0000-0000-000000000023',
        vehicle_type: 'bike',
        status: 'on_delivery',
        current_zone: 'Yaba',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      setSeller(null)
    } else {
      setSeller(null)
      setRider(null)
    }
  }

  const signOut = async () => {
    if (supabase) {
      await supabase.auth.signOut()
    }
    setUser(null)
    setSession(null)
    setProfile(null)
    setSeller(null)
    setRider(null)
  }

  const role = profile?.role ?? null

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        seller,
        rider,
        role,
        loading,
        error,
        signInWithEmail,
        signUpWithEmail,
        signInDemo,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
