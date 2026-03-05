import { useState } from 'react'
import { Terminal, GitBranch, Loader2, CheckCircle, XCircle } from 'lucide-react'

interface Repo {
  name: string
  path: string
  status?: 'pending' | 'running' | 'success' | 'error'
  message?: string
}

export default function OmniUpdate() {
  const [concept, setConcept] = useState('')
  const [isExecuting, setIsExecuting] = useState(false)
  const [repos] = useState<Repo[]>([
    { name: 'ritehire-agent-os', path: '/Users/nabeelsaeed/Documents/ritehire-agent-os' },
    { name: 'ritehire-agentic-os', path: '/Users/nabeelsaeed/Documents/YES/ritehire-agentic-os' },
    { name: 'YES', path: '/Users/nabeelsaeed/Documents/YES' },
    { name: 'psp-orch-mvp', path: '/Users/nabeelsaeed/Desktop/psp-orch-mvp/psp-orch' },
    { name: 'psp-orch', path: '/Users/nabeelsaeed/Desktop/psp-orchestration-mvp/psp-orch' },
  ])
  const [repoStatuses, setRepoStatuses] = useState<Repo[]>(repos)
  const [logs, setLogs] = useState<string[]>([])

  const executeOmni = async () => {
    if (!concept.trim()) return

    setIsExecuting(true)
    setLogs([`🚀 Executing: "${concept}"`, ''])

    // Reset statuses
    setRepoStatuses(repos.map(r => ({ ...r, status: 'pending' })))

    try {
      // Call the omni-update backend
      const response = await fetch('http://localhost:3001/api/omni', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ concept })
      })

      const result = await response.json()

      if (result.success) {
        setLogs(prev => [...prev, '✅ Execution complete!', '', ...result.logs])
        setRepoStatuses(result.repos || repos.map(r => ({ ...r, status: 'success' })))
      } else {
        setLogs(prev => [...prev, '❌ Execution failed', result.error])
        setRepoStatuses(repos.map(r => ({ ...r, status: 'error', message: result.error })))
      }
    } catch (error) {
      setLogs(prev => [...prev, '❌ Connection error - is the backend running?'])
      setRepoStatuses(repos.map(r => ({ ...r, status: 'error' })))
    } finally {
      setIsExecuting(false)
    }
  }

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'running':
        return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />
      default:
        return <GitBranch className="w-4 h-4 text-gray-400" />
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <Terminal className="w-8 h-8 text-blue-500" />
        <div>
          <h1 className="text-3xl font-bold">Omni-Update</h1>
          <p className="text-gray-600">Execute concepts across all repositories</p>
        </div>
      </div>

      {/* Command Input */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <label className="block text-sm font-medium mb-2">Conceptual Command</label>
        <div className="flex gap-3">
          <input
            type="text"
            value={concept}
            onChange={(e) => setConcept(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && executeOmni()}
            placeholder='e.g. "add error logging to all services"'
            className="flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isExecuting}
          />
          <button
            onClick={executeOmni}
            disabled={isExecuting || !concept.trim()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isExecuting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Executing...
              </>
            ) : (
              'Execute'
            )}
          </button>
        </div>
      </div>

      {/* Repository Status */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-lg font-semibold mb-4">Repositories ({repoStatuses.length})</h2>
        <div className="space-y-2">
          {repoStatuses.map((repo, idx) => (
            <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              {getStatusIcon(repo.status)}
              <div className="flex-1">
                <div className="font-medium">{repo.name}</div>
                <div className="text-sm text-gray-500">{repo.path}</div>
                {repo.message && (
                  <div className="text-sm mt-1 text-gray-600">{repo.message}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Execution Logs */}
      {logs.length > 0 && (
        <div className="bg-gray-900 rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4 text-white">Execution Log</h2>
          <div className="font-mono text-sm text-green-400 space-y-1 max-h-96 overflow-y-auto">
            {logs.map((log, idx) => (
              <div key={idx}>{log}</div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            'add error logging',
            'update README files',
            'add TypeScript config',
            'update dependencies',
            'add MIT license',
            'create .env.example'
          ].map((action) => (
            <button
              key={action}
              onClick={() => setConcept(action)}
              className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50 text-left"
              disabled={isExecuting}
            >
              {action}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
