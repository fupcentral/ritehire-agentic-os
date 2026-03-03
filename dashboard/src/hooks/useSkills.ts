import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { Skill } from '../lib/types'

export function useSkills() {
    const [skills, setSkills] = useState<Skill[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        fetchSkills()
    }, [])

    async function fetchSkills() {
        setLoading(true)
        setError(null)
        try {
            // PK is 'id' (UUID), not 'skill_id'
            const { data, error: err } = await supabase
                .from('skills')
                .select('*, agent:agents(*)')
                .order('name', { ascending: true })

            if (err) throw err
            setSkills((data as Skill[]) || [])
        } catch (e: any) {
            setError(e.message || 'Failed to fetch skills')
            console.error('[useSkills]', e)
        } finally {
            setLoading(false)
        }
    }

    return { skills, loading, error, refetch: fetchSkills }
}
