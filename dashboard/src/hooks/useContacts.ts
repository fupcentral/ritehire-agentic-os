import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { Contact } from '../lib/types'

interface UseContactsOptions {
    statusFilter?: string
    searchQuery?: string
}

export function useContacts(options?: UseContactsOptions) {
    const [contacts, setContacts] = useState<Contact[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetch = useCallback(async () => {
        setLoading(true)
        setError(null)

        let query = supabase
            .from('contacts')
            .select('*')
            .order('created_at', { ascending: false })

        if (options?.statusFilter && options.statusFilter !== 'all') {
            query = query.eq('outreach_status', options.statusFilter)
        }

        if (options?.searchQuery) {
            query = query.or(
                `name.ilike.%${options.searchQuery}%,company.ilike.%${options.searchQuery}%`
            )
        }

        const { data, error: err } = await query

        if (err) {
            setError(err.message)
            setLoading(false)
            return
        }

        setContacts(data || [])
        setLoading(false)
    }, [options?.statusFilter, options?.searchQuery])

    useEffect(() => { fetch() }, [fetch])

    return { contacts, loading, error, refetch: fetch }
}
