'use client'

import { useState } from 'react'

interface WaitlistFormProps {
  className?: string
  darkMode?: boolean
  source?: string
}

export default function WaitlistForm({ className = '', darkMode = false, source = 'landing' }: WaitlistFormProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !email.includes('@')) {
      setStatus('error')
      setMessage('Please enter a valid email')
      return
    }

    setStatus('loading')

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source }),
      })

      const data = await res.json()

      if (res.ok) {
        setStatus('success')
        setMessage(data.duplicate ? "You're already on the list! 🎉" : "You're in! We'll email you soon 🚀")
        setEmail('')
      } else {
        setStatus('error')
        setMessage(data.error || 'Something went wrong')
      }
    } catch (err) {
      setStatus('error')
      setMessage('Network error. Please try again.')
    }
  }

  if (status === 'success') {
    return (
      <div className={`${className} text-center`}>
        <div className={`p-6 rounded-2xl ${darkMode ? 'bg-emerald-900/50' : 'bg-emerald-50'}`}>
          <div className="text-4xl mb-3">🎉</div>
          <p className={`font-semibold ${darkMode ? 'text-white' : 'text-emerald-800'}`}>
            {message}
          </p>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="flex gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          disabled={status === 'loading'}
          className={`flex-1 px-5 py-4 border-2 rounded-xl outline-none transition-all disabled:opacity-50 ${
            darkMode
              ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-900/50'
              : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100'
          }`}
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-400 text-white px-8 py-4 rounded-xl font-semibold transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-200 whitespace-nowrap disabled:transform-none"
        >
          {status === 'loading' ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Joining...
            </span>
          ) : (
            'Get Started Free'
          )}
        </button>
      </div>
      
      {status === 'error' && (
        <p className="mt-2 text-red-500 text-sm">{message}</p>
      )}
    </form>
  )
}
