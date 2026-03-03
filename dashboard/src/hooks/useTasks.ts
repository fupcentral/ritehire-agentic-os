import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { Task } from '../lib/types'

interface UseTasksOptions {
    agentId?: string
    status?: string
    limit?: number
}

export function useTasks(options: UseTasksOptions = {}) {
    const [tasks, setTasks] = useState<Task[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        fetchTasks()
    }, [options.agentId, options.status])

    async function fetchTasks() {
        setLoading(true)
        setError(null)
        try {
            let query = supabase
                .from('tasks')
                .select('*, agent:agents(*)')
                .order('created_at', { ascending: false })

            if (options.agentId) query = query.eq('agent_id', options.agentId)
            if (options.status) query = query.eq('status', options.status)
            if (options.limit) query = query.limit(options.limit)

            const { data, error: err } = await query

            if (err) throw err
            setTasks((data as Task[]) || [])
        } catch (e: any) {
            setError(e.message || 'Failed to fetch tasks')
            console.error('[useTasks]', e)
        } finally {
            setLoading(false)
        }
    }

    return { tasks, loading, error, refetch: fetchTasks }
}
