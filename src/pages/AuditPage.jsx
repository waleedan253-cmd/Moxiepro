import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function AuditPage() {
  const navigate = useNavigate()
  const [profileData, setProfileData] = useState({
    name: '',
    credentials: '',
    location: '',
    headline: '',
    aboutSection: '',
    specialties: '',
    pricing: '',
    insuranceInfo: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: Integrate with AI analysis service
    // For now, navigate to results with profile data
    navigate('/results', { state: { profileData } })
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Psychology Today Profile Audit
          </h1>
          <p className="text-lg text-gray-600">
            Fill in your profile information to receive a comprehensive 100-point audit
          </p>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Basic Information
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={profileData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    placeholder="e.g., John Smith"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Credentials
                  </label>
                  <input
                    type="text"
                    name="credentials"
                    value={profileData.credentials}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    placeholder="e.g., LCSW, PhD, LMFT"
                    required
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location (City, State)
                </label>
                <input
                  type="text"
                  name="location"
                  value={profileData.location}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  placeholder="e.g., Austin, TX"
                  required
                />
              </div>
            </div>

            {/* Profile Content */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Profile Content
              </h2>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Headline
                </label>
                <input
                  type="text"
                  name="headline"
                  value={profileData.headline}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Copy your current PT headline"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  About Section
                </label>
                <textarea
                  name="aboutSection"
                  value={profileData.aboutSection}
                  onChange={handleChange}
                  rows={8}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Paste your entire 'About' section from your PT profile"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Specialties (one per line)
                </label>
                <textarea
                  name="specialties"
                  value={profileData.specialties}
                  onChange={handleChange}
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Anxiety&#10;Depression&#10;Trauma&#10;PTSD&#10;etc."
                  required
                />
              </div>
            </div>

            {/* Pricing & Contact */}
            <div className="pb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Pricing & Insurance
              </h2>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Session Pricing
                </label>
                <input
                  type="text"
                  name="pricing"
                  value={profileData.pricing}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  placeholder="e.g., $150 per session, sliding scale available"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Insurance Information
                </label>
                <textarea
                  name="insuranceInfo"
                  value={profileData.insuranceInfo}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  placeholder="List insurance providers accepted or out-of-network details"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                className="w-full bg-primary-600 text-white px-6 py-4 rounded-md text-lg font-semibold hover:bg-primary-700 transition-colors"
              >
                Analyze My Profile
              </button>
              <p className="text-center text-sm text-gray-500 mt-4">
                Your audit will be ready in seconds
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
