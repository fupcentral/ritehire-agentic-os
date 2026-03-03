import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { Epic } from '../lib/types'

export function useEpics() {
    const [epics, setEpics] = useState<Epic[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetch = useCallback(async () => {
        setLoading(true)
        setError(null)

        const { data, error: err } = await supabase
            .from('epics')
            .select('*')
            .order('created_at', { ascending: false })

        if (err) {
            setError(err.message)
            setLoading(false)
            return
        }

        setEpics(data || [])
        setLoading(false)
    }, [])

    useEffect(() => { fetch() }, [fetch])

    return { epics, loading, error, refetch: fetch }
}
