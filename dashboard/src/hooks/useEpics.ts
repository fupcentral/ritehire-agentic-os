import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { Epic } from '../lib/types'

export function useEpics() {
    const [epics, setEpics] = useState<Epic[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        fetchEpics()
    }, [])

    async function fetchEpics() {
        setLoading(true)
        setError(null)
        try {
            const { data, error: err } = await supabase
                .from('epics')
                .select('*')
                .order('created_at', { ascending: false })

            if (err) throw err
            setEpics((data as Epic[]) || [])
        } catch (e: any) {
            setError(e.message || 'Failed to fetch epics')
            console.error('[useEpics]', e)
        } finally {
            setLoading(false)
        }
    }

    return { epics, loading, error, refetch: fetchEpics }
}
