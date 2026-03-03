import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

let supabaseInstance: SupabaseClient | null = null

if (supabaseUrl && supabaseAnonKey) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey)
} else {
    console.warn(
        '[RiteHire] Missing Supabase env vars. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env — UI will render with empty states.'
    )
}

// Proxy that returns empty results when Supabase isn't configured
const emptyResponse = { data: null, error: null, count: 0 }
const emptySelectBuilder: any = {
    select: () => emptySelectBuilder,
    insert: () => Promise.resolve(emptyResponse),
    update: () => emptySelectBuilder,
    delete: () => emptySelectBuilder,
    eq: () => emptySelectBuilder,
    neq: () => emptySelectBuilder,
    or: () => emptySelectBuilder,
    in: () => emptySelectBuilder,
    order: () => emptySelectBuilder,
    range: () => emptySelectBuilder,
    limit: () => emptySelectBuilder,
    single: () => Promise.resolve(emptyResponse),
    then: (resolve: any) => Promise.resolve(emptyResponse).then(resolve),
}

const fallbackClient = {
    from: () => emptySelectBuilder,
} as unknown as SupabaseClient

export const supabase: SupabaseClient = supabaseInstance || fallbackClient
