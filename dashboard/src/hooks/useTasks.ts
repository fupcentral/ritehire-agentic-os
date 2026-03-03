import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { Task } from '../lib/types'

interface UseTasksOptions {
    agentFilter?: string
    statusFilter?: string
}

export function useTasks(options?: UseTasksOptions) {
    const [tasks, setTasks] = useState<Task[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetch = useCallback(async () => {
        setLoading(true)
        setError(null)

        let query = supabase
            .from('tasks')
            .select('*, agent:agents(*)')
            .order('created_at', { ascending: false })

        if (options?.agentFilter && options.agentFilter !== 'all') {
            query = query.eq('agent_id', options.agentFilter)
        }
        if (options?.statusFilter && options.statusFilter !== 'all') {
            query = query.eq('status', options.statusFilter)
        }

        const { data, error: err } = await query

        if (err) {
            setError(err.message)
            setLoading(false)
            return
        }

        setTasks(data || [])
        setLoading(false)
    }, [options?.agentFilter, options?.statusFilter])

    useEffect(() => { fetch() }, [fetch])

    return { tasks, loading, error, refetch: fetch }
}
