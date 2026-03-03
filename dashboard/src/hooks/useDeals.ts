import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { Deal } from '../lib/types'

export function useDeals() {
    const [deals, setDeals] = useState<Deal[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetch = useCallback(async () => {
        setLoading(true)
        setError(null)

        const { data, error: err } = await supabase
            .from('deals')
            .select(`*, contact:contacts(*)`)
            .order('created_at', { ascending: false })

        if (err) {
            setError(err.message)
            setLoading(false)
            return
        }

        setDeals(data || [])
        setLoading(false)
    }, [])

    useEffect(() => { fetch() }, [fetch])

    return { deals, loading, error, refetch: fetch }
}
