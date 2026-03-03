import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { ActivityLogEntry } from '../lib/types'

interface UseActivityLogOptions {
    agentId?: string | string[]
    agentName?: string | string[]
    status?: string
    limit?: number
}

export function useActivityLog(options: UseActivityLogOptions = {}) {
    const [entries, setEntries] = useState<ActivityLogEntry[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const agentIdKey =
        typeof options.agentId === 'string' ? options.agentId : options.agentId?.join(',')
    const agentNameKey =
        typeof options.agentName === 'string' ? options.agentName : options.agentName?.join(',')

    useEffect(() => {
        fetchEntries()
    }, [agentIdKey, agentNameKey, options.status, options.limit])

    async function fetchEntries() {
        setLoading(true)
        setError(null)
        try {
            let query = supabase
                .from('activity_log')
                .select('*, agent:agents(*)')
                .order('created_at', { ascending: false })

            if (options.agentId) {
                if (Array.isArray(options.agentId)) {
                    query = query.in('agent_id', options.agentId)
                } else {
                    query = query.eq('agent_id', options.agentId)
                }
            }
            if (options.status) query = query.eq('status', options.status)
            if (options.limit) query = query.limit(options.limit)

            const { data, error: err } = await query

            if (err) throw err

            let results = (data as ActivityLogEntry[]) || []

            // Client-side filter by agent name if specified
            // (handles UUID agent_ids where we only know agent name)
            if (options.agentName) {
                const names = Array.isArray(options.agentName)
                    ? options.agentName.map((n) => n.toLowerCase())
                    : [options.agentName.toLowerCase()]
                results = results.filter(
                    (e) => e.agent && names.some((n) => e.agent!.name.toLowerCase().includes(n))
                )
            }

            setEntries(results)
        } catch (e: any) {
            setError(e.message || 'Failed to fetch activity log')
            console.error('[useActivityLog]', e)
        } finally {
            setLoading(false)
        }
    }

    return { entries, loading, error, refetch: fetchEntries }
}
