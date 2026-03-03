import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { Contact } from '../lib/types'

interface UseContactsOptions {
    outreachStatus?: string
    search?: string
}

export function useContacts(options: UseContactsOptions = {}) {
    const [contacts, setContacts] = useState<Contact[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        fetchContacts()
    }, [options.outreachStatus, options.search])

    async function fetchContacts() {
        setLoading(true)
        setError(null)
        try {
            let query = supabase
                .from('contacts')
                .select('*')
                .order('created_at', { ascending: false })

            if (options.outreachStatus) {
                query = query.eq('outreach_status', options.outreachStatus)
            }

            const { data, error: err } = await query

            if (err) throw err
            let results = (data as Contact[]) || []

            // Client-side search filter
            if (options.search) {
                const term = options.search.toLowerCase()
                results = results.filter(
                    (c) =>
                        c.name.toLowerCase().includes(term) ||
                        (c.company || '').toLowerCase().includes(term) ||
                        (c.email || '').toLowerCase().includes(term)
                )
            }

            setContacts(results)
        } catch (e: any) {
            setError(e.message || 'Failed to fetch contacts')
            console.error('[useContacts]', e)
        } finally {
            setLoading(false)
        }
    }

    async function addContact(contact: Partial<Contact>) {
        const { data, error: err } = await supabase
            .from('contacts')
            .insert([contact])
            .select()

        if (err) throw err
        await fetchContacts()
        return data
    }

    return { contacts, loading, error, refetch: fetchContacts, addContact }
}
