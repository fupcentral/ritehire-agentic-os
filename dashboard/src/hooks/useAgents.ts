import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { Agent, Skill } from '../lib/types'

export function useAgents() {
    const [agents, setAgents] = useState<Agent[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        fetchAgents()
    }, [])

    async function fetchAgents() {
        setLoading(true)
        setError(null)
        try {
            const { data, error: err } = await supabase
                .from('agents')
                .select('*, skills(*)')
                .order('created_at', { ascending: true })

            if (err) throw err
            setAgents((data as Agent[]) || [])
        } catch (e: any) {
            setError(e.message || 'Failed to fetch agents')
            console.error('[useAgents]', e)
        } finally {
            setLoading(false)
        }
    }

    return { agents, loading, error, refetch: fetchAgents }
}

export function useAgentSkills(agentId: string | null) {
    const [skills, setSkills] = useState<Skill[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!agentId) return
        setLoading(true)
        supabase
            .from('skills')
            .select('*')
            .eq('agent_id', agentId)
            .then(({ data }) => {
                setSkills((data as Skill[]) || [])
                setLoading(false)
            })
    }, [agentId])

    return { skills, loading }
}
