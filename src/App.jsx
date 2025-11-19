import { useEffect, useState } from 'react'
import Auth from './components/Auth'
import Quiz from './components/Quiz'
import Dashboard from './components/Dashboard'

function App() {
  const [session, setSession] = useState(null)
  const [category, setCategory] = useState('phishing')

  useEffect(() => {
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('user')
    if (token && user) setSession({ token, user: JSON.parse(user) })
  }, [])

  const signOut = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setSession(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_50%)]"></div>

      <div className="relative min-h-screen p-6">
        <header className="max-w-5xl mx-auto flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <img src="/flame-icon.svg" className="w-10 h-10" />
            <div>
              <h1 className="text-white text-2xl font-bold">Cyber Safety Trainer</h1>
              <p className="text-blue-200 text-sm">Learn safe digital habits through quick, fun quizzes</p>
            </div>
          </div>
          <a href="/test" className="text-blue-300 hover:text-white text-sm">System Check</a>
        </header>

        <main className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-6">
            <div className="bg-slate-800/60 border border-blue-500/20 rounded-xl p-4">
              <h2 className="text-white font-semibold mb-3">Modules</h2>
              <div className="flex flex-col gap-2">
                {[
                  {key:'phishing', label:'Phishing'},
                  {key:'credential', label:'Credential Reuse'},
                  {key:'rogueapps', label:'Rogue Apps'}
                ].map(m => (
                  <button key={m.key} onClick={()=>setCategory(m.key)} className={`text-left px-3 py-2 rounded ${category===m.key?'bg-blue-600 text-white':'bg-white/5 text-blue-200 hover:bg-white/10'}`}>{m.label}</button>
                ))}
              </div>
            </div>

            {session && (
              <div className="bg-slate-800/60 border border-blue-500/20 rounded-xl p-4">
                <Dashboard token={session.token} onSignOut={signOut} />
              </div>
            )}
          </div>

          <div className="md:col-span-2 space-y-6">
            {!session ? (
              <Auth onAuthed={setSession} />
            ) : (
              <div className="bg-slate-800/60 border border-blue-500/20 rounded-xl p-4">
                <h2 className="text-white font-semibold mb-4">Quiz: {category}</h2>
                <Quiz token={session.token} category={category} />
              </div>
            )}

            <div className="bg-slate-800/60 border border-blue-500/20 rounded-xl p-4 text-blue-200 text-sm">
              <h3 className="text-white font-semibold mb-2">How it helps</h3>
              <ul className="list-disc ml-6 space-y-1">
                <li>Spot phishing attempts using real-world scenarios</li>
                <li>Avoid password reuse and strengthen account security</li>
                <li>Identify rogue mobile apps and safer installation practices</li>
              </ul>
            </div>
          </div>
        </main>

        <footer className="max-w-5xl mx-auto mt-8 text-center text-blue-300/70 text-sm">
          Practice makes safe. Keep your data protected.
        </footer>
      </div>
    </div>
  )
}

export default App
