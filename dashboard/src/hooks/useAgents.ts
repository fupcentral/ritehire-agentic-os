import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { Agent, Skill } from '../lib/types'

export function useAgents() {
    const [agents, setAgents] = useState<Agent[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetch = useCallback(async () => {
        setLoading(true)
        setError(null)

        const { data: agentsData, error: agentsErr } = await supabase
            .from('agents')
            .select('*')
            .order('created_at')

        if (agentsErr) {
            setError(agentsErr.message)
            setLoading(false)
            return
        }

        const { data: skillsData } = await supabase
            .from('skills')
            .select('*')
            .order('name')

        const skillsByAgent = (skillsData || []).reduce<Record<string, Skill[]>>((acc, skill) => {
            if (!acc[skill.agent_id]) acc[skill.agent_id] = []
            acc[skill.agent_id].push(skill)
            return acc
        }, {})

        const agentsWithSkills = (agentsData || []).map((agent) => ({
            ...agent,
            skills: skillsByAgent[agent.id] || [],
        }))

        setAgents(agentsWithSkills)
        setLoading(false)
    }, [])

    useEffect(() => { fetch() }, [fetch])

    return { agents, loading, error, refetch: fetch }
}
