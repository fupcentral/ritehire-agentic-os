import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { Deal } from '../lib/types'

interface UseDealsOptions {
    stage?: string
}

export function useDeals(options: UseDealsOptions = {}) {
    const [deals, setDeals] = useState<Deal[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        fetchDeals()
    }, [options.stage])

    async function fetchDeals() {
        setLoading(true)
        setError(null)
        try {
            let query = supabase
                .from('deals')
                .select('*, contact:contacts(*)')
                .order('created_at', { ascending: false })

            if (options.stage) query = query.eq('stage', options.stage)

            const { data, error: err } = await query

            if (err) throw err
            setDeals((data as Deal[]) || [])
        } catch (e: any) {
            setError(e.message || 'Failed to fetch deals')
            console.error('[useDeals]', e)
        } finally {
            setLoading(false)
        }
    }

    return { deals, loading, error, refetch: fetchDeals }
}
