import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export interface ServiceStatus {
    name: string
    status: 'connected' | 'error' | 'checking'
    latency?: number
    detail?: string
}

export function useServiceStatus() {
    const [services, setServices] = useState<ServiceStatus[]>([
        { name: 'Supabase', status: 'checking' },
        { name: 'GitHub', status: 'checking' },
        { name: 'Vite Dev Server', status: 'checking' },
    ])
    const [lastChecked, setLastChecked] = useState<Date | null>(null)

    useEffect(() => {
        checkAll()
        const interval = setInterval(checkAll, 60000) // Re-check every 60s
        return () => clearInterval(interval)
    }, [])

    async function checkAll() {
        const results: ServiceStatus[] = []

        // 1. Supabase — ping agents table
        try {
            const start = performance.now()
            const { error } = await supabase
                .from('agents')
                .select('id')
                .limit(1)
            const latency = Math.round(performance.now() - start)
            results.push({
                name: 'Supabase',
                status: error ? 'error' : 'connected',
                latency,
                detail: error ? error.message : `${latency}ms`,
            })
        } catch {
            results.push({ name: 'Supabase', status: 'error', detail: 'Unreachable' })
        }

        // 2. GitHub — check if repo URL is reachable  
        try {
            const start = performance.now()
            const resp = await fetch('https://api.github.com/repos/fupcentral/ritehire-agentic-os', {
                method: 'HEAD',
                signal: AbortSignal.timeout(5000),
            })
            const latency = Math.round(performance.now() - start)
            results.push({
                name: 'GitHub',
                status: resp.ok ? 'connected' : 'error',
                latency,
                detail: resp.ok ? `${latency}ms` : `HTTP ${resp.status}`,
            })
        } catch {
            results.push({ name: 'GitHub', status: 'error', detail: 'Unreachable' })
        }

        // 3. Vite Dev Server — always connected if we're running
        results.push({
            name: 'Vite Dev Server',
            status: 'connected',
            detail: 'localhost:5173',
        })

        setServices(results)
        setLastChecked(new Date())
    }

    return { services, lastChecked, refetch: checkAll }
}
