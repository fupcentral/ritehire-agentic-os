import { useState, useEffect, useCallback } from 'react'
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

    const checkSupabase = useCallback(async (): Promise<ServiceStatus> => {
        try {
            const start = performance.now()
            const { error } = await supabase.from('agents').select('id').limit(1)
            const latency = Math.round(performance.now() - start)
            return {
                name: 'Supabase',
                status: error ? 'error' : 'connected',
                latency,
                detail: error ? error.message : `${latency}ms`,
            }
        } catch {
            return { name: 'Supabase', status: 'error', detail: 'Unreachable' }
        }
    }, [])

    const checkGitHub = useCallback(async (): Promise<ServiceStatus> => {
        try {
            const start = performance.now()
            // Fetch GitHub's favicon — lightweight, no auth, no CORS issues
            await fetch('https://github.githubassets.com/favicons/favicon.svg', {
                mode: 'no-cors',
                signal: AbortSignal.timeout(5000),
            })
            const latency = Math.round(performance.now() - start)
            // no-cors returns opaque response (status 0) but if it doesn't throw, it's reachable
            return {
                name: 'GitHub',
                status: 'connected',
                latency,
                detail: `${latency}ms`,
            }
        } catch {
            return { name: 'GitHub', status: 'error', detail: 'Unreachable' }
        }
    }, [])

    const checkVite = useCallback(async (): Promise<ServiceStatus> => {
        // If we're rendering, Vite is alive
        return {
            name: 'Vite Dev Server',
            status: 'connected',
            detail: 'localhost:5173',
        }
    }, [])

    const checkers: Record<string, () => Promise<ServiceStatus>> = {
        Supabase: checkSupabase,
        GitHub: checkGitHub,
        'Vite Dev Server': checkVite,
    }

    // Check a single service and update state
    const recheckService = useCallback(async (serviceName: string) => {
        // Set that service to 'checking'
        setServices((prev) =>
            prev.map((s) => (s.name === serviceName ? { ...s, status: 'checking' as const } : s))
        )

        const checker = checkers[serviceName]
        if (!checker) return

        const result = await checker()
        setServices((prev) => prev.map((s) => (s.name === serviceName ? result : s)))
        setLastChecked(new Date())
    }, [checkSupabase, checkGitHub, checkVite])

    // Check all services
    const checkAll = useCallback(async () => {
        setServices((prev) => prev.map((s) => ({ ...s, status: 'checking' as const })))

        const results = await Promise.all([checkSupabase(), checkGitHub(), checkVite()])
        setServices(results)
        setLastChecked(new Date())
    }, [checkSupabase, checkGitHub, checkVite])

    useEffect(() => {
        checkAll()
        const interval = setInterval(checkAll, 60000)
        return () => clearInterval(interval)
    }, [checkAll])

    return { services, lastChecked, refetch: checkAll, recheckService }
}
