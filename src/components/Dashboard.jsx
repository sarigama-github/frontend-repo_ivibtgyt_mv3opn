import { useEffect, useState } from 'react'

export default function Dashboard({ token, onSignOut }) {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [progress, setProgress] = useState({})
  const [active, setActive] = useState('phishing')

  const load = async () => {
    try {
      const res = await fetch(`${baseUrl}/progress?token=${token}`)
      const data = await res.json()
      setProgress(data.by_category || {})
    } catch (e) {
      // ignore
    }
  }

  useEffect(() => { load() }, [])

  const Stat = ({ title, value }) => (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
      <div className="text-sm text-blue-200/80">{title}</div>
      <div className="text-2xl font-bold text-white">{value}</div>
    </div>
  )

  const cats = [
    { key: 'phishing', label: 'Phishing' },
    { key: 'credential', label: 'Credential Reuse' },
    { key: 'rogueapps', label: 'Rogue Apps' }
  ]

  const catStats = progress[active] || { attempts: 0, best_score: 0, last_score: 0 }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-white">Your Progress</h3>
        <button onClick={onSignOut} className="text-sm text-blue-300 hover:text-white">Sign out</button>
      </div>

      <div className="flex gap-2">
        {cats.map(c => (
          <button key={c.key} onClick={() => setActive(c.key)} className={`px-3 py-2 rounded text-sm ${active===c.key?'bg-blue-600 text-white':'bg-white/5 text-blue-200 hover:bg-white/10'}`}>{c.label}</button>
        ))}
        <button onClick={load} className="ml-auto px-3 py-2 rounded text-sm bg-white/5 text-blue-200 hover:bg-white/10">Refresh</button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Stat title="Attempts" value={catStats.attempts} />
        <Stat title="Best Score" value={`${catStats.best_score}%`} />
        <Stat title="Last Score" value={`${catStats.last_score}%`} />
      </div>
    </div>
  )
}
