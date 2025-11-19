import { useEffect, useState } from 'react'

export default function Quiz({ token, category }) {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError('')
      try {
        const res = await fetch(`${baseUrl}/content/questions?category=${category}&limit=10`)
        const data = await res.json()
        setQuestions(data)
      } catch (e) {
        setError('Failed to load questions')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [category])

  const submit = async () => {
    try {
      const ordered = questions.map((_, i) => answers[i] ?? -1)
      const res = await fetch(`${baseUrl}/attempt/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, category, answers: ordered })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Submission failed')
      setResult(data)
    } catch (e) {
      setError(e.message)
    }
  }

  if (loading) return <div className="text-white">Loading questions…</div>
  if (error) return <div className="text-red-300">{error}</div>
  if (!questions.length) return <div className="text-white">No questions yet for this topic.</div>

  if (result) {
    return (
      <div className="bg-slate-800/60 border border-blue-500/20 rounded-xl p-6 text-white">
        <h3 className="text-2xl font-bold mb-2">Your score: {result.score}%</h3>
        <p className="mb-4">You answered {result.correct} out of {result.total} correctly.</p>
        <button onClick={() => { setResult(null); setAnswers({}) }} className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700">Try again</button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {questions.map((q, idx) => (
        <div key={q.id} className="bg-slate-800/60 border border-blue-500/20 rounded-xl p-4 text-white">
          <p className="font-semibold mb-2">{idx + 1}. {q.prompt}</p>
          <div className="space-y-2">
            {q.options.map((opt, i) => (
              <label key={i} className={`flex items-center gap-2 p-2 rounded cursor-pointer ${answers[idx] === i ? 'bg-blue-600/30' : 'bg-slate-700/30'} hover:bg-slate-700/50`}>
                <input type="radio" name={`q_${idx}`} checked={answers[idx] === i} onChange={() => setAnswers(a => ({ ...a, [idx]: i }))} />
                <span>{opt}</span>
              </label>
            ))}
          </div>
        </div>
      ))}

      <button onClick={submit} className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white">Submit</button>
    </div>
  )
}
