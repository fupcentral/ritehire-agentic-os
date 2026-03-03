import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { ActivityLogEntry } from '../lib/types'

interface UseActivityLogOptions {
    agentFilter?: string
    actionTypeFilter?: string
    statusFilter?: string
    riskFilter?: string
    limit?: number
    page?: number
}

export function useActivityLog(options?: UseActivityLogOptions) {
    const [entries, setEntries] = useState<ActivityLogEntry[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [totalCount, setTotalCount] = useState(0)

    const limit = options?.limit || 50
    const page = options?.page || 0

    const fetch = useCallback(async () => {
        setLoading(true)
        setError(null)

        let query = supabase
            .from('activity_log')
            .select('*, agent:agents(*)', { count: 'exact' })
            .order('created_at', { ascending: false })
            .range(page * limit, (page + 1) * limit - 1)

        if (options?.agentFilter && options.agentFilter !== 'all') {
            query = query.eq('agent_id', options.agentFilter)
        }
        if (options?.actionTypeFilter && options.actionTypeFilter !== 'all') {
            query = query.eq('action_type', options.actionTypeFilter)
        }
        if (options?.statusFilter && options.statusFilter !== 'all') {
            query = query.eq('status', options.statusFilter)
        }
        if (options?.riskFilter && options.riskFilter !== 'all') {
            query = query.eq('risk_level', options.riskFilter)
        }

        const { data, error: err, count } = await query

        if (err) {
            setError(err.message)
            setLoading(false)
            return
        }

        setEntries(data || [])
        setTotalCount(count || 0)
        setLoading(false)
    }, [options?.agentFilter, options?.actionTypeFilter, options?.statusFilter, options?.riskFilter, limit, page])

    useEffect(() => { fetch() }, [fetch])

    return { entries, loading, error, totalCount, refetch: fetch }
}
