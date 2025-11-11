import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function AuditPage() {
  const navigate = useNavigate()
  const [profileUrl, setProfileUrl] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Validate Psychology Today URL
      if (!profileUrl.includes('psychologytoday.com')) {
        throw new Error('Please enter a valid Psychology Today profile URL')
      }

      // Call the create-audit API
      const response = await fetch('/api/create-audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profileUrl, email })
      })

      const data = await response.json()

      if (!response.ok) {
        // Better error handling
        const errorMessage = data.error || data.message || JSON.stringify(data) || 'Failed to create audit'
        throw new Error(errorMessage)
      }

      // Navigate to results page with audit ID
      navigate(`/results?id=${data.data?.auditId || data.auditId}`)
    } catch (err) {
      console.error('Audit creation error:', err)
      const errorMessage = err.message || 'An unexpected error occurred'
      setError(errorMessage)
      setLoading(false)
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Get Your Free PT Profile Audit
          </h1>
          <p className="text-lg text-gray-600">
            Enter your Psychology Today profile URL and get a comprehensive 100-point audit in seconds
          </p>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Psychology Today Profile URL
              </label>
              <input
                type="url"
                value={profileUrl}
                onChange={(e) => setProfileUrl(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 text-lg"
                placeholder="https://www.psychologytoday.com/us/therapists/..."
                required
                disabled={loading}
              />
              <p className="text-sm text-gray-500 mt-2">
                Copy and paste your full Psychology Today profile URL
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 text-lg"
                placeholder="your@email.com"
                required
                disabled={loading}
              />
              <p className="text-sm text-gray-500 mt-2">
                We'll send your audit results here
              </p>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-600 text-white px-6 py-4 rounded-md text-lg font-semibold hover:bg-primary-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? 'Analyzing Your Profile...' : 'Get Free Audit'}
              </button>
              <p className="text-center text-sm text-gray-500 mt-4">
                {loading ? 'This may take 30-60 seconds...' : 'Your audit will be ready in seconds'}
              </p>
            </div>
          </form>
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            What You'll Receive
          </h3>
          <ul className="space-y-2 text-blue-800">
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>Overall score out of 100 with performance level rating</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>Top 5 critical issues affecting your profile performance</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>Section-by-section breakdown across all 6 categories</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>Actionable recommendations to improve your profile</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>Revenue opportunity analysis</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default AuditPage
