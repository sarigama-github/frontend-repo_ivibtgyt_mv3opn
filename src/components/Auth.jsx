import { useState } from 'react'

export default function Auth({ onAuthed }) {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [isLogin, setIsLogin] = useState(true)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const url = isLogin ? `${baseUrl}/auth/login` : `${baseUrl}/auth/register`
      const body = isLogin ? { email, password } : { name, email, password }
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Request failed')

      if (isLogin) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        onAuthed({ token: data.token, user: data.user })
      } else {
        // After register, switch to login
        setIsLogin(true)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md w-full mx-auto bg-white/80 backdrop-blur p-6 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-slate-800 mb-2 text-center">Cyber Safety Trainer</h2>
      <p className="text-center text-slate-600 mb-6">Learn to spot phishing, avoid credential reuse, and stay safe with apps.</p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-2 rounded mb-4">{error}</div>
      )}

      <form onSubmit={submit} className="space-y-3">
        {!isLogin && (
          <div>
            <label className="block text-sm text-slate-700 mb-1">Name</label>
            <input value={name} onChange={e=>setName(e.target.value)} required className="w-full px-3 py-2 rounded border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Your name" />
          </div>
        )}
        <div>
          <label className="block text-sm text-slate-700 mb-1">Email</label>
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required className="w-full px-3 py-2 rounded border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="you@example.com" />
        </div>
        <div>
          <label className="block text-sm text-slate-700 mb-1">Password</label>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required className="w-full px-3 py-2 rounded border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="••••••••" />
        </div>
        <button disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition disabled:opacity-60">
          {loading ? 'Please wait…' : (isLogin ? 'Sign in' : 'Create account')}
        </button>
      </form>

      <div className="text-center mt-4">
        <button onClick={()=>setIsLogin(!isLogin)} className="text-sm text-blue-700 hover:underline">
          {isLogin ? "Don't have an account? Register" : 'Have an account? Sign in'}
        </button>
      </div>
    </div>
  )
}
